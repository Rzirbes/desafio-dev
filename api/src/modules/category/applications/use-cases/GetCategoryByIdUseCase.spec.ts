/* eslint-disable @typescript-eslint/unbound-method */
import { GetCategoryByIdUseCase } from './GetCategoryByIdUseCase';
import { Category } from '../../domain/entities/Category';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

describe('GetCategoryByIdUseCase', () => {
  let getCategoryByIdUseCase: GetCategoryByIdUseCase;
  let categoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByNameAndUserId: jest.fn(),
      findManyByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  });

  it('should be able to get a category by id', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);

    const result = await getCategoryByIdUseCase.execute({
      id: 'category-1',
      userId: 'user-1',
    });

    expect(result).toBe(category);
    expect(categoryRepository.findById).toHaveBeenCalledWith('category-1');
  });

  it('should not be able to get a non-existing category', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      getCategoryByIdUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).rejects.toEqual(new AppError('Category not found.', 404));

    expect(categoryRepository.findById).toHaveBeenCalledWith('category-1');
  });

  it('should not be able to get a category from another user', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-2',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);

    await expect(
      getCategoryByIdUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
      }),
    ).rejects.toEqual(
      new AppError('You are not allowed to access this category.', 403),
    );

    expect(categoryRepository.findById).toHaveBeenCalledWith('category-1');
  });
});
