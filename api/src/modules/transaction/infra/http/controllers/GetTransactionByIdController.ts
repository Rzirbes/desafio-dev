import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { GetTransactionByIdUseCase } from '../../../applications/use-cases/GetTransactionByIdUseCase';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
  };
};

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class GetTransactionByIdController {
  constructor(
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
  ) {}

  @Get(':id')
  async handle(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.getTransactionByIdUseCase.execute({
      id,
      userId: request.user.id,
    });
  }
}
