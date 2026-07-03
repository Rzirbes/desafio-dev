"use client";

import { Select } from "@/components/ui/Select";
import { Category } from "@/types/category";

type TransactionsFiltersProps = {
  month: number;
  year: number;
  categoryId: string;
  categories: Category[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onCategoryChange: (categoryId: string) => void;
};

const months = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function TransactionsFilters({
  month,
  year,
  categoryId,
  categories,
  onMonthChange,
  onYearChange,
  onCategoryChange,
}: TransactionsFiltersProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 5 }, (_, index) => ({
    value: String(currentYear - index),
    label: String(currentYear - index),
  }));

  const categoryOptions = [
    { value: "all", label: "Todas" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Mês
          </label>

          <Select
            value={String(month)}
            onValueChange={(value) => onMonthChange(Number(value))}
            options={months}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Ano
          </label>

          <Select
            value={String(year)}
            onValueChange={(value) => onYearChange(Number(value))}
            options={years}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Categoria
          </label>

          <Select
            value={categoryId}
            onValueChange={onCategoryChange}
            options={categoryOptions}
          />
        </div>
      </div>
    </section>
  );
}
