import { type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp, PASSWORD, type Server } from './helpers.js';

describe('Seguranca', () => {
  let app: INestApplication;
  let server: Server;
  const original = process.env.AUTH_THROTTLE_LIMIT;

  beforeAll(async () => {
    // Liga o limite de verdade: 3 tentativas por minuto nas rotas de auth
    process.env.AUTH_THROTTLE_LIMIT = '3';
    ({ app, server } = await createApp());
  });

  afterAll(async () => {
    process.env.AUTH_THROTTLE_LIMIT = original;
    await app.close();
  });

  describe('limite de tentativas de login', () => {
    it('bloqueia (429) depois do limite, com mensagem em portugues', async () => {
      const attempt = () =>
        request(server)
          .post('/auth/login')
          .send({ email: 'ninguem@teste.com', password: PASSWORD });

      for (let i = 0; i < 3; i++) {
        await attempt().expect(401);
      }
      const blocked = await attempt().expect(429);
      expect(blocked.body.message).toBe(
        'Muitas tentativas. Aguarde um minuto e tente novamente.',
      );
    });

    it('o cadastro tem limite proprio e tambem e bloqueado', async () => {
      const attempt = () =>
        request(server)
          .post('/auth/register')
          .send({ name: 'A', email: 'invalido', password: '123' }); // 400

      for (let i = 0; i < 3; i++) {
        await attempt().expect(400);
      }
      await attempt().expect(429);
    });

    it('nao afeta as demais rotas', async () => {
      // /auth/me nao tem o limite restrito: segue respondendo 401 (sem token)
      for (let i = 0; i < 6; i++) {
        await request(server).get('/auth/me').expect(401);
      }
    });
  });

  describe('CORS', () => {
    it('aceita o frontend autorizado', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Origin', 'http://localhost:3000');
      expect(res.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000',
      );
    });

    it('nao autoriza outros sites', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Origin', 'http://site-malicioso.com');
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('responde o preflight do navegador apenas para o frontend autorizado', async () => {
      const ok = await request(server)
        .options('/transactions')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');
      expect(ok.status).toBe(204);
      expect(ok.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000',
      );

      const denied = await request(server)
        .options('/transactions')
        .set('Origin', 'http://site-malicioso.com')
        .set('Access-Control-Request-Method', 'POST');
      expect(denied.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
