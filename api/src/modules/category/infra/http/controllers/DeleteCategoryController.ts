import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { DeleteCategoryUseCase } from '../../../applications/use-cases/DeleteCategoryUseCase';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class DeleteCategoryController {
  constructor(private readonly deleteCategoryUseCase: DeleteCategoryUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'category-id',
  })
  @ApiResponse({
    status: 204,
    description: 'Categoria excluída com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível excluir uma categoria com transações vinculadas.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a excluir esta categoria.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
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
