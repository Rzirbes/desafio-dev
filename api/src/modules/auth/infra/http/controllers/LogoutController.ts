import { Body, Controller, Post } from '@nestjs/common';
import { LogoutDTO } from '../../../applications/dtos/LogoutDTO';
import { LogoutUseCase } from '../../../applications/use-cases/LogoutUseCase';

@Controller()
export class LogoutController {
  constructor(private readonly logoutUseCase: LogoutUseCase) {}

  @Post('logout')
  async handle(@Body() body: LogoutDTO) {
    await this.logoutUseCase.execute(body);

    return {
      message: 'Logged out successfully',
    };
  }
}
