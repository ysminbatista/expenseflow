import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/validation.js';

// Configuracao compartilhada entre a aplicacao real (main.ts) e os testes e2e
export function configureApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableCors(); // frontend em outra origem
}
