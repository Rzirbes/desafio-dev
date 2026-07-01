import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { RefreshTokenUseCase } from '../../../applications/use-cases/RefreshTokenUseCase';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

@Controller()
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh-token')
  async handle(@Body() body: unknown) {
    const { refreshToken } = refreshTokenSchema.parse(body);

    return this.refreshTokenUseCase.execute({
      refreshToken,
    });
  }
}
