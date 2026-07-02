"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <p className="text-sm font-medium text-foreground-secondary">
          Bem-vindo, <span className="text-foreground">{user?.name}</span>
        </p>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background-secondary text-sm font-semibold text-foreground transition-colors hover:bg-border"
            aria-label="Abrir menu do usuário"
          >
            {userInitial}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 z-10 w-40 rounded-xl border border-border bg-background p-1 shadow-lg">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
