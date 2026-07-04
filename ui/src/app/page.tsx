import Image from "next/image";

import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-secondary">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <Image
          src="/logo.png"
          alt="Profissionais SA"
          width={120}
          height={120}
          className="mb-8"
          priority
        />

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Profissionais SA
        </h1>

        <p className="mt-3 max-w-sm text-base leading-relaxed text-foreground-secondary">
          Desafio Técnico Nível Pleno
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row">
          <Button href="/login" className="flex-1">
            ACESSAR SISTEMA
          </Button>

          <Button href="/instructions" variant="outline" className="flex-1">
            VER INSTRUÇÕES
          </Button>
        </div>
      </div>
    </main>
  );
}
