import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — TDC CURSOS",
};

export default function PoliticaPrivacidadePage() {
  return (
    <article className="prose prose-zinc mx-auto max-w-3xl px-6 py-16 dark:prose-invert md:py-20">
      <h1>Política de Privacidade</h1>
      <p className="lead text-foreground-muted">
        Última atualização: maio de 2026.
      </p>
      <p>
        Esta página é um placeholder. O texto definitivo será elaborado em
        conformidade com a LGPD (Lei 13.709/2018) e revisado pelo jurídico da
        TDC Advogados antes da publicação.
      </p>
    </article>
  );
}
