import { Category } from '../entities/Category.js';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;

  findById(id: string): Promise<Category | null>;

  findByNameAndUserId(name: string, userId: string): Promise<Category | null>;

  findManyByUserId(userId: string): Promise<Category[]>;

  update(category: Category): Promise<Category>;

  delete(id: string): Promise<void>;
}
