import {
  Body,
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { UpdateCategoryUseCase } from '../../../applications/use-cases/UpdateCategoryUseCase';
import { UpdateCategoryDTO } from '../../../applications/dtos/UpdateCategoryDTO';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class UpdateCategoryController {
  constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {}

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'category-id',
  })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a atualizar esta categoria.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Categoria já existe.',
  })
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDTO,
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
