import { Inject, Injectable } from '@nestjs/common';

import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/tokens';
import { AppError } from '../../../../shared/infra/http/errors/AppError';

type DeleteTransactionRequest = {
  id: string;
  userId: string;
};

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({ id, userId }: DeleteTransactionRequest): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError('Transaction not found', 404);
    }

    await this.transactionRepository.delete(id);
  }
}
