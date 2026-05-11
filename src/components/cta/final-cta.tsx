import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              A reforma já começou. Quem se preparar antes,{" "}
              <span className="text-accent">decide o frete de 2027</span>.
            </h2>
            <p className="mt-4 text-foreground-muted md:text-lg">
              Inscreva-se agora e tenha acesso vitalício às videoaulas, aos 7
              encontros ao vivo e às atualizações enquanto a transição
              acontece.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className={buttonVariants({ size: "lg" })}
              >
                Inscrever-se no curso
                <ArrowRight />
              </Link>
              <Link
                href="/aula-inaugural"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Antes, ver a aula gratuita
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
