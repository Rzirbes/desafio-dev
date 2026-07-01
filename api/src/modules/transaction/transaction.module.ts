import { Module } from '@nestjs/common';
import { CreateTransactionController } from './infra/http/controllers/CreateTransactionController';
import { CreateTransactionUseCase } from './applications/use-cases/CreateTransactionUseCase';
import { TRANSACTION_REPOSITORY } from './domain/repositories/tokens';
import { PrismaTransactionRepository } from './infra/database/prisma/PrismaTransactionRepository';

@Module({
  controllers: [CreateTransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
