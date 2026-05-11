import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { signUp } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/form/google-sign-in";

export default async function CadastroPage(props: PageProps<"/cadastro">) {
  const sp = await props.searchParams;
  const error = typeof sp?.error === "string" ? sp.error : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <p className="text-sm text-foreground-muted">
          Cadastre-se com Google ou seu e-mail.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <GoogleSignInButton label="Cadastrar com Google" />

        <div className="relative my-2 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="tech-mono px-3 text-[10px] uppercase tracking-wider text-foreground-muted">
            ou_com_email
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form action={signUp} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Nome completo</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
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

          <Button type="submit" className="w-full">
            Criar conta
            <ArrowRight />
          </Button>

          <p className="pt-1 text-center text-[11px] text-foreground-muted">
            Você receberá um e-mail para confirmar a conta antes de acessar.
          </p>
        </form>

        <p className="pt-2 text-center text-sm text-foreground-muted">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
