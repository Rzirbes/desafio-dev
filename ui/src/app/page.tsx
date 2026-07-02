import Image from "next/image";
import Link from "next/link";

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-lg font-bold text-primary-foreground transition hover:bg-primary-hover"
        >
          ACESSAR SISTEMA
        </Link>

        <Link
          href="/instructions"
          className="rounded-lg border border-primary px-6 py-3 text-lg font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          VER INSTRUÇÕES
        </Link>
      </div>
    </main>
  );
}
