import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { GetCategoryByIdUseCase } from '../../../applications/use-cases/GetCategoryByIdUseCase';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class GetCategoryByIdController {
  constructor(
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'category-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a acessar esta categoria.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
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
