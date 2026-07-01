import { Inject, Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';

type CreateTransactionRequest = {
  description: string;
  amount: number;
  type: TransactionType;
  userId: string;
  categoryId: string;
  date?: Date;
};

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({
    description,
    amount,
    type,
    userId,
    categoryId,
    date,
  }: CreateTransactionRequest): Promise<Transaction> {
    const transaction = new Transaction({
      description,
      amount,
      type,
      userId,
      categoryId,
      date: date ?? new Date(),
    });

    return this.transactionRepository.create(transaction);
  }
}
