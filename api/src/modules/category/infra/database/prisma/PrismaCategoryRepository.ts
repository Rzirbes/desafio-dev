import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { Category } from '../../../domain/entities/Category';
import { prisma } from '../../../../auth/infra/database/prisma/client';

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        userId: category.userId,
      },
    });

    return new Category(
      {
        name: createdCategory.name,
        userId: createdCategory.userId,
        createdAt: createdCategory.createdAt,
        updatedAt: createdCategory.updatedAt,
      },
      createdCategory.id,
    );
  }

  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return new Category(
      {
        name: category.name,
        userId: category.userId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      category.id,
    );
  }

  async findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (!category) {
      return null;
    }

    return new Category(
      {
        name: category.name,
        userId: category.userId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      category.id,
    );
  }

  async findManyByUserId(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories.map(
      (category) =>
        new Category(
          {
            name: category.name,
            userId: category.userId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
          category.id,
        ),
    );
  }

  async update(category: Category): Promise<Category> {
    if (!category.id) {
      throw new Error('Category id is required.');
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
        updatedAt: new Date(),
      },
    });

    return new Category(
      {
        name: updatedCategory.name,
        userId: updatedCategory.userId,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
      },
      updatedCategory.id,
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
