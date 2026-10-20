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

describe('Categorias', () => {
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

  it('RN07: cria e edita categorias', async () => {
    const { token } = await registerUser(server);
    const created = await request(server)
      .post('/categories')
      .set(bearer(token))
      .send({ name: '  Saude  ' })
      .expect(201);
    expect(created.body.name).toBe('Saude'); // espacos removidos

    const edited = await request(server)
      .patch(`/categories/${created.body.id}`)
      .set(bearer(token))
      .send({ name: 'Saude e bem-estar' })
      .expect(200);
    expect(edited.body.name).toBe('Saude e bem-estar');
  });

  it('nao permite nome repetido, ignorando maiusculas', async () => {
    const { token } = await registerUser(server);
    await request(server)
      .post('/categories')
      .set(bearer(token))
      .send({ name: 'CASA' })
      .expect(409);
  });

  it('dois usuarios podem ter categorias com o mesmo nome', async () => {
    const a = await registerUser(server);
    const b = await registerUser(server);
    for (const user of [a, b]) {
      await request(server)
        .post('/categories')
        .set(bearer(user.token))
        .send({ name: 'Pets' })
        .expect(201);
    }
  });

  it('RN03: nao ve, edita nem apaga categorias de outro usuario', async () => {
    const a = await registerUser(server);
    const b = await registerUser(server);
    const [categoryOfA] = await listCategories(server, a.token);

    const list = await listCategories(server, b.token);
    expect(list.map((c) => c.id)).not.toContain(categoryOfA.id);

    await request(server)
      .patch(`/categories/${categoryOfA.id}`)
      .set(bearer(b.token))
      .send({ name: 'Invadida' })
      .expect(404);
    await request(server)
      .delete(`/categories/${categoryOfA.id}`)
      .set(bearer(b.token))
      .expect(404);
  });

  describe('RN05: remocao de categoria', () => {
    it('remove direto quando nao esta em uso', async () => {
      const { token } = await registerUser(server);
      const created = await request(server)
        .post('/categories')
        .set(bearer(token))
        .send({ name: 'Temporaria' })
        .expect(201);

      const res = await request(server)
        .delete(`/categories/${created.body.id}`)
        .set(bearer(token))
        .expect(200);
      expect(res.body).toEqual({ deleted: true, reassigned: 0 });
    });

    it('recusa (409) quando em uso e nao ha categoria de destino', async () => {
      const { token } = await registerUser(server);
      const [categoria] = await listCategories(server, token);
      await createTransaction(server, token, {
        type: 'EXPENSE',
        description: 'Mercado',
        amount: 50,
        date: '2026-10-01',
        categoryId: categoria.id,
      }).then((r) => expect(r.status).toBe(201));

      const res = await request(server)
        .delete(`/categories/${categoria.id}`)
        .set(bearer(token))
        .expect(409);
      expect(res.body.message).toContain('reassignTo');
      // a categoria continua existindo
      const ids = (await listCategories(server, token)).map((c) => c.id);
      expect(ids).toContain(categoria.id);
    });

    it('move as movimentacoes para o destino e remove a categoria', async () => {
      const { token } = await registerUser(server);
      const [origem, destino] = await listCategories(server, token);
      for (const amount of [10, 20]) {
        await createTransaction(server, token, {
          type: 'EXPENSE',
          description: `Gasto ${amount}`,
          amount,
          date: '2026-10-01',
          categoryId: origem.id,
        }).then((r) => expect(r.status).toBe(201));
      }

      const res = await request(server)
        .delete(`/categories/${origem.id}?reassignTo=${destino.id}`)
        .set(bearer(token))
        .expect(200);
      expect(res.body).toEqual({ deleted: true, reassigned: 2 });

      const txs = await request(server)
        .get('/transactions')
        .set(bearer(token))
        .expect(200);
      expect(txs.body).toHaveLength(2);
      expect(
        txs.body.every((t: { categoryId: number }) => t.categoryId === destino.id),
      ).toBe(true);
    });

    it('nao aceita destino igual a origem nem categoria de outro usuario', async () => {
      const a = await registerUser(server);
      const b = await registerUser(server);
      const [categoria] = await listCategories(server, a.token);
      const [alheia] = await listCategories(server, b.token);
      await createTransaction(server, a.token, {
        type: 'INCOME',
        description: 'Salario',
        amount: 100,
        date: '2026-10-01',
        categoryId: categoria.id,
      }).then((r) => expect(r.status).toBe(201));

      await request(server)
        .delete(`/categories/${categoria.id}?reassignTo=${categoria.id}`)
        .set(bearer(a.token))
        .expect(409);
      await request(server)
        .delete(`/categories/${categoria.id}?reassignTo=${alheia.id}`)
        .set(bearer(a.token))
        .expect(404);
    });
  });
});
