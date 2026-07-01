import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/Category';
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/tokens';

type ListCategoriesUseCaseRequest = {
  userId: string;
};

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({ userId }: ListCategoriesUseCaseRequest): Promise<Category[]> {
    return this.categoryRepository.findManyByUserId(userId);
  }
}
