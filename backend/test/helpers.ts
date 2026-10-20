import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { PrismaService } from '../src/prisma.service.js';

export type Server = ReturnType<INestApplication['getHttpServer']>;

export async function createApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return { app, server: app.getHttpServer() as Server, prisma: app.get(PrismaService) };
}

export const PASSWORD = 'senha-1234';

let counter = 0;

// Cria um usuario com e-mail unico e devolve o token e o e-mail
export async function registerUser(server: Server, label = 'user') {
  const email = `${label}-${Date.now()}-${counter++}@teste.com`;
  const res = await request(server)
    .post('/auth/register')
    .send({ name: 'Usuario Teste', email, password: PASSWORD })
    .expect(201);
  return {
    email,
    token: res.body.accessToken as string,
    id: res.body.user.id as number,
  };
}

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function listCategories(server: Server, token: string) {
  const res = await request(server)
    .get('/categories')
    .set(bearer(token))
    .expect(200);
  return res.body as { id: number; name: string }[];
}

export async function createTransaction(
  server: Server,
  token: string,
  body: Record<string, unknown>,
) {
  return request(server).post('/transactions').set(bearer(token)).send(body);
}
