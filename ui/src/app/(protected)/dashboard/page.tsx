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
import { TransactionsFilters } from "@/components/dashboard/TransactionsFilters";

export default function DashboardPage() {
  const { accessToken } = useAuth();

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: categories = [] } = useSWR(
    accessToken ? "/categories" : null,
    () => categoriesService.list(accessToken!),
  );

  const {
    data: transactionsResponse,
    isLoading,
    mutate,
  } = useSWR(
    accessToken ? ["/transactions", page, limit, month, year] : null,
    () =>
      transactionsService.list(accessToken!, {
        page,
        limit,
        month,
        year,
      }),
  );

  const transactions = transactionsResponse?.transactions ?? [];

  const summary = transactionsResponse?.summary ?? {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
  };

  function handleMonthChange(month: number) {
    setMonth(month);
    setPage(1);
  }

  function handleYearChange(year: number) {
    setYear(year);
    setPage(1);
  }

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
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />

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
