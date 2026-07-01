import type { Request, Response } from 'express';
import { z } from 'zod';
import { LogoutUseCase } from '../../../applications/use-cases/LogoutUseCase';

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
