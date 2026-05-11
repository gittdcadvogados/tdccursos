import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Dúvidas — TDC CURSOS",
};

export default function DuvidasPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dúvidas
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Perguntas e respostas
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Envie dúvidas sobre as aulas e veja respostas do professor e da
          comunidade.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
        <MessagesSquare className="mx-auto h-10 w-10 text-foreground-muted" />
        <h2 className="mt-4 text-lg font-semibold tracking-tight">
          Em construção
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground-muted">
          Em breve você poderá registrar perguntas vinculadas a cada aula e
          acompanhar respostas.
        </p>
      </div>
    </div>
  );
}
