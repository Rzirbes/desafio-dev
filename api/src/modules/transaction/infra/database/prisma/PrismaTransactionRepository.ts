import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';
import { prisma } from '../../../../auth/infra/database/prisma/client';
import { TransactionType } from '../../../domain/enums/TransactionType';

export class PrismaTransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const createdTransaction = await prisma.transaction.create({
      data: {
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        userId: transaction.userId,
        categoryId: transaction.categoryId,
      },
    });

    return new Transaction(
      {
        description: createdTransaction.description,
        amount: Number(createdTransaction.amount),
        type: createdTransaction.type as TransactionType,
        date: createdTransaction.date,
        userId: createdTransaction.userId,
        categoryId: createdTransaction.categoryId,
        createdAt: createdTransaction.createdAt,
        updatedAt: createdTransaction.updatedAt,
      },
      createdTransaction.id,
    );
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return null;
    }

    return new Transaction(
      {
        description: transaction.description,
        amount: Number(transaction.amount),
        type: transaction.type as TransactionType,
        date: transaction.date,
        userId: transaction.userId,
        categoryId: transaction.categoryId,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
      transaction.id,
    );
  }

  async findManyByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          {
            description: transaction.description,
            amount: Number(transaction.amount),
            type: transaction.type as TransactionType,
            date: transaction.date,
            userId: transaction.userId,
            categoryId: transaction.categoryId,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
          },
          transaction.id,
        ),
    );
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        categoryId: transaction.categoryId,
      },
    });

    return new Transaction(
      {
        description: updatedTransaction.description,
        amount: Number(updatedTransaction.amount),
        type: updatedTransaction.type as TransactionType,
        date: updatedTransaction.date,
        userId: updatedTransaction.userId,
        categoryId: updatedTransaction.categoryId,
        createdAt: updatedTransaction.createdAt,
        updatedAt: updatedTransaction.updatedAt,
      },
      updatedTransaction.id,
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id },
    });
  }
}
