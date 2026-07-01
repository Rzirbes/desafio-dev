import type { User } from '../../../../domain/entities/User';
import type { IUserRepository } from '../../../../domain/repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  create(user: User): Promise<User> {
    this.users.push(user);

    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return Promise.resolve(user ?? null);
  }

  findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    return Promise.resolve(user ?? null);
  }
}
