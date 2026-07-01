import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/tokens';

type DeleteCategoryRequest = {
  id: string;
  userId: string;
};

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({ id, userId }: DeleteCategoryRequest): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    if (category.userId !== userId) {
      throw new AppError('You are not allowed to delete this category.', 403);
    }

    await this.categoryRepository.delete(id);
  }
}
