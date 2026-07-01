import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ListCategoriesUseCase } from '../../../applications/use-cases/ListCategoriesUseCase';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { AuthenticatedRequest } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  @Get()
  async handle(@Req() request: AuthenticatedRequest) {
    return this.listCategoriesUseCase.execute({
      userId: request.user.id,
    });
  }
}
