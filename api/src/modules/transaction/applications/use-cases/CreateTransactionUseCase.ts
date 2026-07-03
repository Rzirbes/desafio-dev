import { Inject, Injectable } from '@nestjs/common';

import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';
import { CreateTransactionDTO } from '../dtos/CreateTransactionDTO';

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
  }: CreateTransactionDTO): Promise<Transaction> {
    if (!description?.trim()) {
      throw new AppError('Description is required.', 400);
    }

    if (amount == null || amount <= 0) {
      throw new AppError('Amount must be greater than zero.', 400);
    }

    if (!type) {
      throw new AppError('Transaction type is required.', 400);
    }

    if (!userId) {
      throw new AppError('User is required.', 400);
    }

    if (!categoryId) {
      throw new AppError('Category is required.', 400);
    }

    const transaction = new Transaction({
      description: description.trim(),
      amount,
      type,
      userId,
      categoryId,
      date: date ?? new Date(),
    });

    return this.transactionRepository.create(transaction);
  }
}
