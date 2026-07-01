import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../auth/infra/http/middlewares/JwtAuthGuard';
import { DeleteCategoryUseCase } from '../../applications/use-cases/DeleteCategoryUseCase';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@Controller('/categories')
export class DeleteCategoryController {
  constructor(private readonly deleteCategoryUseCase: DeleteCategoryUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute({
      id,
      userId: request.user.id,
    });
  }
}
