import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Recuperar senha — TDC CURSOS",
};

export default function RecuperarSenhaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground-muted">
          Em breve: informe seu e-mail e receba um link para redefinir a senha.
        </p>
        <p className="text-center text-sm">
          <Link href="/login" className="text-accent hover:underline">
            Voltar para entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
