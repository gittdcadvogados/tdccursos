import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/form/google-sign-in";

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const error = typeof sp?.error === "string" ? sp.error : undefined;
  const message = typeof sp?.message === "string" ? sp.message : undefined;
  const next = typeof sp?.next === "string" ? sp.next : "/dashboard";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar na plataforma</CardTitle>
        <p className="text-sm text-foreground-muted">
          Acesse com sua conta Google ou e-mail.
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

        <GoogleSignInButton next={next} label="Entrar com Google" />

        <div className="relative my-2 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="tech-mono px-3 text-[10px] uppercase tracking-wider text-foreground-muted">
            ou_com_email
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form action={signIn} className="space-y-4">
          <input type="hidden" name="next" value={next} />

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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/recuperar-senha"
                className="text-xs text-foreground-muted hover:text-accent"
              >
                Esqueceu?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
            <ArrowRight />
          </Button>
        </form>

        <p className="pt-2 text-center text-sm text-foreground-muted">
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
