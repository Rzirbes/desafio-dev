/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteCategoryUseCase } from './DeleteCategoryUseCase';
import { Category } from '../../domain/entities/Category';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { ITransactionRepository } from '../../../transaction/domain/repositories/ITransactionRepository';

describe('DeleteCategoryUseCase', () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let categoryRepository: jest.Mocked<ICategoryRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByNameAndUserId: jest.fn(),
      findManyByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findManyByUserId: jest.fn(),
      existsByCategoryId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    deleteCategoryUseCase = new DeleteCategoryUseCase(
      categoryRepository,
      transactionRepository,
    );
  });

  it('should be able to delete a category', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);
    transactionRepository.existsByCategoryId.mockResolvedValue(false);
    categoryRepository.delete.mockResolvedValue();

    await expect(
      deleteCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).resolves.toBeUndefined();

    expect(categoryRepository.findById).toHaveBeenCalledWith('category-1');
    expect(transactionRepository.existsByCategoryId).toHaveBeenCalledWith(
      'category-1',
    );
    expect(categoryRepository.delete).toHaveBeenCalledWith('category-1');
  });

  it('should not be able to delete a non-existing category', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      deleteCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).rejects.toEqual(new AppError('Category not found.', 404));

    expect(transactionRepository.existsByCategoryId).not.toHaveBeenCalled();
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should not be able to delete a category from another user', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-2',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);

    await expect(
      deleteCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).rejects.toEqual(
      new AppError('You are not allowed to delete this category.', 403),
    );

    expect(transactionRepository.existsByCategoryId).not.toHaveBeenCalled();
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should not be able to delete a category with linked transactions', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);
    transactionRepository.existsByCategoryId.mockResolvedValue(true);

    await expect(
      deleteCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).rejects.toEqual(
      new AppError(
        'Category cannot be deleted because it has linked transactions.',
        400,
      ),
    );

    expect(transactionRepository.existsByCategoryId).toHaveBeenCalledWith(
      'category-1',
    );
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });
});
