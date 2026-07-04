/* eslint-disable @typescript-eslint/unbound-method */
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { UpdateTransactionUseCase } from './UpdateTransactionUseCase';

describe('UpdateTransactionUseCase', () => {
  let updateTransactionUseCase: UpdateTransactionUseCase;
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

    updateTransactionUseCase = new UpdateTransactionUseCase(
      transactionRepository,
    );
  });

  it('should be able to update a transaction', async () => {
    const transaction = new Transaction(
      {
        description: 'Old description',
        amount: 100,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'old-category-id',
        date: new Date('2026-07-01'),
      },
      'transaction-id',
    );

    const newDate = new Date('2026-07-04');

    transactionRepository.findById.mockResolvedValue(transaction);
    transactionRepository.update.mockImplementation((updatedTransaction) =>
      Promise.resolve(updatedTransaction),
    );

    const result = await updateTransactionUseCase.execute({
      id: 'transaction-id',
      userId: 'user-id',
      description: 'New description',
      amount: 500,
      type: TransactionType.INCOME,
      categoryId: 'new-category-id',
      date: newDate,
    });

    expect(result.description).toBe('New description');
    expect(result.amount).toBe(500);
    expect(result.type).toBe(TransactionType.INCOME);
    expect(result.categoryId).toBe('new-category-id');
    expect(result.date).toEqual(newDate);

    expect(transactionRepository.findById).toHaveBeenCalledWith(
      'transaction-id',
    );
    expect(transactionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'New description',
        amount: 500,
        type: TransactionType.INCOME,
        userId: 'user-id',
        categoryId: 'new-category-id',
        date: newDate,
      }),
    );
    expect(transactionRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should keep current date when date is not provided', async () => {
    const currentDate = new Date('2026-07-01');

    const transaction = new Transaction(
      {
        description: 'Old description',
        amount: 100,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'old-category-id',
        date: currentDate,
      },
      'transaction-id',
    );

    transactionRepository.findById.mockResolvedValue(transaction);
    transactionRepository.update.mockImplementation((updatedTransaction) =>
      Promise.resolve(updatedTransaction),
    );

    const result = await updateTransactionUseCase.execute({
      id: 'transaction-id',
      userId: 'user-id',
      description: 'New description',
      amount: 500,
      type: TransactionType.INCOME,
      categoryId: 'new-category-id',
    });

    expect(result.date).toEqual(currentDate);

    expect(transactionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        date: currentDate,
      }),
    );
  });

  it('should not be able to update a non-existing transaction', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    await expect(
      updateTransactionUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
        description: 'New description',
        amount: 500,
        type: TransactionType.INCOME,
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Transaction not found', 404));

    expect(transactionRepository.update).not.toHaveBeenCalled();
  });

  it('should not be able to update a transaction from another user', async () => {
    const transaction = new Transaction(
      {
        description: 'Old description',
        amount: 100,
        type: TransactionType.EXPENSE,
        userId: 'another-user-id',
        categoryId: 'old-category-id',
        date: new Date(),
      },
      'transaction-id',
    );

    transactionRepository.findById.mockResolvedValue(transaction);

    await expect(
      updateTransactionUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
        description: 'New description',
        amount: 500,
        type: TransactionType.INCOME,
        categoryId: 'new-category-id',
      }),
    ).rejects.toEqual(
      new AppError('You are not allowed to update this transaction', 403),
    );

    expect(transactionRepository.update).not.toHaveBeenCalled();
  });
});
