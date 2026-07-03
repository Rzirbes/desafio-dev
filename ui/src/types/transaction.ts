export type TransactionType = "INCOME" | "EXPENSE";

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
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
