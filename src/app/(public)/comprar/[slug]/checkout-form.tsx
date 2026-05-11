"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkoutCourse, type CheckoutResult } from "./actions";

export function CheckoutForm({ courseSlug }: { courseSlug: string }) {
  const [state, formAction, pending] = useActionState<CheckoutResult, FormData>(
    checkoutCourse,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="course_slug" value={courseSlug} />

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome completo
        </label>
        <Input id="name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <p className="text-xs text-foreground-muted">
          Vamos usar esse email para liberar o acesso após a confirmação do
          pagamento.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="cpf_cnpj" className="text-sm font-medium text-foreground">
          CPF ou CNPJ
        </label>
        <Input
          id="cpf_cnpj"
          name="cpf_cnpj"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          required
          placeholder="Apenas números"
        />
        <p className="text-xs text-foreground-muted">
          CNPJ para emissão de nota fiscal no nome da empresa.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Telefone (opcional)
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(65) 9 9999-9999"
        />
      </div>

      {state && !state.ok && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 className="animate-spin" />
            Gerando cobrança…
          </>
        ) : (
          <>
            Continuar para pagamento
            <ArrowRight />
          </>
        )}
      </Button>

      <p className="tech-mono text-center text-[11px] text-foreground-muted">
        <span className="text-accent">▸</span> pagamento_seguro · Pix ·
        cartão_até_12x · boleto
      </p>
    </form>
  );
}
