import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Recuperar senha — TDC CURSOS",
};

export default async function RecuperarSenhaPage(
  props: PageProps<"/recuperar-senha">,
) {
  const sp = await props.searchParams;
  const error = typeof sp?.error === "string" ? sp.error : undefined;
  const message = typeof sp?.message === "string" ? sp.message : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <p className="text-sm text-foreground-muted">
          Informe seu e-mail e enviaremos um link para redefinir a senha.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {message && (
          <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent-soft-fg">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form action={requestPasswordReset} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail cadastrado</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@exemplo.com"
            />
          </div>

          <Button type="submit" className="w-full">
            Enviar link de recuperação
            <ArrowRight />
          </Button>
        </form>

        <p className="pt-2 text-center text-sm">
          <Link href="/login" className="text-accent hover:underline">
            Voltar para entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
