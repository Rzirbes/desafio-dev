import { randomUUID } from 'crypto';
import { TransactionType } from '../enums/TransactionType';

type TransactionProps = {
  description: string;
  amount: number;
  type: TransactionType;
  userId: string;
  categoryId: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Transaction {
  private readonly _id: string;

  public description: string;
  public amount: number;
  public type: TransactionType;
  public userId: string;
  public categoryId: string;
  public date: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: TransactionProps, id?: string) {
    this._id = id ?? randomUUID();

    this.description = props.description;
    this.amount = props.amount;
    this.type = props.type;
    this.userId = props.userId;
    this.categoryId = props.categoryId;
    this.date = props.date;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }
}
