import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { GetCategoryByIdUseCase } from '../../../applications/use-cases/GetCategoryByIdUseCase';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@Controller('/categories')
export class GetCategoryByIdController {
  constructor(
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const category = await this.getCategoryByIdUseCase.execute({
      id,
      userId: request.user.id,
    });

    return {
      category,
    };
  }
}
