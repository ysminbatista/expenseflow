import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { PrismaModule } from './prisma.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Limite geral por IP: protege a API inteira contra excesso de requisicoes.
    // As rotas de login e cadastro tem um limite bem menor (veja AuthController).
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: 60_000, limit: () => Number(process.env.THROTTLE_LIMIT ?? 120) },
      ],
      errorMessage: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
