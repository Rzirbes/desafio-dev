import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCategoryUseCase } from '../../../applications/use-cases/CreateCategoryUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

type CreateCategoryBody = {
  name: string;
};

@Controller('categories')
export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: CreateCategoryBody,
    @Req() request: AuthenticatedRequest,
  ) {
    const category = await this.createCategoryUseCase.execute({
      name: body.name,
      userId: request.user.id,
    });

    return category;
  }
}
