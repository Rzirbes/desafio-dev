import type { Request, Response } from 'express';
import { RefreshTokenUseCase } from 'src/modules/auth/applications/use-cases/RefreshTokenUseCase';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(request: Request, response: Response) {
    const { refreshToken } = refreshTokenSchema.parse(request.body);

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
    });

    return response.status(200).json(result);
  }
}
