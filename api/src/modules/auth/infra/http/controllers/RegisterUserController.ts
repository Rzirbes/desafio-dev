import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

import { UserRole } from '../../../domain/enums/UserRole';
import { RegisterUserUseCase } from '../../../applications/use-cases/RegisterUserUseCase';

const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole).optional(),
});

@Controller()
export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('users')
  async handle(@Body() body: unknown) {
    const data = registerUserSchema.parse(body);

    return this.registerUserUseCase.execute({
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.role && { role: data.role }),
    });
  }
}
