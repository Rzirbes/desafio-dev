"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Category } from "@/types/category";
import { TransactionType } from "@/types/transaction";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService } from "@/services/transactions/transactionsService";
import { TransactionForm } from "./TransactionForm";
import { ManageCategoriesModal } from "../categories/ManageCategoriesModal";

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
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const { accessToken } = useAuth();

  if (!isOpen) return null;

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
      await transactionsService.create(accessToken, {
        description,
        amount: Number(amount),
        type,
        categoryId,
        date: date.toISOString(),
      });

      toast.success("Transação cadastrada com sucesso!");
      await onTransactionCreated();

      setDescription("");
      setAmount("");
      setType("EXPENSE");
      setCategoryId("");
      setDate(new Date());

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

          <TransactionForm
            description={description}
            amount={amount}
            type={type}
            categoryId={categoryId}
            date={date}
            categories={categories}
            isLoading={isLoading}
            submitLabel="Cadastrar"
            loadingLabel="Cadastrando..."
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

      <ManageCategoriesModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        token={accessToken}
        categories={categories}
      />
    </>
  );
}
