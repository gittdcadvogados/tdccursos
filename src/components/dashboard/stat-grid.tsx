import { BookOpen, Clock, Radio, Wrench } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "58", label: "Videoaulas gravadas" },
  { icon: Clock, value: "31h", label: "Carga horária total" },
  { icon: Radio, value: "07", label: "Encontros ao vivo" },
  { icon: Wrench, value: "02", label: "Oficinas práticas" },
];

export function LandingStats() {
  return (
    <section className="relative border-y border-border bg-surface">
      <div className="bg-grid-tight pointer-events-none absolute inset-0 text-border/40 opacity-40" />
      <div className="relative mx-auto grid max-w-content grid-cols-2 gap-px overflow-hidden rounded-none bg-border md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div
            key={label}
            className="bg-surface px-6 py-10 transition hover:bg-surface-muted md:px-8 md:py-12"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-4 w-4 text-accent" />
              <span className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                {String(i + 1).padStart(2, "0")} / {String(stats.length).padStart(2, "0")}
              </span>
            </div>
            <div className="tech-mono mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {value}
            </div>
            <div className="mt-1 text-xs text-foreground-muted md:text-sm">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
