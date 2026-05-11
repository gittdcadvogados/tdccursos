import { cn } from "@/lib/utils";

type Pattern = "grid-fade" | "grid-tight" | "dots" | "none";

interface TechBackdropProps {
  pattern?: Pattern;
  glow?: "center" | "top" | "bottom" | "corners" | "none";
  scan?: boolean;
  className?: string;
}

const patternClass: Record<Pattern, string> = {
  "grid-fade": "bg-grid-fade",
  "grid-tight": "bg-grid-tight",
  dots: "bg-dots",
  none: "",
};

export function TechBackdrop({
  pattern = "grid-fade",
  glow = "center",
  scan = false,
  className,
}: TechBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {pattern !== "none" && (
        <div
          className={cn("absolute inset-0 text-border", patternClass[pattern])}
        />
      )}

      {glow === "center" && (
        <div className="glow-emerald absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2" />
      )}
      {glow === "top" && (
        <div className="glow-emerald absolute left-1/2 -top-32 h-[480px] w-[480px] -translate-x-1/2" />
      )}
      {glow === "bottom" && (
        <div className="glow-emerald absolute left-1/2 -bottom-32 h-[480px] w-[480px] -translate-x-1/2" />
      )}
      {glow === "corners" && (
        <>
          <div className="glow-emerald absolute -left-24 -top-24 h-80 w-80" />
          <div className="glow-emerald absolute -right-24 -bottom-24 h-80 w-80" />
        </>
      )}

      {scan && <div className="bg-scan absolute inset-0 opacity-60" />}
    </div>
  );
}
