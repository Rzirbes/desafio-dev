import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ListCategoriesUseCase } from '../../../applications/use-cases/ListCategoriesUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Categorias listadas com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente.',
  })
  async handle(@Req() request: AuthenticatedRequest) {
    return this.listCategoriesUseCase.execute({
      userId: request.user.id,
    });
  }
}
