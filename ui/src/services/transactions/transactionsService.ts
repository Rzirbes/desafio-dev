import { clientFetcher } from "@/services/clientFetcher";
import { PaginatedTransactionsResponse } from "@/types/transaction";

type ListParams = {
  page?: number;
  limit?: number;
};

export const transactionsService = {
  list(token: string, params: ListParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;

    return clientFetcher<PaginatedTransactionsResponse>(
      `/transactions?page=${page}&limit=${limit}`,
      {
        token,
      },
    );
  },
};
