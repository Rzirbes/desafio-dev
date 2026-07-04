import { GetProfileUseCase } from './GetProfileUseCase';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { User } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

describe('GetProfileUseCase', () => {
  let getProfileUseCase: GetProfileUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    getProfileUseCase = new GetProfileUseCase(userRepository);
  });

  it('should be able to get user profile', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
    });

    userRepository.findById.mockResolvedValue(user);

    const result = await getProfileUseCase.execute({
      userId: user.id,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);

    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  });

  it('should not be able to get profile from non-existing user', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      getProfileUseCase.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      getProfileUseCase.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 404,
    });
  });
});
