import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Aula Inaugural Gratuita — TDC CURSOS",
  description:
    "Aula aberta ao público: por que esse curso, por que agora — o Regulamento IBS/CBS e o transporte rodoviário.",
};

export default function AulaInauguralPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Aula gratuita · 25 minutos
        </span>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Por que esse curso, por que agora
        </h1>
        <p className="mt-4 text-pretty text-foreground-muted md:text-lg">
          O Regulamento IBS/CBS e o transporte rodoviário — uma introdução ao
          que muda, ao que urge e ao que ainda dá tempo de planejar.
        </p>
      </header>

      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-border bg-surface-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-foreground-muted" />
            <p className="mt-3 text-sm text-foreground-muted">
              Player de vídeo (placeholder · Bunny Stream)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <Link href="/cadastro" className={buttonVariants({ size: "lg" })}>
          Inscrever-se no curso completo
          <ArrowRight />
        </Link>
        <Link
          href="/sobre"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Ver conteúdo completo
        </Link>
      </div>
    </div>
  );
}
