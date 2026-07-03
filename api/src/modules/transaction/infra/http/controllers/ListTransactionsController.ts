import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListTransactionsUseCase } from '../../../applications/use-cases/ListTransactionsUseCase';
import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';

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
  ) {
    return this.listTransactionsUseCase.execute({
      userId: request.user.id,
      page,
      limit,
    });
  }
}
