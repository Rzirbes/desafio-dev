import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';
import {
  ITransactionRepository,
  PaginatedTransactions,
} from '../../domain/repositories/ITransactionRepository';

type ListTransactionsRequest = {
  userId: string;
  page: number;
  limit: number;
};

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({
    userId,
    page,
    limit,
  }: ListTransactionsRequest): Promise<PaginatedTransactions> {
    return this.transactionRepository.findManyByUserId({
      userId,
      page,
      limit,
    });
  }
}
