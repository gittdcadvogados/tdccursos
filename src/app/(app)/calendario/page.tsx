import type { Metadata } from "next";
import { Radio, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Encontros ao vivo — TDC CURSOS",
};

type LiveSessionRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  duration_minutes: number;
  zoom_url: string | null;
  recording_url: string | null;
  position: number;
  modules: { slug: string; title: string; position: number } | null;
};

const DATE_FMT = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: "America/Sao_Paulo",
});

const TIME_FMT = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return DATE_FMT.format(d).replace(".", "").replace(",", " ·");
}

function formatTime(iso: string) {
  return TIME_FMT.format(new Date(iso));
}

type SessionStatus = "past" | "live" | "upcoming";

function getStatus(iso: string, durationMin: number): SessionStatus {
  const now = Date.now();
  const start = new Date(iso).getTime();
  const end = start + durationMin * 60_000;
  if (now < start) return "upcoming";
  if (now <= end) return "live";
  return "past";
}

export default async function CalendarioPage() {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("live_sessions")
    .select(
      "id, slug, title, description, starts_at, duration_minutes, zoom_url, recording_url, position, modules(slug, title, position)",
    )
    .order("starts_at", { ascending: true })
    .returns<LiveSessionRow[]>();

  const list = sessions ?? [];

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
          {list.length > 0
            ? `${list.length} sessões de tira-dúvidas conduzidas pelo professor — gravadas e disponibilizadas após cada encontro.`
            : "Aguarde a liberação do calendário oficial."}
        </p>
      </header>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground-muted">
          Nenhuma sessão ao vivo programada.
        </div>
      ) : (
        <section className="space-y-3">
          {list.map((s) => {
            const status = getStatus(s.starts_at, s.duration_minutes);
            const moduleLabel = s.modules
              ? `Módulo ${String(s.modules.position).padStart(2, "0")}`
              : "Final";

            return (
              <Card key={s.id} className="p-5">
                <CardContent className="flex flex-col gap-4 p-0 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        status === "live"
                          ? "grid h-9 w-9 place-items-center rounded-lg bg-red-500/15 text-red-500"
                          : status === "past"
                            ? "grid h-9 w-9 place-items-center rounded-lg bg-surface-muted text-foreground-muted"
                            : "grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg"
                      }
                    >
                      {status === "past" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Radio className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                        <span>{moduleLabel}</span>
                        {status === "live" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-500">
                            <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
                            ao vivo agora
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="tech-mono mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-foreground-muted">
                        <Clock className="h-3 w-3" />
                        {formatDate(s.starts_at)} · {formatTime(s.starts_at)}
                      </div>
                    </div>
                  </div>

                  {status === "past" && s.recording_url ? (
                    <a
                      href={s.recording_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
                    >
                      Ver gravação
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : status === "past" ? (
                    <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted">
                      Gravação em breve
                    </span>
                  ) : s.zoom_url ? (
                    <a
                      href={s.zoom_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-soft-fg transition hover:bg-accent hover:text-white"
                    >
                      Entrar na sala
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted">
                      Link em breve
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
