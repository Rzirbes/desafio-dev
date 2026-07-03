import { Transaction } from '../entities/Transaction';

export type FindManyByUserIdParams = {
  userId: string;
  page: number;
  limit: number;
  month?: number;
  year?: number;
};

export type PaginatedTransactions = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: {
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
  };
};

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;

  findById(id: string): Promise<Transaction | null>;

  findManyByUserId(
    params: FindManyByUserIdParams,
  ): Promise<PaginatedTransactions>;

  existsByCategoryId(categoryId: string): Promise<boolean>;

  update(transaction: Transaction): Promise<Transaction>;

  delete(id: string): Promise<void>;
}
