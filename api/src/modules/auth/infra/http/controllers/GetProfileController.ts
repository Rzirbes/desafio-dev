import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { GetProfileUseCase } from '../../../applications/use-cases/GetProfileUseCase';
import { JwtAuthGuard } from '../middlewares/JwtAuthGuard';

type AuthenticatedRequest = FastifyRequest & {
  user: {
    id: string;
  };
};

@Controller('auth')
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async handle(@Req() request: AuthenticatedRequest) {
    return this.getProfileUseCase.execute({
      userId: request.user.id,
    });
  }
}
