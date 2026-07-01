import { Inject, Injectable } from '@nestjs/common';

import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/tokens';

type LogoutRequest = {
  refreshToken: string;
};

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute({ refreshToken }: LogoutRequest) {
    const token = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
      return;
    }

    await this.refreshTokenRepository.deleteById(token.id);
  }
}
