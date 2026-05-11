import type { Metadata } from "next";
import { Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificado — TDC CURSOS",
};

export default function CertificadoPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Certificado
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Certificado de conclusão
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Disponível ao concluir todas as videoaulas, oficinas e encontros ao
          vivo.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
        <Award className="mx-auto h-10 w-10 text-foreground-muted" />
        <h2 className="mt-4 text-lg font-semibold tracking-tight">
          Continue avançando
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground-muted">
          Quando você concluir 100% do conteúdo, o certificado digital com a
          carga horária total será gerado automaticamente aqui.
        </p>
      </div>
    </div>
  );
}
