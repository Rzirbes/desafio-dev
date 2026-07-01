import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { UpdateCategoryUseCase } from '../../../applications/use-cases/UpdateCategoryUseCase';

type UpdateCategoryBody = {
  name: string;
};

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@Controller('/categories')
export class UpdateCategoryController {
  constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateCategoryBody,
    @Req() request: AuthenticatedRequest,
  ) {
    const category = await this.updateCategoryUseCase.execute({
      id,
      name: body.name,
      userId: request.user.id,
    });

    return {
      category,
    };
  }
}
