import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Oficinas práticas — TDC CURSOS",
};

const workshops = [
  {
    n: 1,
    title: "Preenchimento do CT-e",
    summary:
      "Casos principais — subcontratação, redespacho, exportação. Campo a campo em casos reais.",
    duration: "45 min",
  },
  {
    n: 2,
    title: "CT-e OS e cenários de subcontratação",
    summary:
      "CT-e Outras Saídas — preenchimento detalhado em cenários reais de subcontratação de transporte.",
    duration: "45 min",
  },
];

export default function OficinasPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Oficinas práticas
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Aplicação prática — preenchimento de documentos fiscais
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Atividades gravadas do Módulo 6, com casos reais campo a campo.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {workshops.map((w) => (
          <Card key={w.n} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                  <Wrench className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted">
                  {w.duration}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Oficina {w.n} — {w.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">{w.summary}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
