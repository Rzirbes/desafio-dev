import { TransactionType } from '../../domain/enums/TransactionType';

export type CreateTransactionDTO = {
  description: string;
  amount: number;
  type: TransactionType;
  userId: string;
  categoryId: string;
  date?: Date;
};
