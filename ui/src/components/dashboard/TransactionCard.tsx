import { MoreVertical } from "lucide-react";

import { Transaction } from "@/types/transaction";

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const isIncome = transaction.type === "INCOME";

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-slate-50 px-5 py-4 transition-all hover:shadow-md">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-black">
            {transaction.description}
          </h3>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              isIncome
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isIncome ? "Receita" : "Despesa"}
          </span>
        </div>

        <div className="w-[120px] shrink-0 text-right">
          <span
            className={`block text-lg font-bold ${
              isIncome ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>

          <span className="mt-1 block text-sm text-foreground-secondary">
            {new Date(transaction.date).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-foreground-secondary transition-colors hover:bg-slate-200 hover:text-foreground"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
