"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Category } from "@/types/category";
import { Select } from "../ui/Select";
import { Label } from "../ui/Label";
import { CreateCategoryModal } from "../categories/CreateCategoryModal";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService } from "@/services/transactions/transactionsService";
import { TransactionType } from "@/types/transaction";

type CreateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onTransactionCreated: () => void;
};

export function CreateTransactionModal({
  isOpen,
  onClose,
  categories,
  onTransactionCreated,
}: CreateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const { accessToken } = useAuth();

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setIsLoading(true);

    try {
      await transactionsService.create(accessToken, {
        description,
        amount: Number(amount),
        type,
        categoryId,
        date: new Date(date).toISOString(),
      });

      await onTransactionCreated();

      toast.success("Transação cadastrada com sucesso!");

      setDescription("");
      setAmount("");
      setType("EXPENSE");
      setCategoryId("");
      setDate("");

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar a transação.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Nova transação</h2>

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
              label="Descrição"
              type="text"
              placeholder="Ex: Mercado"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <FormField
              label="Valor"
              type="number"
              placeholder="Ex: 150.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <div className="space-y-1">
              <Label>Tipo</Label>

              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
                placeholder="Selecione o tipo"
                options={[
                  { value: "INCOME", label: "Entrada" },
                  { value: "EXPENSE", label: "Saída" },
                ]}
              />
            </div>

            <div className="space-y-1">
              <Label>Categoria</Label>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                    placeholder={
                      categories.length > 0
                        ? "Selecione uma categoria"
                        : "Nenhuma categoria encontrada"
                    }
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-auto px-4"
                  onClick={() => setIsCreateCategoryModalOpen(true)}
                >
                  Nova
                </Button>
              </div>
            </div>

            <FormField
              label="Data"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>

              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        token={accessToken}
      />
    </>
  );
}
