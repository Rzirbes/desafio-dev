import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCategoryUseCase } from '../../applications/use-cases/CreateCategoryUseCase';
import type { FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/infra/http/middlewares/JwtAuthGuard';

type CreateCategoryBody = {
  name: string;
};

type AuthenticatedRequest = FastifyRequest & {
  user: {
    id: string;
    role: UserRole;
  };
};

@Controller('categories')
export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: CreateCategoryBody,
    @Req() request: AuthenticatedRequest,
  ) {
    const category = await this.createCategoryUseCase.execute({
      name: body.name,
      userId: request.user.id,
    });

    return category;
  }
}
