/* eslint-disable @typescript-eslint/unbound-method */
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import {
  ITransactionRepository,
  PaginatedTransactions,
} from '../../domain/repositories/ITransactionRepository';
import { ListTransactionsUseCase } from './ListTransactionsUseCase';

describe('ListTransactionsUseCase', () => {
  let listTransactionsUseCase: ListTransactionsUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findManyByUserId: jest.fn(),
      existsByCategoryId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    listTransactionsUseCase = new ListTransactionsUseCase(
      transactionRepository,
    );
  });

  it('should be able to list transactions', async () => {
    const transaction = new Transaction({
      description: 'Salary',
      amount: 5000,
      type: TransactionType.INCOME,
      userId: 'user-id',
      categoryId: 'category-id',
      date: new Date(),
    });

    const response: PaginatedTransactions = {
      transactions: [transaction],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      summary: {
        incomeTotal: 5000,
        expenseTotal: 0,
        balance: 5000,
      },
    };

    transactionRepository.findManyByUserId.mockResolvedValue(response);

    const result = await listTransactionsUseCase.execute({
      userId: 'user-id',
      page: 1,
      limit: 10,
      month: 7,
      year: 2026,
      categoryId: 'category-id',
    });

    expect(result).toEqual(response);

    expect(transactionRepository.findManyByUserId).toHaveBeenCalledWith({
      userId: 'user-id',
      page: 1,
      limit: 10,
      month: 7,
      year: 2026,
      categoryId: 'category-id',
    });

    expect(transactionRepository.findManyByUserId).toHaveBeenCalledTimes(1);
  });

  it('should be able to list transactions without filters', async () => {
    const response: PaginatedTransactions = {
      transactions: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      summary: {
        incomeTotal: 0,
        expenseTotal: 0,
        balance: 0,
      },
    };

    transactionRepository.findManyByUserId.mockResolvedValue(response);

    const result = await listTransactionsUseCase.execute({
      userId: 'user-id',
      page: 1,
      limit: 10,
    });

    expect(result).toEqual(response);

    expect(transactionRepository.findManyByUserId).toHaveBeenCalledWith({
      userId: 'user-id',
      page: 1,
      limit: 10,
      month: undefined,
      year: undefined,
      categoryId: undefined,
    });
  });
});
