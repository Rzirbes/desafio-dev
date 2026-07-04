"use client";

import { useState } from "react";
import useSWR from "swr";

import { Header } from "@/components/layout/Header";
import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";
import { useAuth } from "@/hooks/useAuth";
import { categoriesService } from "@/services/categories/categoriesService";
import { transactionsService } from "@/services/transactions/transactionsService";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { TransactionsFilters } from "@/components/dashboard/TransactionsFilters";
import { Transaction } from "@/types/transaction";
import { UpdateTransactionModal } from "@/components/transactions/UpdateTransactionModal";

export default function DashboardPage() {
  const { accessToken } = useAuth();

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const { data: categories = [] } = useSWR(
    accessToken ? "/categories" : null,
    () => categoriesService.list(accessToken!),
  );
  const [categoryId, setCategoryId] = useState("all");

  const {
    data: transactionsResponse,
    isLoading,
    mutate,
  } = useSWR(
    accessToken
      ? ["/transactions", page, limit, month, year, categoryId]
      : null,
    () =>
      transactionsService.list(accessToken!, {
        page,
        limit: 10,
        month,
        year,
        categoryId: categoryId === "all" ? undefined : categoryId,
      }),
  );

  const transactions = transactionsResponse?.transactions ?? [];

  const summary = transactionsResponse?.summary ?? {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
  };

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    if (!accessToken) return;

    const confirmDelete = confirm(
      `Deseja realmente excluir "${transaction.description}"?`,
    );

    if (!confirmDelete) return;

    await transactionsService.delete(accessToken, transaction._id);

    mutate();
  }

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <Header />

          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              title="Saldo atual"
              value={formatCurrency(summary.balance)}
            />

            <SummaryCard
              title="Receitas"
              value={formatCurrency(summary.incomeTotal)}
              valueClassName="text-green-600"
            />

            <SummaryCard
              title="Despesas"
              value={formatCurrency(summary.expenseTotal)}
              valueClassName="text-red-600"
            />
          </section>

          <TransactionsFilters
            month={month}
            year={year}
            categoryId={categoryId}
            categories={categories}
            onMonthChange={(month) => {
              setMonth(month);
              setPage(1);
            }}
            onYearChange={(year) => {
              setYear(year);
              setPage(1);
            }}
            onCategoryChange={(categoryId) => {
              setCategoryId(categoryId);
              setPage(1);
            }}
          />

          <TransactionsList
            transactions={transactions}
            isLoading={isLoading}
            page={transactionsResponse?.page ?? page}
            totalPages={transactionsResponse?.totalPages ?? 1}
            totalItems={transactionsResponse?.total ?? 0}
            itemsOnPage={transactions.length}
            onPreviousPage={() => setPage((currentPage) => currentPage - 1)}
            onNextPage={() => setPage((currentPage) => currentPage + 1)}
            onCreateTransaction={() => {
              setEditingTransaction(null);
              setIsCreateTransactionModalOpen(true);
            }}
            onEditTransaction={(transaction) => {
              setIsCreateTransactionModalOpen(false);
              setEditingTransaction(transaction);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </main>

      <CreateTransactionModal
        isOpen={isCreateTransactionModalOpen}
        onClose={() => {
          setIsCreateTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        categories={categories}
        onTransactionCreated={mutate}
      />

      <UpdateTransactionModal
        key={editingTransaction?._id ?? "update-transaction"}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        categories={categories}
        transaction={editingTransaction}
        onSuccess={mutate}
      />
    </>
  );
}
