import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { LogoutUseCase } from '../../../applications/use-cases/LogoutUseCase';

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

@Controller()
export class LogoutController {
  constructor(private readonly logoutUseCase: LogoutUseCase) {}

  @Post('logout')
  async handle(@Body() body: unknown) {
    const { refreshToken } = logoutSchema.parse(body);

    await this.logoutUseCase.execute({
      refreshToken,
    });

    return {
      message: 'Logged out successfully',
    };
  }
}
