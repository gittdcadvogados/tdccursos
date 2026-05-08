import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-muted",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-accent transition-all duration-500 [width:var(--progress)]"
        style={{ "--progress": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}
