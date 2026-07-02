import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { DeleteTransactionUseCase } from '../../../applications/use-cases/DeleteTransactionUseCase';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
  };
};

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class DeleteTransactionController {
  constructor(
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
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
