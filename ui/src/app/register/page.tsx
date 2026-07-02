"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { authService } from "@/services/auth/authService";
import { toast } from "sonner";
import { useState } from "react";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
        role,
      });

      setName("");
      setEmail("");
      setPassword("");

      setIsRegistered(true);

      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o cadastro.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm rounded-2xl bg-background p-8 shadow"
      >
        <h1 className="mb-2 text-2xl font-bold text-foreground">Cadastro</h1>

        <p className="mb-6 text-sm text-foreground-secondary">
          Crie sua conta para começar a gerenciar suas finanças.
        </p>

        <div className="space-y-4">
          <FormField
            id="name"
            label="Nome"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />

          <FormField
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />

          <FormField
            id="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
          />
        </div>

        {/* <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Perfil
          </label>

          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-slate-900"
          >
            <option value="USER">Usuário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div> */}

        <Button type="submit" isLoading={isLoading} className="mt-6">
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>

        {isRegistered ? (
          <Button href="/login" variant="outline" className="mt-4">
            Ir para o login
          </Button>
        ) : (
          <p className="mt-4 text-center text-sm text-foreground-secondary">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
