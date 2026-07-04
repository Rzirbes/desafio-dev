/* eslint-disable @typescript-eslint/unbound-method */
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { CreateTransactionUseCase } from './CreateTransactionUseCase';

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
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

    createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
    );
  });

  it('should be able to create a transaction', async () => {
    const transactionDate = new Date('2026-07-04');

    transactionRepository.create.mockResolvedValue(
      new Transaction({
        description: 'Salary',
        amount: 5000,
        type: TransactionType.INCOME,
        userId: 'user-id',
        categoryId: 'category-id',
        date: transactionDate,
      }),
    );

    const result = await createTransactionUseCase.execute({
      description: 'Salary',
      amount: 5000,
      type: TransactionType.INCOME,
      userId: 'user-id',
      categoryId: 'category-id',
      date: transactionDate,
    });

    expect(result).toBeInstanceOf(Transaction);
    expect(result.description).toBe('Salary');
    expect(result.amount).toBe(5000);
    expect(result.type).toBe(TransactionType.INCOME);
    expect(result.userId).toBe('user-id');
    expect(result.categoryId).toBe('category-id');
    expect(result.date).toEqual(transactionDate);

    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Salary',
        amount: 5000,
        type: TransactionType.INCOME,
        userId: 'user-id',
        categoryId: 'category-id',
        date: transactionDate,
      }),
    );
  });

  it('should trim transaction description before creating', async () => {
    transactionRepository.create.mockResolvedValue(
      new Transaction({
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
        date: new Date(),
      }),
    );

    const result = await createTransactionUseCase.execute({
      description: '  Market  ',
      amount: 150,
      type: TransactionType.EXPENSE,
      userId: 'user-id',
      categoryId: 'category-id',
    });

    expect(result.description).toBe('Market');

    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Market',
      }),
    );
  });

  it('should use current date when date is not provided', async () => {
    transactionRepository.create.mockResolvedValue(
      new Transaction({
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
        date: new Date(),
      }),
    );

    const result = await createTransactionUseCase.execute({
      description: 'Market',
      amount: 150,
      type: TransactionType.EXPENSE,
      userId: 'user-id',
      categoryId: 'category-id',
    });

    expect(result.date).toBeInstanceOf(Date);
    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should not be able to create a transaction without description', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: '',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Description is required.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction with blank description', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: '   ',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Description is required.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction with amount equal to zero', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: 'Market',
        amount: 0,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Amount must be greater than zero.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction with amount less than zero', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: 'Market',
        amount: -10,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Amount must be greater than zero.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction without type', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: 'Market',
        amount: 150,
        type: undefined as never,
        userId: 'user-id',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Transaction type is required.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction without user', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: '',
        categoryId: 'category-id',
      }),
    ).rejects.toEqual(new AppError('User is required.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('should not be able to create a transaction without category', async () => {
    await expect(
      createTransactionUseCase.execute({
        description: 'Market',
        amount: 150,
        type: TransactionType.EXPENSE,
        userId: 'user-id',
        categoryId: '',
      }),
    ).rejects.toEqual(new AppError('Category is required.', 400));

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });
});
