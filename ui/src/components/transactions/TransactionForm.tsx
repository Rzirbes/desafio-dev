"use client";

import { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Category } from "@/types/category";
import { TransactionType } from "@/types/transaction";

type TransactionFormProps = {
  description: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  date: Date;
  categories: Category[];
  isLoading: boolean;
  submitLabel: string;
  loadingLabel: string;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onTypeChange: (value: TransactionType) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onCreateCategory: () => void;
};

export function TransactionForm({
  description,
  amount,
  type,
  categoryId,
  date,
  categories,
  isLoading,
  submitLabel,
  loadingLabel,
  onDescriptionChange,
  onAmountChange,
  onTypeChange,
  onCategoryChange,
  onDateChange,
  onSubmit,
  onCancel,
  onCreateCategory,
}: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Descrição"
        type="text"
        placeholder="Ex: Mercado"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        required
      />

      <FormField
        label="Valor"
        type="number"
        placeholder="Ex: 150.00"
        value={amount}
        onChange={(event) => onAmountChange(event.target.value)}
        required
      />

      <div className="space-y-1">
        <Label>Tipo</Label>

        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as TransactionType)}
          placeholder="Selecione o tipo"
          options={[
            { value: "INCOME", label: "Entrada" },
            { value: "EXPENSE", label: "Saída" },
          ]}
        />
      </div>

      <div className="space-y-1">
        <Label>Categoria</Label>

        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              value={categoryId}
              onValueChange={onCategoryChange}
              placeholder={
                categories.length > 0
                  ? "Selecione uma categoria"
                  : "Nenhuma categoria encontrada"
              }
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-auto px-4"
            onClick={onCreateCategory}
          >
            Editar Categorias
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Data</Label>

        <DatePicker selected={date} onChange={onDateChange} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? loadingLabel : submitLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
