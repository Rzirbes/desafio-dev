import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { GetProfileUseCase } from '../../../applications/use-cases/GetProfileUseCase';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../middlewares/JwtAuthGuard';

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
