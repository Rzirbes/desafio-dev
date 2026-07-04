"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Category } from "@/types/category";
import { categoriesService } from "@/services/categories/categoriesService";

type ManageCategoriesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  categories: Category[];
};

export function ManageCategoriesModal({
  isOpen,
  onClose,
  token,
  categories,
}: ManageCategoriesModalProps) {
  const [name, setName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (!name.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    try {
      setIsLoading(true);

      await categoriesService.create({ name }, token);
      await mutate("/categories");

      toast.success("Categoria cadastrada com sucesso!");
      setName("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar a categoria.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateCategory(categoryId: string) {
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (!editingName.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    try {
      setIsLoading(true);

      await categoriesService.update(
        {
          id: categoryId,
          name: editingName,
        },
        token,
      );
      await mutate("/categories");

      toast.success("Categoria atualizada com sucesso!");
      setEditingCategoryId(null);
      setEditingName("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a categoria.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsLoading(true);

      await categoriesService.delete(categoryId, token);
      await mutate("/categories");

      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a categoria.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartEditing(category: Category) {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  }

  function handleCancelEditing() {
    setEditingCategoryId(null);
    setEditingName("");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">
            Gerenciar categorias
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <FormField
            label="Nova categoria"
            type="text"
            placeholder="Ex: Lanches"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Cadastrar categoria
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Categorias cadastradas
          </h3>

          {categories.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            categories.map((category) => {
              const isEditing = editingCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <FormField
                        label="Nome da categoria"
                        type="text"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="w-full"
                          isLoading={isLoading}
                          onClick={() => handleUpdateCategory(category.id)}
                        >
                          Salvar
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleCancelEditing}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-800">
                        {category.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditing(category)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-800"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-white hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
