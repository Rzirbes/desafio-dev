"use client";

import { useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";
import { useAuth } from "@/hooks/useAuth";
import { categoriesService } from "@/services/categories/categoriesService";
import { transactionsService } from "@/services/transactions/transactionsService";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionsList } from "@/components/dashboard/TransactionsList";

export default function DashboardPage() {
  const { accessToken } = useAuth();

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categories = [] } = useSWR(
    accessToken ? "/categories" : null,
    () => categoriesService.list(accessToken!),
  );

  const {
    data: transactionsResponse,
    isLoading,
    mutate,
  } = useSWR(accessToken ? [`/transactions`, page, limit] : null, () =>
    transactionsService.list(accessToken!, { page, limit }),
  );

  const transactions = transactionsResponse?.transactions ?? [];

  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = incomeTotal - expenseTotal;

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <Header />

          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard title="Saldo atual" value={formatCurrency(balance)} />

            <SummaryCard
              title="Receitas"
              value={formatCurrency(incomeTotal)}
              valueClassName="text-green-600"
            />

            <SummaryCard
              title="Despesas"
              value={formatCurrency(expenseTotal)}
              valueClassName="text-red-600"
            />
          </section>

          <TransactionsList
            transactions={transactions}
            isLoading={isLoading}
            page={transactionsResponse?.page ?? page}
            totalPages={transactionsResponse?.totalPages ?? 1}
            onPreviousPage={() => setPage((currentPage) => currentPage - 1)}
            onNextPage={() => setPage((currentPage) => currentPage + 1)}
            onCreateTransaction={() => setIsCreateTransactionModalOpen(true)}
          />
        </div>
      </main>

      <CreateTransactionModal
        isOpen={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        categories={categories}
        onTransactionCreated={mutate}
      />
    </>
  );
}
