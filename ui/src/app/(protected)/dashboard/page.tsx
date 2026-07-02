import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background-secondary px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground-secondary">
            Bem-vindo
          </p>

          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

          <p className="max-w-2xl text-sm text-foreground-secondary">
            Acompanhe suas finanças, receitas, despesas e categorias em um só
            lugar.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-foreground-secondary">Saldo atual</p>
            <strong className="mt-2 block text-2xl text-foreground">
              R$ 0,00
            </strong>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-foreground-secondary">Receitas</p>
            <strong className="mt-2 block text-2xl text-green-600">
              R$ 0,00
            </strong>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-foreground-secondary">Despesas</p>
            <strong className="mt-2 block text-2xl text-red-600">
              R$ 0,00
            </strong>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Transações
              </h2>

              <p className="mt-1 text-sm text-foreground-secondary">
                Comece cadastrando suas primeiras receitas ou despesas.
              </p>
            </div>

            <Button href="/transactions/new">Nova transação</Button>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-foreground-secondary">
              Nenhuma transação cadastrada ainda.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
