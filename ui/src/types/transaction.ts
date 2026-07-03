export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionSummary = {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
};

export type Transaction = {
  _id: string;
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
  summary: TransactionSummary;
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

export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;

export type UpdateTransactionResponse = {
  transaction: Transaction;
};
