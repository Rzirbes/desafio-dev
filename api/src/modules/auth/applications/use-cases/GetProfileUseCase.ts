import { AppError } from 'src/shared/infra/http/errors/AppError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

type GetProfileRequest = {
  userId: string;
};

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

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
