import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { TransactionType } from '../../../domain/enums/TransactionType';
import { CreateTransactionUseCase } from '../../../applications/use-cases/CreateTransactionUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

const createTransactionBodySchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().uuid(),
  date: z.coerce.date().optional(),
});

type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>;

@Controller('transactions')
export class CreateTransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: CreateTransactionBody,
    @Req() req: AuthenticatedRequest,
  ) {
    const { description, amount, type, categoryId, date } =
      createTransactionBodySchema.parse(body);

    const userId = req.user.id;

    const transaction = await this.createTransactionUseCase.execute({
      description,
      amount,
      type,
      categoryId,
      userId,
      date,
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
