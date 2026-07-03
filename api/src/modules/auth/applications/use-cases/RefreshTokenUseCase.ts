import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { RefreshToken } from '../../domain/entities/RefreshToken';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/tokens';

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

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const refreshTokenExists =
      await this.refreshTokenRepository.findByToken(refreshToken);

    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      throw new AppError('JWT configuration is missing.', 500);
    }

    if (!refreshTokenExists) {
      throw new AppError('Refresh token does not exist', 401);
    }

    if (refreshTokenExists.isExpired) {
      throw new AppError('Refresh token expired', 401);
    }

    let decoded: TokenPayload;

    try {
      decoded = jwt.verify(refreshToken, jwtRefreshSecret) as TokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const userId = decoded.sub;

    if (!userId) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = jwt.sign({}, jwtSecret as Secret, {
      subject: userId,
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as StringValue,
    });

    const newRefreshToken = jwt.sign({}, jwtRefreshSecret as Secret, {
      subject: userId,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
    });

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
