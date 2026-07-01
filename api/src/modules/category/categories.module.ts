import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './applications/use-cases/CreateCategoryUseCase';
import { PrismaCategoryRepository } from './infra/database/prisma/PrismaCategoryRepository';
import { CATEGORY_REPOSITORY } from './domain/repositories/tokens';
import { CreateCategoryController } from './infra/http/controllers/CreateCategoryController';
import { ListCategoriesUseCase } from './applications/use-cases/ListCategoriesUseCase';
import { ListCategoriesController } from './infra/http/controllers/ListCategoriesController';
import { UpdateCategoryController } from './infra/http/controllers/UpdateCategoryController';
import { UpdateCategoryUseCase } from './applications/use-cases/UpdateCategoryUseCase';
import { GetCategoryByIdController } from './infra/http/controllers/GetCategoryByIdController';
import { GetCategoryByIdUseCase } from './applications/use-cases/GetCategoryByIdUseCase';
import { DeleteCategoryUseCase } from './applications/use-cases/DeleteCategoryUseCase';
import { DeleteCategoryController } from './infra/http/controllers/DeleteCategoryController';

@Module({
  controllers: [
    CreateCategoryController,
    ListCategoriesController,
    UpdateCategoryController,
    GetCategoryByIdController,
    DeleteCategoryController,
  ],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
    GetCategoryByIdUseCase,
    DeleteCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
