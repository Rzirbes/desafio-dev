"use client";

import { FormField } from "@/components/ui/FormField";
import { authService } from "@/services/auth/authService";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await authService.authenticate({
        email,
        password,
      });

      toast.success("Login realizado com sucesso!");

      console.log(response);

      // futuramente:
      // router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl bg-background p-8 shadow"
      >
        <h1 className="mb-2 text-2xl font-bold text-foreground">Login</h1>

        <p className="mb-6 text-sm text-foreground-secondary">
          Acesse sua conta para gerenciar suas finanças.
        </p>

        <div className="space-y-4">
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

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
