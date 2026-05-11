import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — TDC CURSOS",
};

export default function TermosPage() {
  return (
    <article className="prose prose-zinc mx-auto max-w-3xl px-6 py-16 dark:prose-invert md:py-20">
      <h1>Termos de Uso</h1>
      <p className="lead text-foreground-muted">
        Última atualização: maio de 2026.
      </p>
      <p>
        Esta página é um placeholder. Os termos finais serão elaborados pelo
        jurídico da TDC Advogados antes da publicação.
      </p>
    </article>
  );
}
