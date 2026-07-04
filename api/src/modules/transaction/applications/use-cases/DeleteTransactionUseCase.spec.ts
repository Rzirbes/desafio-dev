/* eslint-disable @typescript-eslint/unbound-method */
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { DeleteTransactionUseCase } from './DeleteTransactionUseCase';

describe('DeleteTransactionUseCase', () => {
  let deleteTransactionUseCase: DeleteTransactionUseCase;
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

    deleteTransactionUseCase = new DeleteTransactionUseCase(
      transactionRepository,
    );
  });

  it('should be able to delete a transaction', async () => {
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
    transactionRepository.delete.mockResolvedValue();

    await deleteTransactionUseCase.execute({
      id: 'transaction-id',
      userId: 'user-id',
    });

    expect(transactionRepository.findById).toHaveBeenCalledWith(
      'transaction-id',
    );
    expect(transactionRepository.delete).toHaveBeenCalledWith('transaction-id');
    expect(transactionRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should not be able to delete a non-existing transaction', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    await expect(
      deleteTransactionUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
      }),
    ).rejects.toEqual(new AppError('Transaction not found', 404));

    expect(transactionRepository.delete).not.toHaveBeenCalled();
  });

  it('should not be able to delete a transaction from another user', async () => {
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
      deleteTransactionUseCase.execute({
        id: 'transaction-id',
        userId: 'user-id',
      }),
    ).rejects.toEqual(new AppError('Transaction not found', 404));

    expect(transactionRepository.delete).not.toHaveBeenCalled();
  });
});
