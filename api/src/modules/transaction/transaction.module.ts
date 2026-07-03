import { Module } from '@nestjs/common';
import { CreateTransactionController } from './infra/http/controllers/CreateTransactionController';
import { CreateTransactionUseCase } from './applications/use-cases/CreateTransactionUseCase';
import { TRANSACTION_REPOSITORY } from './domain/repositories/tokens';
import { PrismaTransactionRepository } from './infra/database/prisma/PrismaTransactionRepository';
import { ListTransactionsController } from './infra/http/controllers/ListTransactionsController';
import { ListTransactionsUseCase } from './applications/use-cases/ListTransactionsUseCase';
import { UpdateTransactionController } from './infra/http/controllers/UpdateTransactionController';
import { UpdateTransactionUseCase } from './applications/use-cases/UpdateTransactionUseCase';
import { GetTransactionByIdController } from './infra/http/controllers/GetTransactionByIdController';
import { DeleteTransactionUseCase } from './applications/use-cases/DeleteTransactionUseCase';
import { GetTransactionByIdUseCase } from './applications/use-cases/GetTransactionByIdUseCase';
import { DeleteTransactionController } from './infra/http/controllers/DeleteTransactionController';

@Module({
  controllers: [
    CreateTransactionController,
    ListTransactionsController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetTransactionByIdController,
  ],
  providers: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    UpdateTransactionUseCase,

    DeleteTransactionUseCase,
    GetTransactionByIdUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
