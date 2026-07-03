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
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { DeleteTransactionUseCase } from '../../../applications/use-cases/DeleteTransactionUseCase';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class DeleteTransactionController {
  constructor(
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiNoContentResponse({
    description: 'Transaction deleted successfully.',
  })
  async handle(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.deleteTransactionUseCase.execute({
      id,
      userId: request.user.id,
    });
  }
}
