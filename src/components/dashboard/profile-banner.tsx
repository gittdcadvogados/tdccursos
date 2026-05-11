import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface ProfileBannerProps {
  fullName: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
  progressDone: number;
  progressTotal: number;
}

export function ProfileBanner({
  fullName,
  email,
  initials,
  avatarUrl,
  progressDone,
  progressTotal,
}: ProfileBannerProps) {
  const progressPct =
    progressTotal > 0 ? Math.round((progressDone / progressTotal) * 100) : 0;

  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Cover */}
        <div className="relative h-44 md:h-52">
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-emerald-900 via-zinc-900 to-zinc-950"
          />
          <div
            aria-hidden
            className="bg-grid-tight absolute inset-0 text-white/10"
          />
          <div
            aria-hidden
            className="glow-emerald absolute -right-24 -top-24 h-72 w-72"
          />
          <div
            aria-hidden
            className="glow-emerald absolute -left-32 -bottom-32 h-80 w-80 opacity-60"
          />

          <div className="relative flex h-full items-end justify-end p-4 md:p-6">
            <Link
              href="/curso"
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Continuar curso
              <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Avatar — absolute, overlap 50% sobre o cover */}
        <div className="absolute left-6 top-44 z-10 -translate-y-1/2 md:top-52">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={112}
              height={112}
              unoptimized
              className="h-24 w-24 rounded-2xl border-4 border-surface object-cover shadow-md md:h-28 md:w-28"
            />
          ) : (
            <div
              aria-hidden
              className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-surface bg-accent-soft text-2xl font-semibold tracking-tight text-accent-soft-fg shadow-md md:h-28 md:w-28 md:text-3xl"
            >
              {initials}
            </div>
          )}
        </div>

        {/* Linha de identidade — espaço à esquerda pra metade do avatar que pendura */}
        <div className="flex flex-col gap-4 px-6 pb-6 pt-16 md:flex-row md:items-end md:justify-between md:pt-20 md:pl-44">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
              {fullName}
            </h1>
            <p className="tech-mono mt-1 truncate text-xs text-foreground-muted">
              <span className="text-accent">▸</span> {email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="tech-mono text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {progressDone}
                <span className="text-foreground-muted">/{progressTotal}</span>
              </div>
              <div className="text-[11px] text-foreground-muted">
                aulas concluídas
              </div>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-accent/20">
              <div
                className="progress-ring grid h-full w-full place-items-center rounded-full"
                style={
                  { "--progress": `${progressPct * 3.6}deg` } as React.CSSProperties
                }
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-[11px] font-semibold tabular-nums text-foreground">
                  {progressPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
