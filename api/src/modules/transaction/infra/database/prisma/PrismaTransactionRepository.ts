import {
  FindManyByUserIdParams,
  ITransactionRepository,
  PaginatedTransactions,
} from '../../../domain/repositories/ITransactionRepository';
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

  async findManyByUserId({
    userId,
    page,
    limit,
    month,
    year,
  }: FindManyByUserIdParams): Promise<PaginatedTransactions> {
    const skip = (page - 1) * limit;

    const where: {
      userId: string;
      date?: {
        gte: Date;
        lt: Date;
      };
    } = {
      userId,
    };

    if (month && year) {
      where.date = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      };
    }

    const [transactions, total, summary] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),

      prisma.transaction.count({
        where,
      }),

      prisma.transaction.groupBy({
        by: ['type'],
        where,
        orderBy: {
          type: 'asc',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const incomeSummary = summary.find((item) => item.type === 'INCOME');
    const expenseSummary = summary.find((item) => item.type === 'EXPENSE');

    const incomeTotal = Number(incomeSummary?._sum?.amount ?? 0);
    const expenseTotal = Number(expenseSummary?._sum?.amount ?? 0);

    const balance = incomeTotal - expenseTotal;

    return {
      transactions: transactions.map(
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
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        incomeTotal: Number(incomeTotal),
        expenseTotal: Number(expenseTotal),
        balance,
      },
    };
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

  async existsByCategoryId(categoryId: string): Promise<boolean> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        categoryId,
      },
      select: {
        id: true,
      },
    });

    return !!transaction;
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id },
    });
  }
}
