import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../domain/entities/Transaction';

type ListTransactionsRequest = {
  userId: string;
};

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({ userId }: ListTransactionsRequest): Promise<Transaction[]> {
    return this.transactionRepository.findManyByUserId(userId);
  }
}
