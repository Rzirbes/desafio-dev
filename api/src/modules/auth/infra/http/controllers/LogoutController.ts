import type { Request, Response } from 'express';
import { LogoutUseCase } from 'src/modules/auth/applications/use-cases/LogoutUseCase';
import { z } from 'zod';

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export class LogoutController {
  constructor(private logoutUseCase: LogoutUseCase) {}

  async handle(request: Request, response: Response) {
    const { refreshToken } = logoutSchema.parse(request.body);

    await this.logoutUseCase.execute({
      refreshToken,
    });

    return response.status(200).json({
      message: 'Logged out successfully',
    });
  }
}
