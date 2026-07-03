import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types/transaction";
import { MoreVertical } from "lucide-react";

type TransactionsListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onCreateTransaction: () => void;
};

export function TransactionsList({
  transactions,
  isLoading,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
  onCreateTransaction,
}: TransactionsListProps) {
  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Transações</h2>

          <p className="mt-1 text-sm text-foreground-secondary">
            Acompanhe suas receitas e despesas cadastradas.
          </p>
        </div>

        <Button onClick={onCreateTransaction}>Nova transação</Button>
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
          <div className="mt-8 grid gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="
    rounded-2xl
    border border-black/10
    bg-slate-50
    px-5
    py-4
    transition-all
    hover:shadow-md
  "
              >
                <div className="flex items-center justify-between">
                  {/* Esquerda */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      {transaction.description}
                    </h3>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        transaction.type === "INCOME"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "Receita" : "Despesa"}
                    </span>
                  </div>

                  {/* Centro */}
                  <div className="flex flex-1 flex-col items-center">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>

                    <span className="mt-1 text-sm text-foreground-secondary">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {/* Direita */}
                  <button
                    className="
        rounded-lg
        p-2
        text-foreground-secondary
        transition-colors
        hover:bg-slate-200
        hover:text-foreground
      "
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-foreground-secondary">
              Página {page} de {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={page <= 1}
                onClick={onPreviousPage}
              >
                Anterior
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={onNextPage}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
