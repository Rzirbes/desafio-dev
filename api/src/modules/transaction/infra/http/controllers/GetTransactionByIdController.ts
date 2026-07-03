import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { GetTransactionByIdUseCase } from '../../../applications/use-cases/GetTransactionByIdUseCase';
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
export class GetTransactionByIdController {
  constructor(
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'Transaction found successfully.' })
  async handle(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.getTransactionByIdUseCase.execute({
      id,
      userId: request.user.id,
    });
  }
}
