"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Category } from "@/types/category";
import { Select } from "../ui/Select";
import { Label } from "../ui/Label";
import { CreateCategoryModal } from "../categories/CreateCategoryModal";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService } from "@/services/transactions/transactionsService";
import { Transaction, TransactionType } from "@/types/transaction";
import { DatePicker } from "../ui/DatePicker";

type CreateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onTransactionCreated: () => void;
  transaction?: Transaction | null;
  onSuccess?: () => void;
};

export function CreateTransactionModal({
  isOpen,
  onClose,
  categories,
  onTransactionCreated,
  transaction,
  onSuccess,
}: CreateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const isEditing = !!transaction;

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    if (transaction) {
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setCategoryId(transaction.categoryId);
      setDate(new Date(transaction.date));
      return;
    }

    setDescription("");
    setAmount("");
    setType("EXPENSE");
    setCategoryId("");
    setDate(new Date());
  }, [isOpen, transaction]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) return;

    if (
      !description.trim() ||
      !amount.trim() ||
      !type ||
      !categoryId ||
      !date
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    setIsLoading(true);

    try {
      const payload = {
        description,
        amount: Number(amount),
        type,
        categoryId,
        date: date.toISOString(),
      };

      if (isEditing && transaction) {
        await transactionsService.update(accessToken, transaction._id, payload);

        toast.success("Transação atualizada com sucesso!");
        onSuccess?.();
      } else {
        await transactionsService.create(accessToken, payload);

        toast.success("Transação cadastrada com sucesso!");
        await onTransactionCreated();
      }

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Não foi possível atualizar a transação."
            : "Não foi possível cadastrar a transação.",
      );
    } finally {
      setIsLoading(false);
    }
  }
  console.log("categories:", categories);
  console.log("categoryId atual:", categoryId);
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

            <div className="space-y-1">
              <Label>Data</Label>

              <DatePicker selected={date} onChange={setDate} />
            </div>

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
