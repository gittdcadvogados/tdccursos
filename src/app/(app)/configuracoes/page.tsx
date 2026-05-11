import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Configurações — TDC CURSOS",
};

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Configurações
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Preferências da conta
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            Em breve você poderá controlar avisos de novos módulos, lembretes
            de encontros ao vivo e e-mails da plataforma.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            Alteração de senha e e-mail (placeholder).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
