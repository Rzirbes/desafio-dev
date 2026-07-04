/* eslint-disable @typescript-eslint/unbound-method */
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { GetTransactionByIdUseCase } from './GetTransactionByIdUseCase';

describe('GetTransactionByIdUseCase', () => {
  let getTransactionByIdUseCase: GetTransactionByIdUseCase;
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

    getTransactionByIdUseCase = new GetTransactionByIdUseCase(
      transactionRepository,
    );
  });

  it('should be able to get a transaction by id', async () => {
    const transaction = new Transaction(
      {
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
        date: new Date(),
      },
      'transaction-id',
    );

    transactionRepository.findById.mockResolvedValue(transaction);

    const result = await getTransactionByIdUseCase.execute({
      id: 'transaction-id',
      userId: 'user-id',
    });

    expect(result).toEqual(transaction);
    expect(transactionRepository.findById).toHaveBeenCalledWith(
      'transaction-id',
    );
    expect(transactionRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should not be able to get a non-existing transaction', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    await expect(
      getTransactionByIdUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
      }),
    ).rejects.toEqual(new AppError('Transaction not found', 404));
  });

  it('should not be able to get a transaction from another user', async () => {
    const transaction = new Transaction(
      {
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'another-user-id',
        categoryId: 'category-id',
        date: new Date(),
      },
      'transaction-id',
    );

    transactionRepository.findById.mockResolvedValue(transaction);

    await expect(
      getTransactionByIdUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
      }),
    ).rejects.toEqual(new AppError('Transaction not found', 404));
  });
});
