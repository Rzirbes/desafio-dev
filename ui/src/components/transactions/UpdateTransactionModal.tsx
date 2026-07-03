"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService } from "@/services/transactions/transactionsService";
import { CreateCategoryModal } from "../categories/CreateCategoryModal";
import { TransactionForm } from "./TransactionForm";

type UpdateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  transaction: Transaction | null;
  onSuccess: () => void;
};

export function UpdateTransactionModal({
  isOpen,
  onClose,
  categories,
  transaction,
  onSuccess,
}: UpdateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!isOpen || !transaction) return;

    console.log("transaction.categoryId:", transaction.categoryId);
    console.log("categories:", categories);

    setDescription(transaction.description);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setCategoryId(transaction.categoryId);
    setDate(new Date(transaction.date));
  }, [isOpen, transaction, categories]);

  if (!isOpen || !transaction) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    try {
      await transactionsService.update(accessToken, transaction!._id, {
        description,
        amount: Number(amount),
        type,
        categoryId,
        date: date.toISOString(),
      });

      toast.success("Transação atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a transação.",
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
            <h2 className="text-xl font-semibold text-black">
              Editar transação
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
          </div>

          <TransactionForm
            description={description}
            amount={amount}
            type={type}
            categoryId={categoryId}
            date={date}
            categories={categories}
            isLoading={isLoading}
            submitLabel="Salvar"
            loadingLabel="Salvando..."
            onDescriptionChange={setDescription}
            onAmountChange={setAmount}
            onTypeChange={setType}
            onCategoryChange={setCategoryId}
            onDateChange={setDate}
            onSubmit={handleSubmit}
            onCancel={onClose}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
          />
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
