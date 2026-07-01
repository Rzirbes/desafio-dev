import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/tokens';

type GetCategoryByIdRequest = {
  id: string;
  userId: string;
};

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({ id, userId }: GetCategoryByIdRequest): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    if (category.userId !== userId) {
      throw new AppError('You are not allowed to access this category.', 403);
    }

    return category;
  }
}
