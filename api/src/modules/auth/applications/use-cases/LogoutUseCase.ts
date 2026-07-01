import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';

type LogoutRequest = {
  refreshToken: string;
};

export class LogoutUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async execute({ refreshToken }: LogoutRequest) {
    const token = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
      return;
    }

    await this.refreshTokenRepository.deleteById(token.id);
  }
}
