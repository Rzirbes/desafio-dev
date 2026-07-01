import bcrypt from 'bcrypt';

import { User } from '../../domain/entities/User';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { UserRole } from '../../domain/enums/UserRole';

type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password, role }: RegisterUserRequest) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role ?? UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    };
  }
}
