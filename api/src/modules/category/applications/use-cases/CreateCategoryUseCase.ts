import { Category } from '../../domain/entities/Category.js';
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';

type CreateCategoryUseCaseRequest = {
  name: string;
  userId: string;
};

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute({
    name,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<Category> {
    const categoryAlreadyExists =
      await this.categoryRepository.findByNameAndUserId(name, userId);

    if (categoryAlreadyExists) {
      throw new Error('Category already exists.');
    }

    const category = new Category({
      name,
      userId,
    });

    return this.categoryRepository.create(category);
  }
}
