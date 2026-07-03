import { Inject, Injectable } from '@nestjs/common';

import { Category } from '../../domain/entities/Category';
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/tokens';
import { AppError } from '../../../../shared/infra/http/errors/AppError';

type CreateCategoryUseCaseRequest = {
  name: string;
  userId: string;
};

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    name,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<Category> {
    const categoryAlreadyExists =
      await this.categoryRepository.findByNameAndUserId(name, userId);

    if (categoryAlreadyExists) {
      throw new AppError('Category already exists.', 409);
    }

    const category = new Category({
      name,
      userId,
    });

    return this.categoryRepository.create(category);
  }
}
