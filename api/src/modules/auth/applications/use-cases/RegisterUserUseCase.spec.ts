import * as bcrypt from 'bcrypt';

import { RegisterUserUseCase } from './RegisterUserUseCase';
import { User } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be able to register a new user', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
    userRepository.create.mockImplementation((user) => Promise.resolve(user));

    const result = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 8);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepository.create).toHaveBeenCalled();

    expect(result.id).toEqual(expect.any(String));
    expect(result.createdAt).toEqual(expect.any(Date));
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.role).toBe(UserRole.USER);
  });

  it('should not be able to register with an existing email', async () => {
    const existingUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
    });

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      registerUserUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toMatchObject({
      message: 'User already exists',
      statusCode: 409,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
