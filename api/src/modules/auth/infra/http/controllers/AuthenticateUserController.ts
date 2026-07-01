import type { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticateUserUseCase } from '../../../applications/use-cases/AuthenticateUserUseCase';

const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(request: Request, response: Response) {
    const { email, password } = authenticateUserSchema.parse(request.body);

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    return response.status(200).json(result);
  }
}
