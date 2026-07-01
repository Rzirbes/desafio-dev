import { Module } from '@nestjs/common';
import { CreateTransactionController } from './infra/http/controllers/CreateTransactionController';
import { CreateTransactionUseCase } from './applications/use-cases/CreateTransactionUseCase';
import { TRANSACTION_REPOSITORY } from './domain/repositories/tokens';
import { PrismaTransactionRepository } from './infra/database/prisma/PrismaTransactionRepository';
import { ListTransactionsController } from './infra/http/controllers/ListCategoriesController';
import { ListTransactionsUseCase } from './applications/use-cases/ListTransactionsUseCase';

@Module({
  controllers: [CreateTransactionController, ListTransactionsController],
  providers: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
