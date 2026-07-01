import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../../applications/use-cases/AuthenticateUserUseCase';
import { AuthenticateUserDTO } from '../../../applications/dtos/AuthenticateUserDTO';

@Controller()
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post('sessions')
  async handle(@Body() body: AuthenticateUserDTO) {
    return this.authenticateUserUseCase.execute(body);
  }
}
