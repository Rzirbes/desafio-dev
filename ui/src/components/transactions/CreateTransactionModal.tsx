"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Category } from "@/types/category";
import { Select } from "../ui/Select";
import { Label } from "../ui/Label";
import { CreateCategoryModal } from "../categories/CreateCategoryModal";
import { useAuth } from "@/hooks/useAuth";

type CreateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
};

export function CreateTransactionModal({
  isOpen,
  onClose,
  categories,
}: CreateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const { accessToken } = useAuth();

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log({
      description,
      amount: Number(amount),
      type,
      categoryId,
      date,
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Nova transação</h2>

            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Descrição"
              type="text"
              placeholder="Ex: Mercado"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <FormField
              label="Valor"
              type="number"
              placeholder="Ex: 150.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <div className="space-y-1">
              <Label>Tipo</Label>

              <Select
                value={type}
                onValueChange={setType}
                placeholder="Selecione o tipo"
                options={[
                  { value: "income", label: "Entrada" },
                  { value: "expense", label: "Saída" },
                ]}
              />
            </div>

            <div className="space-y-1">
              <Label>Categoria</Label>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
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
                  onClick={() => setIsCreateCategoryModalOpen(true)}
                >
                  Nova
                </Button>
              </div>
            </div>

            <FormField
              label="Data"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit">Cadastrar</Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        token={accessToken}
      />
    </>
  );
}
