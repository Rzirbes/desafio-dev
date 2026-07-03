import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { UpdateTransactionUseCase } from '../../../applications/use-cases/UpdateTransactionUseCase';
import { UpdateTransactionBodyDTO } from '../../../applications/dtos/UpdateTransactionBodyDTO';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class UpdateTransactionController {
  constructor(
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiOkResponse({ description: 'Transaction updated successfully.' })
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateTransactionBodyDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const { description, amount, type, categoryId, date } = body;

    const transaction = await this.updateTransactionUseCase.execute({
      id,
      userId: req.user.id,
      description,
      amount,
      type,
      categoryId,
      date: date ? new Date(date) : undefined,
    });

    return { transaction };
  }
}
