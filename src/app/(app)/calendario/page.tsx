import type { Metadata } from "next";
import { Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Encontros ao vivo — TDC CURSOS",
};

const sessions = [
  { module: "Módulo 1", title: "Tira-dúvidas — A Nova Tributação do Consumo" },
  { module: "Módulo 2", title: "Tira-dúvidas — IBS/CBS no Transporte de Cargas" },
  { module: "Módulo 3", title: "Tira-dúvidas — Transporte de Passageiros" },
  { module: "Módulo 4", title: "Tira-dúvidas — Gestão de Créditos" },
  { module: "Módulo 5", title: "Tira-dúvidas — ICMS na Transição" },
  { module: "Módulo 6", title: "Tira-dúvidas — Obrigações Acessórias" },
  { module: "Final", title: "Tira-dúvidas Final + Encerramento" },
];

export default function CalendarioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Encontros ao vivo
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Calendário das sessões
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          7 sessões de tira-dúvidas conduzidas pelo professor — gravadas e
          disponibilizadas após cada encontro.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground-muted">
        FullCalendar será integrado aqui (placeholder).
      </div>

      <section className="space-y-3">
        {sessions.map((s) => (
          <Card key={s.title} className="p-5">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                  <Radio className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                    {s.module}
                  </div>
                  <div className="text-sm font-medium">{s.title}</div>
                </div>
              </div>
              <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted">
                A definir
              </span>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
