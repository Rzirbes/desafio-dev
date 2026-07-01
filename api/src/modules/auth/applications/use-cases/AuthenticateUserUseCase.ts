import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { RefreshToken } from '../../domain/entities/RefreshToken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { Inject, Injectable } from '@nestjs/common';
import {
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from '../../domain/repositories/tokens';

type AuthenticateUserRequest = {
  email: string;
  password: string;
};

type AuthenticateUserResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET as Secret,
      {
        subject: user.id,
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as StringValue,
      },
    );

    const refreshToken = jwt.sign(
      {},
      process.env.JWT_REFRESH_SECRET as Secret,
      {
        subject: user.id,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create(
      new RefreshToken({
        token: refreshToken,
        userId: user.id,
        expiresAt,
      }),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
