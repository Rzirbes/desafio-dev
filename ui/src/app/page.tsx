import Image from "next/image";

import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background-secondary px-4 text-center">
      <Image
        src="/logo.png"
        alt="Profissionais SA"
        width={100}
        height={100}
        className="mb-6"
      />

      <h1 className="mb-4 text-4xl font-bold text-foreground">
        Profissionais SA
      </h1>

      <p className="mb-8 text-lg text-foreground-secondary">
        Desafio Técnico Nível Pleno
      </p>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <Button href="/login">ACESSAR SISTEMA</Button>

        <Button href="/instructions" variant="outline">
          VER INSTRUÇÕES
        </Button>
      </div>
    </main>
  );
}
