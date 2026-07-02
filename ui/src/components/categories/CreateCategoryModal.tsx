"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
import { categoriesService } from "@/services/categories/categoriesService";
import { mutate } from "swr";

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
};

export function CreateCategoryModal({
  isOpen,
  onClose,
  token,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    try {
      setIsLoading(true);

      await categoriesService.create({ name }, token);

      await mutate("/categories");

      toast.success("Categoria cadastrada com sucesso!");
      setName("");
      onClose();
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">Nova categoria</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nome"
            type="text"
            placeholder="Ex: Lanches"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Cadastrar
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
