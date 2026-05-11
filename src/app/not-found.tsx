import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Erro 404
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground-muted">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Voltar para a home
          </Link>
          <Link
            href="/contato"
            className={buttonVariants({ variant: "secondary" })}
          >
            Falar com a gente
          </Link>
        </div>
      </div>
    </main>
  );
}
