import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTransactionUseCase } from '../../../applications/use-cases/CreateTransactionUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { CreateTransactionBodyDTO } from '../../../applications/dtos/CreateTransactionBodyDTO';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class CreateTransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create transaction' })
  @ApiCreatedResponse({ description: 'Transaction created successfully.' })
  async handle(
    @Body() body: CreateTransactionBodyDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const { description, amount, type, categoryId, date } = body;

    const userId = req.user.id;

    const transaction = await this.createTransactionUseCase.execute({
      description,
      amount,
      type,
      categoryId,
      userId,
      date: date ? new Date(date) : undefined,
    });

    return {
      transaction: {
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        userId: transaction.userId,
        categoryId: transaction.categoryId,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    };
  }
}
