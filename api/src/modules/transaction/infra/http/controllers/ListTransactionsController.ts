import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../../auth/infra/http/middlewares/JwtAuthGuard';
import { ListTransactionsUseCase } from '../../../applications/use-cases/ListTransactionsUseCase';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class ListTransactionsController {
  constructor(
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List transactions' })
  @ApiOkResponse({ description: 'Transactions listed successfully.' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    example: 7,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    example: 2026,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async handle(
    @Req() request: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.listTransactionsUseCase.execute({
      userId: request.user.id,
      page,
      limit,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      categoryId,
    });
  }
}
