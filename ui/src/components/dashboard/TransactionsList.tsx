import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types/transaction";
import { TransactionCard } from "./TransactionCard";

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
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
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
          <div className="mt-8 grid min-w-0 gap-4">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
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
