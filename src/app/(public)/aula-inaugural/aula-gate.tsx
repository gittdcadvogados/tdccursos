"use client";

import { useActionState, useEffect } from "react";
import { Lock, Mail, User as UserIcon, PlayCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockAulaInaugural, type UnlockResult } from "./actions";

type Props = {
  /** Source para tracking (pode vir de utm_source da URL no server, opcional). */
  source?: string | null;
};

export function AulaGate({ source }: Props) {
  const [state, formAction, pending] = useActionState<UnlockResult | null, FormData>(
    unlockAulaInaugural,
    null,
  );

  // Quando a action retorna ok, recarrega a página pra o server component
  // re-renderizar reconhecendo o cookie e mostrar o conteúdo destravado.
  useEffect(() => {
    if (state?.ok) {
      window.location.reload();
    }
  }, [state]);

  return (
    <div className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-border bg-surface">
      {/* topo do card */}
      <div className="border-b border-border bg-surface-muted px-6 py-3">
        <div className="flex items-center gap-2 text-xs">
          <Lock className="h-3.5 w-3.5 text-accent" />
          <span className="tech-mono uppercase tracking-wider text-foreground-muted">
            AULA_INAUGURAL · ACESSO_RESTRITO
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-5 p-6 md:p-8">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">
            Desbloqueie a aula gratuita
          </h2>
          <p className="text-sm text-foreground-muted">
            25 minutos com o Rafael Vieira sobre a Reforma Tributária aplicada
            ao transporte rodoviário. Informe seu nome e email para liberar.
          </p>
        </div>

        <input type="hidden" name="source" value={source ?? ""} />

        <div className="space-y-2">
          <Label htmlFor="name" className="tech-mono text-xs uppercase tracking-wider">
            ▸ NOME_COMPLETO
          </Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder="Como posso te chamar?"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="tech-mono text-xs uppercase tracking-wider">
            ▸ EMAIL_PROFISSIONAL
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="voce@escritorio.com.br"
              className="pl-9"
            />
          </div>
        </div>

        {state && !state.ok && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" />
              Liberando...
            </>
          ) : (
            <>
              <PlayCircle />
              Desbloquear aula gratuita
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-foreground-muted">
          Usamos seu email só pra avisar de novidades do curso. Sem spam, com{" "}
          <a
            href="/politica-privacidade"
            className="underline underline-offset-2 hover:text-foreground"
          >
            política de privacidade
          </a>
          .
        </p>
      </form>
    </div>
  );
}
