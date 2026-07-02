import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { UpdateTransactionUseCase } from '../../../applications/use-cases/UpdateTransactionUseCase';
import { TransactionType } from '../../../domain/enums/TransactionType';

const updateTransactionBodySchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().uuid(),
  date: z.coerce.date().optional(),
});

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class UpdateTransactionController {
  constructor(
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const { description, amount, type, categoryId, date } =
      updateTransactionBodySchema.parse(body);

    const transaction = await this.updateTransactionUseCase.execute({
      id,
      userId: req.user.id,
      description,
      amount,
      type,
      categoryId,
      date,
    });

    return { transaction };
  }
}
