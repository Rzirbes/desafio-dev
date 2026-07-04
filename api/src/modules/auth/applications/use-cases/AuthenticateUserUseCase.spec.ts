import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { AppError } from '../../../../shared/infra/http/errors/AppError';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthenticateUserUseCase', () => {
  let userRepository: {
    findByEmail: jest.Mock;
  };

  let refreshTokenRepository: {
    create: jest.Mock;
  };

  let sut: AuthenticateUserUseCase;

  const user = {
    id: 'user-id',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    role: 'USER',
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    userRepository = {
      findByEmail: jest.fn(),
    };

    refreshTokenRepository = {
      create: jest.fn(),
    };

    sut = new AuthenticateUserUseCase(
      userRepository as any,
      refreshTokenRepository as any,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
  });

  it('should authenticate user and return tokens', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
    jest
      .mocked(jwt.sign)
      .mockReturnValueOnce('access-token' as never)
      .mockReturnValueOnce('refresh-token' as never);

    const result = await sut.execute({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
    expect(refreshTokenRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw if JWT configuration is missing', async () => {
    delete process.env.JWT_SECRET;

    await expect(
      sut.execute({
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toEqual(new AppError('JWT configuration is missing.', 500));
  });

  it('should throw if user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      sut.execute({
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toEqual(new AppError('Invalid credentials', 401));
  });

  it('should throw if password does not match', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      sut.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toEqual(new AppError('Invalid credentials', 401));

    expect(refreshTokenRepository.create).not.toHaveBeenCalled();
  });
});
