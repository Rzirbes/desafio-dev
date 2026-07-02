import { clientFetcher } from "../clientFetcher";

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export const categoriesService = {
  list(token: string) {
    return clientFetcher<Category[]>("/categories", {
      token,
    });
  },

  create(data: CreateCategoryRequest, token: string) {
    return clientFetcher<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  update(data: UpdateCategoryRequest, token: string) {
    return clientFetcher<Category>(`/categories/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
      }),
      token,
    });
  },

  delete(id: string, token: string) {
    return clientFetcher<void>(`/categories/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
