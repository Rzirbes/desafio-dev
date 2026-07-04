import { CreateCategoryUseCase } from './CreateCategoryUseCase';
import { Category } from '../../domain/entities/Category';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

describe('CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let categoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByNameAndUserId: jest.fn(),
      findManyByUserId: jest.fn(),
    };

    createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should be able to create a category', async () => {
    categoryRepository.findByNameAndUserId.mockResolvedValue(null);

    categoryRepository.create.mockImplementation((category) =>
      Promise.resolve(category),
    );

    const result = await createCategoryUseCase.execute({
      name: 'Food',
      userId: 'user-id',
    });

    expect(result).toBeInstanceOf(Category);
    expect(result.name).toBe('Food');
    expect(result.userId).toBe('user-id');
  });

  it('should not be able to create a category with duplicated name', async () => {
    const category = new Category({
      name: 'Food',
      userId: 'user-id',
    });

    categoryRepository.findByNameAndUserId.mockResolvedValue(category);

    await expect(
      createCategoryUseCase.execute({
        name: 'Food',
        userId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const createSpy = categoryRepository.create;

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should call repository.create with a Category instance', async () => {
    categoryRepository.findByNameAndUserId.mockResolvedValue(null);

    categoryRepository.create.mockResolvedValue(
      new Category({
        name: 'Food',
        userId: 'user-id',
      }),
    );
    await createCategoryUseCase.execute({
      name: 'Food',
      userId: 'user-id',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const createSpy = categoryRepository.create;

    expect(createSpy).toHaveBeenCalledWith(expect.any(Category));
  });
});
