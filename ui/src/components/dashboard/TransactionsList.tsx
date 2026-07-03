import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types/transaction";

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
                  <tr key={transaction._id} className="border-t border-border">
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
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-4 py-3 text-foreground-secondary">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
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
