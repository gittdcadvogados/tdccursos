type LogLine = { tag: string; text: string };

const LINES: LogLine[] = [
  { tag: "IBS", text: "initialized..." },
  { tag: "CBS", text: "mapping..." },
  { tag: "CT-e", text: "validation in progress" },
  { tag: "split_payment", text: "active" },
  { tag: "credit_flow", text: "synced." },
];

type Props = {
  /** Override de linhas — útil em outros pontos da landing. */
  lines?: LogLine[];
  /** Rótulo do header (path do shell). */
  shellLabel?: string;
};

export function TerminalLog({
  lines = LINES,
  shellLabel = "~/transição_2026 — sh",
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm">
      {/* Header janela */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted/60 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-foreground-muted/25" />
          <span className="h-2 w-2 rounded-full bg-foreground-muted/25" />
          <span className="tech-pulse h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
          {shellLabel}
        </span>
      </div>

      {/* Corpo */}
      <div className="tech-mono space-y-1 px-4 py-3 text-[12px] leading-relaxed md:text-[13px]">
        {lines.map((l, i) => (
          <p key={i} className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-accent">{">"}</span>
            <span className="text-foreground">{l.tag}</span>
            <span className="text-foreground-muted">{l.text}</span>
          </p>
        ))}
        <p className="flex items-center gap-1.5">
          <span className="text-accent">{">"}</span>
          <span
            aria-hidden
            className="tech-pulse inline-block h-3.5 w-1.5 bg-accent"
          />
        </p>
      </div>
    </div>
  );
}
