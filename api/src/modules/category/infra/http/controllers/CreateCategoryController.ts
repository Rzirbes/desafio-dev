import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { CreateCategoryDTO } from '../../../applications/dtos/CreateCategoryDTO';
import { CreateCategoryUseCase } from '../../../applications/use-cases/CreateCategoryUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

@Controller('categories')
export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: CreateCategoryDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.createCategoryUseCase.execute({
      name: body.name,
      userId: request.user.id,
    });
  }
}
