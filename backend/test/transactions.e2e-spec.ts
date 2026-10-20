import { type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaService } from '../src/prisma.service.js';
import {
  bearer,
  createApp,
  createTransaction,
  listCategories,
  registerUser,
  type Server,
} from './helpers.js';

describe('Movimentacoes', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, server, prisma } = await createApp());
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@teste.com' } },
    });
    await app.close();
  });

  // Usuario novo com a primeira categoria e um atalho para criar movimentacoes
  async function setup() {
    const user = await registerUser(server);
    const [category, other] = await listCategories(server, user.token);
    const create = (overrides: Record<string, unknown> = {}) =>
      createTransaction(server, user.token, {
        type: 'EXPENSE',
        description: 'Mercado',
        amount: 100,
        date: '2026-10-01',
        categoryId: category.id,
        ...overrides,
      });
    return { ...user, category, other, create };
  }

  describe('cadastro', () => {
    it('cria uma movimentacao do usuario', async () => {
      const { create, category } = await setup();
      const res = await create({ amount: 250.5 });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        type: 'EXPENSE',
        description: 'Mercado',
        amount: '250.5',
        categoryId: category.id,
      });
    });

    it('RN01/RN10: recusa valor zero, negativo ou com mais de 2 casas', async () => {
      const { create } = await setup();
      for (const amount of [0, -5, 1.234]) {
        const res = await create({ amount });
        expect(res.status).toBe(400);
      }
    });

    it('RN10: recusa valor acima do limite do banco', async () => {
      const { create } = await setup();
      expect((await create({ amount: 100000000 })).status).toBe(400);
      expect((await create({ amount: 99999999.99 })).status).toBe(201);
    });

    it('RN02: o tipo deve ser INCOME ou EXPENSE', async () => {
      const { create } = await setup();
      expect((await create({ type: 'entrada' })).status).toBe(400);
      expect((await create({ type: undefined })).status).toBe(400);
    });

    it('recusa data invalida e descricao vazia', async () => {
      const { create } = await setup();
      expect((await create({ date: 'ontem' })).status).toBe(400);
      expect((await create({ description: '' })).status).toBe(400);
    });

    it('nao aceita o campo userId enviado pelo cliente', async () => {
      const { create } = await setup();
      expect((await create({ userId: 1 })).status).toBe(400);
    });
  });

  describe('RN03/RN08: isolamento entre usuarios', () => {
    it('outro usuario nao ve, edita nem apaga a movimentacao', async () => {
      const a = await setup();
      const b = await registerUser(server);
      const created = await a.create();
      const url = `/transactions/${created.body.id}`;

      await request(server).get(url).set(bearer(b.token)).expect(404);
      await request(server)
        .patch(url)
        .set(bearer(b.token))
        .send({ description: 'invadida' })
        .expect(404);
      await request(server).delete(url).set(bearer(b.token)).expect(404);

      const list = await request(server)
        .get('/transactions')
        .set(bearer(b.token))
        .expect(200);
      expect(list.body).toEqual([]);

      // continua intacta para o dono
      const mine = await request(server)
        .get(url)
        .set(bearer(a.token))
        .expect(200);
      expect(mine.body.description).toBe('Mercado');
    });

    it('nao permite usar categoria de outro usuario (criar e editar)', async () => {
      const a = await setup();
      const b = await setup();

      expect((await a.create({ categoryId: b.category.id })).status).toBe(404);

      const created = await a.create();
      await request(server)
        .patch(`/transactions/${created.body.id}`)
        .set(bearer(a.token))
        .send({ categoryId: b.category.id })
        .expect(404);
    });

    it('o saldo e a exportacao de um usuario nao incluem dados de outro', async () => {
      const a = await setup();
      const b = await setup();
      await a.create({ type: 'INCOME', amount: 1000, description: 'SegredoDoA' });
      await b.create({ type: 'INCOME', amount: 5 });

      const summary = await request(server)
        .get('/transactions/summary')
        .set(bearer(b.token))
        .expect(200);
      expect(summary.body.balance).toBe('5.00');

      const csv = await request(server)
        .get('/transactions/export')
        .set(bearer(b.token))
        .expect(200);
      expect(csv.text).not.toContain('SegredoDoA');
    });
  });

  describe('edicao e exclusao', () => {
    it('edita parcialmente e remove', async () => {
      const { create, token } = await setup();
      const created = await create();
      const url = `/transactions/${created.body.id}`;

      const edited = await request(server)
        .patch(url)
        .set(bearer(token))
        .send({ description: 'Feira', amount: 80 })
        .expect(200);
      expect(edited.body).toMatchObject({ description: 'Feira', amount: '80' });
      expect(edited.body.type).toBe('EXPENSE'); // campos nao enviados ficam

      await request(server).delete(url).set(bearer(token)).expect(200);
      await request(server).get(url).set(bearer(token)).expect(404);
    });

    it('a edicao tambem respeita a regra de valor positivo', async () => {
      const { create, token } = await setup();
      const created = await create();
      await request(server)
        .patch(`/transactions/${created.body.id}`)
        .set(bearer(token))
        .send({ amount: -1 })
        .expect(400);
    });
  });

  describe('RN09: saldo', () => {
    it('entradas somam e saidas subtraem', async () => {
      const { create, token } = await setup();
      await create({ type: 'INCOME', amount: 1000 });
      await create({ type: 'EXPENSE', amount: 250.5 });
      await create({ type: 'EXPENSE', amount: 0.25 });

      const res = await request(server)
        .get('/transactions/summary')
        .set(bearer(token))
        .expect(200);
      expect(res.body).toEqual({
        income: '1000.00',
        expense: '250.75',
        balance: '749.25',
      });
    });

    it('sem movimentacoes tudo e zero', async () => {
      const { token } = await setup();
      const res = await request(server)
        .get('/transactions/summary')
        .set(bearer(token))
        .expect(200);
      expect(res.body).toEqual({
        income: '0.00',
        expense: '0.00',
        balance: '0.00',
      });
    });

    it('saldo negativo quando as saidas superam as entradas', async () => {
      const { create, token } = await setup();
      await create({ type: 'INCOME', amount: 10 });
      await create({ type: 'EXPENSE', amount: 30 });
      const res = await request(server)
        .get('/transactions/summary')
        .set(bearer(token))
        .expect(200);
      expect(res.body.balance).toBe('-20.00');
    });

    it('precisao decimal: 0.1 + 0.2 = 0.30', async () => {
      const { create, token } = await setup();
      await create({ type: 'INCOME', amount: 0.1 });
      await create({ type: 'INCOME', amount: 0.2 });
      const res = await request(server)
        .get('/transactions/summary')
        .set(bearer(token))
        .expect(200);
      expect(res.body.income).toBe('0.30');
    });
  });

  describe('listagem e filtros', () => {
    it('filtra por tipo, categoria e periodo', async () => {
      const { create, token, category, other } = await setup();
      await create({ date: '2026-09-10', description: 'Setembro' });
      await create({ date: '2026-10-10', description: 'Outubro' });
      await create({
        date: '2026-10-20',
        type: 'INCOME',
        description: 'Salario',
        categoryId: other.id,
      });

      const get = async (query: string) =>
        (
          await request(server)
            .get(`/transactions?${query}`)
            .set(bearer(token))
            .expect(200)
        ).body.map((t: { description: string }) => t.description);

      expect(await get('type=INCOME')).toEqual(['Salario']);
      expect(await get(`categoryId=${other.id}`)).toEqual(['Salario']);
      expect((await get(`categoryId=${category.id}`)).sort()).toEqual([
        'Outubro',
        'Setembro',
      ]);
      expect(await get('from=2026-10-01&to=2026-10-31')).toEqual([
        'Salario',
        'Outubro',
      ]);
      // limite inclusivo: a data final entra
      expect(await get('from=2026-10-10&to=2026-10-10')).toEqual(['Outubro']);
    });

    it('lista da mais recente para a mais antiga', async () => {
      const { create, token } = await setup();
      await create({ date: '2026-01-01', description: 'Antiga' });
      await create({ date: '2026-12-01', description: 'Recente' });
      const res = await request(server)
        .get('/transactions')
        .set(bearer(token))
        .expect(200);
      expect(res.body.map((t: { description: string }) => t.description)).toEqual([
        'Recente',
        'Antiga',
      ]);
    });

    it('o resumo respeita os filtros', async () => {
      const { create, token } = await setup();
      await create({ type: 'INCOME', amount: 500, date: '2026-09-01' });
      await create({ type: 'INCOME', amount: 70, date: '2026-10-01' });
      const res = await request(server)
        .get('/transactions/summary?from=2026-10-01')
        .set(bearer(token))
        .expect(200);
      expect(res.body.income).toBe('70.00');
    });
  });

  describe('RN12: exportacao CSV', () => {
    it('gera CSV com cabecalho, tipo em portugues e valor com 2 casas', async () => {
      const { create, token } = await setup();
      await create({ type: 'INCOME', amount: 1500, description: 'Salario' });

      const res = await request(server)
        .get('/transactions/export')
        .set(bearer(token))
        .expect(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('movimentacoes.csv');

      const [header, row] = res.text.replace(/^﻿/, '').split('\r\n');
      expect(header).toBe('Data,Tipo,Descricao,Categoria,Valor');
      expect(row).toMatch(/^2026-10-01,Entrada,Salario,[^,]+,1500\.00$/);
    });

    it('escapa virgulas e aspas e neutraliza formulas', async () => {
      const { create, token } = await setup();
      await create({ description: 'Pao, leite e "ovos"' });
      await create({ description: '=HYPERLINK("http://x")' });

      const res = await request(server)
        .get('/transactions/export')
        .set(bearer(token))
        .expect(200);
      expect(res.text).toContain('"Pao, leite e ""ovos"""');
      // formula comeca com apostrofo, para o Excel tratar como texto
      expect(res.text).toContain(`"'=HYPERLINK(""http://x"")"`);
    });

    it('respeita os filtros', async () => {
      const { create, token } = await setup();
      await create({ description: 'Velha', date: '2026-01-01' });
      await create({ description: 'Nova', date: '2026-10-01' });
      const res = await request(server)
        .get('/transactions/export?from=2026-10-01')
        .set(bearer(token))
        .expect(200);
      expect(res.text).toContain('Nova');
      expect(res.text).not.toContain('Velha');
    });
  });
});
