import { clientFetcher } from "@/services/clientFetcher";
import {
  CreateTransactionDTO,
  CreateTransactionResponse,
  PaginatedTransactionsResponse,
  UpdateTransactionDTO,
  UpdateTransactionResponse,
} from "@/types/transaction";

type ListParams = {
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
  categoryId?: string;
};

export const transactionsService = {
  list(token: string, params: ListParams = {}) {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(params.page ?? 1));
    searchParams.set("limit", String(params.limit ?? 10));

    if (params.month) {
      searchParams.set("month", String(params.month));
    }

    if (params.year) {
      searchParams.set("year", String(params.year));
    }

    if (params.categoryId) {
      searchParams.set("categoryId", params.categoryId);
    }

    return clientFetcher<PaginatedTransactionsResponse>(
      `/transactions?${searchParams.toString()}`,
      {
        token,
      },
    );
  },

  create(token: string, data: CreateTransactionDTO) {
    return clientFetcher<CreateTransactionResponse>("/transactions", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  update(token: string, id: string, data: UpdateTransactionDTO) {
    return clientFetcher<UpdateTransactionResponse>(`/transactions/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  delete(token: string, id: string) {
    return clientFetcher<void>(`/transactions/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
