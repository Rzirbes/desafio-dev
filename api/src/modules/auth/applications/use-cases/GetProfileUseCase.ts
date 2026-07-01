import { Inject, Injectable } from '@nestjs/common';

import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { USER_REPOSITORY } from '../../domain/repositories/tokens';

type GetProfileRequest = {
  userId: string;
};

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ userId }: GetProfileRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
