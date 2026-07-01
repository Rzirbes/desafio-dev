import type { Request, Response } from 'express';
import { z } from 'zod';

import { UserRole } from '../../../domain/enums/UserRole.js';
import { RegisterUserUseCase } from '../../../applications/use-cases/RegisterUserUseCase.js';

const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole).optional(),
});

export class RegisterUserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async handle(request: Request, response: Response) {
    const data = registerUserSchema.parse(request.body);

    const user = await this.registerUserUseCase.execute({
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.role && { role: data.role }),
    });

    return response.status(201).json(user);
  }
}
