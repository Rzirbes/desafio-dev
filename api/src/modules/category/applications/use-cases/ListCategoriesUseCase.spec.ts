/* eslint-disable @typescript-eslint/unbound-method */
import { ListCategoriesUseCase } from './ListCategoriesUseCase';
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

describe('ListCategoriesUseCase', () => {
  let listCategoriesUseCase: ListCategoriesUseCase;
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

    listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
  });

  it('should be able to list all categories from a user', async () => {
    const categories = [
      new Category(
        {
          name: 'Food',
          userId: 'user-1',
        },
        'category-1',
      ),
      new Category(
        {
          name: 'Transport',
          userId: 'user-1',
        },
        'category-2',
      ),
    ];

    categoryRepository.findManyByUserId.mockResolvedValue(categories);

    const result = await listCategoriesUseCase.execute({
      userId: 'user-1',
    });

    expect(result).toEqual(categories);
    expect(categoryRepository.findManyByUserId).toHaveBeenCalledWith('user-1');
    expect(categoryRepository.findManyByUserId).toHaveBeenCalledTimes(1);
  });
});
