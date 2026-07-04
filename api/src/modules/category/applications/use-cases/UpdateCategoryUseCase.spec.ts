/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateCategoryUseCase } from './UpdateCategoryUseCase';
import { Category } from '../../domain/entities/Category';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

describe('UpdateCategoryUseCase', () => {
  let updateCategoryUseCase: UpdateCategoryUseCase;
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

    updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  });

  it('should be able to update a category', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);
    categoryRepository.findByNameAndUserId.mockResolvedValue(null);
    categoryRepository.update.mockImplementation((category) =>
      Promise.resolve(category),
    );

    const result = await updateCategoryUseCase.execute({
      id: 'category-1',
      userId: 'user-1',
      name: 'Market',
    });

    expect(result.name).toBe('Market');
    expect(categoryRepository.update).toHaveBeenCalledWith(category);
  });

  it('should not be able to update a non-existing category', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      updateCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
        name: 'Market',
      }),
    ).rejects.toEqual(new AppError('Category not found.', 404));

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it('should not be able to update a category from another user', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-2',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);

    await expect(
      updateCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
        name: 'Market',
      }),
    ).rejects.toEqual(
      new AppError('You are not allowed to update this category.', 403),
    );

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it('should not be able to update a category to a name that already exists', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    const existingCategory = new Category(
      {
        name: 'Market',
        userId: 'user-1',
      },
      'category-2',
    );

    categoryRepository.findById.mockResolvedValue(category);
    categoryRepository.findByNameAndUserId.mockResolvedValue(existingCategory);

    await expect(
      updateCategoryUseCase.execute({
        id: 'category-1',
        userId: 'user-1',
        name: 'Market',
      }),
    ).rejects.toEqual(new AppError('Category already exists.', 409));

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it('should be able to keep the same category name', async () => {
    const category = new Category(
      {
        name: 'Food',
        userId: 'user-1',
      },
      'category-1',
    );

    categoryRepository.findById.mockResolvedValue(category);
    categoryRepository.findByNameAndUserId.mockResolvedValue(category);
    categoryRepository.update.mockImplementation(async (category) =>
      Promise.resolve(category),
    );

    const result = await updateCategoryUseCase.execute({
      id: 'category-1',
      userId: 'user-1',
      name: 'Food',
    });

    expect(result.name).toBe('Food');
    expect(categoryRepository.update).toHaveBeenCalledWith(category);
  });
});
