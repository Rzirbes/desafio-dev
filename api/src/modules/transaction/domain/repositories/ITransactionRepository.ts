import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;

  findById(id: string): Promise<Transaction | null>;

  findManyByUserId(userId: string): Promise<Transaction[]>;

  update(transaction: Transaction): Promise<Transaction>;

  delete(id: string): Promise<void>;
}
