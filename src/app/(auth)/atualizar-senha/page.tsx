import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { updatePassword } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Definir nova senha — TDC CURSOS",
};

export default async function AtualizarSenhaPage(
  props: PageProps<"/atualizar-senha">,
) {
  // O usuário só chega aqui depois de clicar no link de recovery do email
  // e ter passado por /auth/confirm — então DEVE ter sessão ativa.
  // Sem sessão, devolve pro login.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "Link expirado ou inválido. Solicite um novo email de recuperação.",
        ),
    );
  }

  const sp = await props.searchParams;
  const error = typeof sp?.error === "string" ? sp.error : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Definir nova senha</CardTitle>
        <p className="text-sm text-foreground-muted">
          Digite a nova senha para acessar a plataforma.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-xs text-accent-soft-fg">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Entrando como{" "}
            <strong className="font-medium">{user.email}</strong>
          </span>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password_confirm">Confirmar senha</Label>
            <Input
              id="password_confirm"
              name="password_confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Repita a nova senha"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar nova senha
            <ArrowRight />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
