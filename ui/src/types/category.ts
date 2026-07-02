export type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryRequest = {
  name: string;
};

export type UpdateCategoryRequest = {
  id: string;
  name: string;
};
