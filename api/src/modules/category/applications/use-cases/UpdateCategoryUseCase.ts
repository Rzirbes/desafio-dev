import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/tokens';

type UpdateCategoryRequest = {
  id: string;
  userId: string;
  name: string;
};

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    id,
    userId,
    name,
  }: UpdateCategoryRequest): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    if (category.userId !== userId) {
      throw new AppError('You are not allowed to update this category.', 403);
    }

    const categoryWithSameName =
      await this.categoryRepository.findByNameAndUserId(name, userId);

    if (categoryWithSameName && categoryWithSameName.id !== id) {
      throw new AppError('Category already exists.', 409);
    }

    category.name = name;

    return this.categoryRepository.update(category);
  }
}
