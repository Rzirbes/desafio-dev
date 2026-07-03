import {
  Controller,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { ListTransactionsUseCase } from '../../../applications/use-cases/ListTransactionsUseCase';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@Controller('transactions')
export class ListTransactionsController {
  constructor(
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Req() request: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.listTransactionsUseCase.execute({
      userId: request.user.id,
      page,
      limit,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    });
  }
}
