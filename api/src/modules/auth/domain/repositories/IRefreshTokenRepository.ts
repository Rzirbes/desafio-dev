import type { RefreshToken } from '../entities/RefreshToken';

export interface IRefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;

  findByToken(token: string): Promise<RefreshToken | null>;

  deleteById(id: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}
