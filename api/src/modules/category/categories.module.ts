import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './applications/use-cases/CreateCategoryUseCase';
import { PrismaCategoryRepository } from './infra/database/prisma/PrismaCategoryRepository';
import { CATEGORY_REPOSITORY } from './domain/repositories/tokens';
import { CreateCategoryController } from './infra/controllers/CreateCategoryController';
import { ListCategoriesUseCase } from './applications/use-cases/ListCategoriesUseCase';
import { ListCategoriesController } from './infra/controllers/ListCategoriesController';

@Module({
  controllers: [CreateCategoryController, ListCategoriesController],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
