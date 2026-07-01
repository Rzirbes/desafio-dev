import { Body, Controller, Post } from '@nestjs/common';
import { PrismaCategoryRepository } from '../database/prisma/PrismaCategoryRepository';
import { CreateCategoryUseCase } from '../../applications/use-cases/CreateCategoryUseCase';

type CreateCategoryBody = {
  name: string;
  userId: string;
};

@Controller('categories')
export class CreateCategoryController {
  async handle(@Body() body: CreateCategoryBody) {
    const { name, userId } = body;

    const categoryRepository = new PrismaCategoryRepository();
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

    const category = await createCategoryUseCase.execute({
      name,
      userId,
    });

    return category;
  }

  @Post()
  async create(@Body() body: CreateCategoryBody) {
    return this.handle(body);
  }
}
