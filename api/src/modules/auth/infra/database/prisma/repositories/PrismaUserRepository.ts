import { User } from '../../../../domain/entities/User';
import type { UserRole } from '../../../../domain/enums/UserRole';
import type { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { prisma } from '../client.js';

export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });

    return new User(
      {
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
        role: createdUser.role as UserRole,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
      createdUser.id,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new User(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }
}
