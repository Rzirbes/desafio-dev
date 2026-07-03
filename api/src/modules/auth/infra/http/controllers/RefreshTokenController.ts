import { Body, Controller, Post } from '@nestjs/common';
import { RefreshTokenDTO } from '../../../applications/dtos/RefreshTokenDTO';
import { RefreshTokenUseCase } from '../../../applications/use-cases/RefreshTokenUseCase';

@Controller()
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh-token')
  async handle(@Body() body: RefreshTokenDTO) {
    return this.refreshTokenUseCase.execute(body);
  }
}
