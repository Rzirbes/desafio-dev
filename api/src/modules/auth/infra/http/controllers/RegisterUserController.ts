import { Body, Controller, Post } from '@nestjs/common';

import { RegisterUserDTO } from '../../../applications/dtos/RegisterUserDTO';
import { RegisterUserUseCase } from '../../../applications/use-cases/RegisterUserUseCase';

@Controller()
export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('users')
  async handle(@Body() body: RegisterUserDTO) {
    return this.registerUserUseCase.execute(body);
  }
}
