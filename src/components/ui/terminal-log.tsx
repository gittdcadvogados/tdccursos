type LogLine = { tag: string; text: string };

const LINES: LogLine[] = [
  { tag: "2026", text: "ano-teste — IBS/CBS em alíquota reduzida" },
  { tag: "2027", text: "CBS cheia · PIS/COFINS extintos" },
  { tag: "2028", text: "IBS mantém alíquota de teste" },
  { tag: "2029", text: "ICMS/ISS iniciam redução escalonada" },
  { tag: "2030–32", text: "IBS sobe · ICMS/ISS recuam ano a ano" },
  { tag: "2033", text: "ICMS e ISS extintos — sistema pleno" },
];

type Props = {
  /** Override de linhas — útil em outros pontos da landing. */
  lines?: LogLine[];
  /** Rótulo do header (path do shell). */
  shellLabel?: string;
};

export function TerminalLog({
  lines = LINES,
  shellLabel = "~/transição_2026–2033 — sh",
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
