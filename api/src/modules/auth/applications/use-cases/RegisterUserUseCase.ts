import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { USER_REPOSITORY } from '../../domain/repositories/tokens';
import { AppError } from '../../../../shared/infra/http/errors/AppError';

type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

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
