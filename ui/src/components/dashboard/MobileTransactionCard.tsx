import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Transaction } from "@/types/transaction";

type MobileTransactionCardProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function MobileTransactionCard({
  transaction,
  onEdit,
  onDelete,
}: MobileTransactionCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const isIncome = transaction.type === "INCOME";

  return (
    <div className="relative w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-black">
            {transaction.description}
          </h3>

          {transaction.category && (
            <span className="mt-1 block truncate text-sm text-foreground-secondary">
              {transaction.category.name}
            </span>
          )}

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              isIncome
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isIncome ? "Receita" : "Despesa"}
          </span>
        </div>

        <div className="flex shrink-0 items-start gap-1">
          <div className="text-right">
            <span
              className={`block text-base font-bold ${
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

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-foreground-secondary transition-colors hover:bg-slate-200 hover:text-black"
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-border bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(transaction);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-black hover:bg-slate-100"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(transaction);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
