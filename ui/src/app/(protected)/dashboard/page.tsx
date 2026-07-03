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

  const { data: transactionsResponse, isLoading } = useSWR(
    accessToken ? [`/transactions`, page, limit] : null,
    () => transactionsService.list(accessToken!, { page, limit }),
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

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Transações
                </h2>

                <p className="mt-1 text-sm text-foreground-secondary">
                  Acompanhe suas receitas e despesas cadastradas.
                </p>
              </div>

              <Button onClick={() => setIsCreateTransactionModalOpen(true)}>
                Nova transação
              </Button>
            </div>

            {isLoading && (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-foreground-secondary">
                  Carregando transações...
                </p>
              </div>
            )}

            {!isLoading && transactions.length === 0 && (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-foreground-secondary">
                  Nenhuma transação cadastrada ainda.
                </p>
              </div>
            )}

            {!isLoading && transactions.length > 0 && (
              <>
                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-background-secondary text-foreground-secondary">
                      <tr>
                        <th className="px-4 py-3 font-medium">Descrição</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Valor</th>
                        <th className="px-4 py-3 font-medium">Data</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction._id}
                          className="border-t border-border"
                        >
                          <td className="px-4 py-3 text-foreground-secondary">
                            {transaction.description}
                          </td>

                          <td className="px-4 py-3">
                            {transaction.type === "INCOME" ? (
                              <span className="text-green-600">Receita</span>
                            ) : (
                              <span className="text-red-600">Despesa</span>
                            )}
                          </td>

                          <td
                            className={`px-4 py-3 font-medium ${
                              transaction.type === "INCOME"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>

                          <td className="px-4 py-3 text-foreground-secondary">
                            {new Date(transaction.date).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-foreground-secondary">
                    Página {transactionsResponse?.page} de{" "}
                    {transactionsResponse?.totalPages}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={page <= 1}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Anterior
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={page >= (transactionsResponse?.totalPages ?? 1)}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <CreateTransactionModal
        isOpen={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        categories={categories}
      />
    </>
  );
}
