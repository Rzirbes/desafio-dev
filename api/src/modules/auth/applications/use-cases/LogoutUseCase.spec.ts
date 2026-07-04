import { LogoutUseCase } from './LogoutUseCase';
import { RefreshToken } from '../../domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  beforeEach(() => {
    refreshTokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      deleteById: jest.fn(),
      deleteByUserId: jest.fn(),
    };

    logoutUseCase = new LogoutUseCase(refreshTokenRepository);
  });

  it('should delete refresh token when it exists', async () => {
    const token = new RefreshToken({
      userId: 'user-id',
      token: 'refresh-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    refreshTokenRepository.findByToken.mockResolvedValue(token);
    refreshTokenRepository.deleteById.mockResolvedValue();

    await logoutUseCase.execute({
      refreshToken: 'refresh-token',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'refresh-token',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.deleteById).toHaveBeenCalledWith(token.id);
  });

  it('should do nothing when refresh token does not exist', async () => {
    refreshTokenRepository.findByToken.mockResolvedValue(null);

    await logoutUseCase.execute({
      refreshToken: 'invalid-token',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'invalid-token',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refreshTokenRepository.deleteById).not.toHaveBeenCalled();
  });
});
