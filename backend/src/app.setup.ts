import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/validation.js';

const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

// Enderecos do frontend autorizados a chamar a API (CORS_ORIGIN, separados por virgula)
export function allowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Configuracao compartilhada entre a aplicacao real (main.ts) e os testes e2e
export function configureApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  // So o frontend autorizado pode chamar a API a partir do navegador
  app.enableCors({ origin: allowedOrigins() });
}
