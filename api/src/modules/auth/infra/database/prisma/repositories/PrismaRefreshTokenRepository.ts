import { prisma } from '../client';

import { RefreshToken } from '../../../../domain/entities/RefreshToken';
import type { IRefreshTokenRepository } from '../../../../domain/repositories/IRefreshTokenRepository';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const createdRefreshToken = await prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        token: refreshToken.token,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
      },
    });

    return new RefreshToken(
      {
        token: createdRefreshToken.token,
        userId: createdRefreshToken.userId,
        expiresAt: createdRefreshToken.expiresAt,
        createdAt: createdRefreshToken.createdAt,
      },
      createdRefreshToken.id,
    );
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return new RefreshToken(
      {
        token: refreshToken.token,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt,
      },
      refreshToken.id,
    );
  }

  async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
