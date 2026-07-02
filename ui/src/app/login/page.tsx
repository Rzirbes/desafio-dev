"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { authService } from "@/services/auth/authService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await authService.authenticate({
        email,
        password,
      });

      login(response.accessToken, response.user);

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login.",
      );
    } finally {
      setIsLoading(false);
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
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormField
            id="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-6">
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="mt-4 text-center text-sm text-foreground-secondary">
          Ainda não possui uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </main>
  );
}
