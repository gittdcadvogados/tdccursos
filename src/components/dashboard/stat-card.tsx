import { cn } from "@/lib/utils";

type Tone = "emerald" | "blue" | "amber" | "violet" | "rose" | "cyan";

const toneClasses: Record<Tone, string> = {
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-500",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "emerald",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition hover:border-accent/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
            ▸ {label}
          </div>
          <div className="tech-mono mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-foreground-muted">{hint}</div>
          )}
        </div>
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ring-current/10",
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
