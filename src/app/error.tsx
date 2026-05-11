"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
          Erro inesperado
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Algo deu errado
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground-muted">
          Encontramos um problema ao carregar essa página. Tente novamente — se
          persistir, fale com a gente.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => reset()} className={buttonVariants()}>
            Tentar de novo
          </button>
          <a
            href="/"
            className={buttonVariants({ variant: "secondary" })}
          >
            Voltar para a home
          </a>
        </div>
      </div>
    </main>
  );
}
