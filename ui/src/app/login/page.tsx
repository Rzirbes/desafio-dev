"use client";

import { authService } from "@/services/auth/authService";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await authService.authenticate({
      email,
      password,
    });

    console.log(response);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Login</h1>

        <p className="mb-6 text-sm text-slate-500">
          Acesse sua conta para gerenciar suas finanças.
        </p>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
