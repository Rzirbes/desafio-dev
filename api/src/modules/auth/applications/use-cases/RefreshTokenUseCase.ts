import jwt, { type Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { AppError } from 'src/shared/infra/http/errors/AppError';
import { RefreshToken } from '../../domain/entities/RefreshToken';

type RefreshTokenRequest = {
  refreshToken: string;
};

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

type TokenPayload = {
  sub: string;
};

export class RefreshTokenUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async execute({
    refreshToken,
  }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const refreshTokenExists =
      await this.refreshTokenRepository.findByToken(refreshToken);

    if (!refreshTokenExists) {
      throw new AppError('Refresh token does not exist', 401);
    }

    if (refreshTokenExists.isExpired) {
      throw new AppError('Refresh token expired', 401);
    }

    let decoded: TokenPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as Secret,
      ) as TokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const userId = decoded.sub;

    if (!userId) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = jwt.sign({}, process.env.JWT_SECRET as Secret, {
      subject: userId,
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as StringValue,
    });

    const newRefreshToken = jwt.sign(
      {},
      process.env.JWT_REFRESH_SECRET as Secret,
      {
        subject: userId,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.deleteById(refreshTokenExists.id);

    await this.refreshTokenRepository.create(
      new RefreshToken({
        token: newRefreshToken,
        userId,
        expiresAt,
      }),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
