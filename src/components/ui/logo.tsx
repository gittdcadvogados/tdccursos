import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background"
      >
        <span className="text-[11px] font-bold tracking-tight">TDC</span>
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">
          Plataforma TDC
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-foreground-muted">
          Oratória · Advocacia
        </span>
      </div>
    </div>
  );
}
