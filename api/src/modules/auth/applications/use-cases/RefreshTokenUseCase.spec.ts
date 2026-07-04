import * as jwt from 'jsonwebtoken';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';
import { RefreshToken } from '../../domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;

  beforeEach(() => {
    refreshTokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      deleteById: jest.fn(),
      deleteByUserId: jest.fn(),
    };

    refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository);

    process.env.JWT_SECRET = 'jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'jwt-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to refresh tokens', async () => {
    const currentRefreshToken = jwt.sign({}, 'jwt-refresh-secret', {
      subject: 'user-id',
      expiresIn: '7d',
    });

    const refreshTokenEntity = new RefreshToken({
      token: currentRefreshToken,
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    refreshTokenRepository.findByToken.mockResolvedValue(refreshTokenEntity);
    refreshTokenRepository.deleteById.mockResolvedValue();
    refreshTokenRepository.create.mockResolvedValue(
      new RefreshToken({
        token: 'new-refresh-token',
        userId: 'user-id',
        expiresAt: new Date(),
      }),
    );

    const result = await refreshTokenUseCase.execute({
      refreshToken: currentRefreshToken,
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      currentRefreshToken,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.deleteById).toHaveBeenCalledWith(
      refreshTokenEntity.id,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.create).toHaveBeenCalled();
  });

  it('should not be able to refresh token when JWT config is missing', async () => {
    delete process.env.JWT_SECRET;

    await expect(
      refreshTokenUseCase.execute({
        refreshToken: 'refresh-token',
      }),
    ).rejects.toMatchObject({
      message: 'JWT configuration is missing.',
      statusCode: 500,
    });
  });

  it('should not be able to refresh token when token does not exist', async () => {
    refreshTokenRepository.findByToken.mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute({
        refreshToken: 'invalid-refresh-token',
      }),
    ).rejects.toMatchObject({
      message: 'Refresh token does not exist',
      statusCode: 401,
    });
  });

  it('should not be able to refresh token when token is expired', async () => {
    const expiredRefreshToken = jwt.sign({}, 'jwt-refresh-secret', {
      subject: 'user-id',
      expiresIn: '7d',
    });

    const refreshTokenEntity = new RefreshToken({
      token: expiredRefreshToken,
      userId: 'user-id',
      expiresAt: new Date(Date.now() - 1000),
    });

    refreshTokenRepository.findByToken.mockResolvedValue(refreshTokenEntity);

    await expect(
      refreshTokenUseCase.execute({
        refreshToken: expiredRefreshToken,
      }),
    ).rejects.toMatchObject({
      message: 'Refresh token expired',
      statusCode: 401,
    });
  });

  it('should not be able to refresh token when token is invalid', async () => {
    const refreshTokenEntity = new RefreshToken({
      token: 'invalid-refresh-token',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    refreshTokenRepository.findByToken.mockResolvedValue(refreshTokenEntity);

    await expect(
      refreshTokenUseCase.execute({
        refreshToken: 'invalid-refresh-token',
      }),
    ).rejects.toMatchObject({
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  });
});
