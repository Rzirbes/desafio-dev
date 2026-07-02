import { Inject, Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';
import { AppError } from '../../../../shared/infra/http/errors/AppError';

type UpdateTransactionRequest = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date?: Date;
};

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({
    id,
    userId,
    description,
    amount,
    type,
    categoryId,
    date,
  }: UpdateTransactionRequest): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError('You are not allowed to update this transaction', 403);
    }

    transaction.description = description;
    transaction.amount = amount;
    transaction.type = type;
    transaction.categoryId = categoryId;

    if (date) {
      transaction.date = date;
    }

    return this.transactionRepository.update(transaction);
  }
}
