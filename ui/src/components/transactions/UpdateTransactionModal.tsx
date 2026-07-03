"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService } from "@/services/transactions/transactionsService";
import { TransactionForm } from "./TransactionForm";
import { ManageCategoriesModal } from "../categories/ManageCategoriesModal";

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

  console.log("transaction", transaction);

  useEffect(() => {
    if (!isOpen) return;
    if (!transaction) return;

    setDescription(transaction.description ?? "");
    setAmount(String(transaction.amount ?? ""));
    setType(transaction.type as TransactionType);
    setCategoryId(transaction.categoryId || transaction.category?.id || "");
    setDate(new Date(transaction.date));
  }, [isOpen, transaction?._id]);

  if (!isOpen || !transaction) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken || !transaction) return;

    const formType = type || transaction.type;
    const formCategoryId =
      categoryId || transaction.categoryId || transaction.category?.id || "";

    const formDescription = description || transaction.description;
    const formAmount = amount || String(transaction.amount);

    if (
      !formDescription.trim() ||
      !formAmount.trim() ||
      !formType ||
      !formCategoryId ||
      !date
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      await transactionsService.update(accessToken, transaction._id, {
        description: formDescription,
        amount: Number(formAmount),
        type: formType as TransactionType,
        categoryId: formCategoryId,
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
  const formType = type || transaction.type;
  const formCategoryId =
    categoryId || transaction.categoryId || transaction.category?.id || "";
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
            description={description || transaction.description}
            amount={amount || String(transaction.amount)}
            type={formType as TransactionType}
            categoryId={formCategoryId}
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

      <ManageCategoriesModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        token={accessToken}
        categories={categories}
      />
    </>
  );
}
