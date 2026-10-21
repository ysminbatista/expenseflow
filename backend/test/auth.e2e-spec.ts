import { type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaService } from '../src/prisma.service.js';
import {
  PASSWORD,
  bearer,
  createApp,
  listCategories,
  registerUser,
  type Server,
} from './helpers.js';

describe('Autenticacao', () => {
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

  it('RN06: o cadastro cria as 5 categorias iniciais', async () => {
    const { token } = await registerUser(server);
    const names = (await listCategories(server, token)).map((c) => c.name);
    expect(names.sort()).toEqual(
      ['Alimentação', 'Casa', 'Outros', 'Trabalho', 'Transporte'].sort(),
    );
  });

  it('RNF01: a senha nao e devolvida nem guardada em texto puro', async () => {
    const { email, id } = await registerUser(server);
    const res = await request(server)
      .post('/auth/login')
      .send({ email, password: PASSWORD })
      .expect(201);
    expect(JSON.stringify(res.body)).not.toContain(PASSWORD);
    expect(res.body.user).toEqual({ id, name: 'Usuario Teste', email });

    const stored = await prisma.user.findUnique({ where: { id } });
    expect(stored?.passwordHash).not.toBe(PASSWORD);
    expect(stored?.passwordHash).toMatch(/^\$2[aby]\$/);
  });

  it('RN04: nao permite e-mail repetido (mesmo com maiusculas)', async () => {
    const { email } = await registerUser(server);
    const res = await request(server)
      .post('/auth/register')
      .send({ name: 'Outro', email: email.toUpperCase(), password: PASSWORD })
      .expect(409);
    expect(res.body.message).toBe('E-mail já cadastrado');
  });

  it('login com senha errada ou e-mail inexistente responde 401', async () => {
    const { email } = await registerUser(server);
    await request(server)
      .post('/auth/login')
      .send({ email, password: 'senha-errada-1' })
      .expect(401);
    await request(server)
      .post('/auth/login')
      .send({ email: 'ninguem@teste.com', password: PASSWORD })
      .expect(401);
  });

  it('valida os dados do cadastro, com mensagens em portugues', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({ name: 'A', email: 'invalido', password: '123' })
      .expect(400);
    expect(res.body.message).toEqual([
      'O campo nome deve ter no mínimo 2 caracteres',
      'Informe um e-mail válido',
      'O campo senha deve ter no mínimo 8 caracteres',
    ]);
  });

  it('RN11: rotas protegidas exigem token valido', async () => {
    for (const path of ['/auth/me', '/categories', '/transactions']) {
      await request(server).get(path).expect(401);
      await request(server)
        .get(path)
        .set(bearer('token.invalido.aqui'))
        .expect(401);
    }
  });

  it('/auth/me devolve o usuario do token', async () => {
    const { token, email } = await registerUser(server);
    const res = await request(server)
      .get('/auth/me')
      .set(bearer(token))
      .expect(200);
    expect(res.body.email).toBe(email);
  });
});
