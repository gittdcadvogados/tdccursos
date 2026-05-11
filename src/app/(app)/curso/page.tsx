import type { Metadata } from "next";
import { ModulesOverview } from "@/components/course/modules-overview";

export const metadata: Metadata = {
  title: "Meu curso — TDC CURSOS",
};

export default function CursoPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Meu curso
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Tributação do Transporte Rodoviário na Reforma Tributária
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Acompanhe os módulos, acesse aulas e marque seu progresso.
        </p>
      </header>
      <ModulesOverview />
    </div>
  );
}
