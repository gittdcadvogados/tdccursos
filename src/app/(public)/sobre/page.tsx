import type { Metadata } from "next";
import { ModulesOverview } from "@/components/course/modules-overview";
import { InstructorBio } from "@/components/instructor/instructor-bio";
import { LandingStats } from "@/components/dashboard/stat-grid";
import { DecisoesCriticas } from "@/components/course/decisoes-criticas";

export const metadata: Metadata = {
  title: "Sobre o curso — TDC CURSOS",
};

export default function SobrePage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Sobre o curso
        </span>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Tributação do Transporte Rodoviário na Reforma Tributária
        </h1>
        <p className="mt-4 text-pretty text-foreground-muted md:text-lg">
          Versão 2 — maio de 2026. Curso completo sobre IBS, CBS, ICMS e a
          transição (2026–2033) aplicada ao transporte rodoviário de cargas e
          passageiros.
        </p>
      </section>
      <LandingStats />
      <ModulesOverview />
      <DecisoesCriticas />
      <InstructorBio />
    </>
  );
}
