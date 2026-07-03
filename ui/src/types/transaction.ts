export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  userId: string;
  categoryId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedTransactionsResponse = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateTransactionDTO = {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
};

export type CreateTransactionResponse = {
  transaction: Transaction;
};
