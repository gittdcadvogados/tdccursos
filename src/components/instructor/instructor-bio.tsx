import { Award, GraduationCap, MapPin, Scale } from "lucide-react";

const credentials = [
  {
    icon: Scale,
    label: "Fiscal de tributos estaduais licenciado",
  },
  {
    icon: GraduationCap,
    label: "Especialista em Direito Tributário",
  },
  {
    icon: Award,
    label: "Foco em Reforma Tributária e setor de transporte rodoviário",
  },
  {
    icon: MapPin,
    label: "Base em Cuiabá / MT — atuação consultiva no Centro-Oeste",
  },
];

export function InstructorBio() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-content gap-10 px-6 py-20 md:grid-cols-[2fr_3fr] md:gap-16 md:py-24">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <div className="absolute inset-0 grid place-items-center text-foreground-muted">
            <span className="text-xs uppercase tracking-[0.16em]">
              Foto do professor
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-background/90 p-4 backdrop-blur">
            <div className="text-sm font-semibold">Rafael Vieira</div>
            <div className="text-xs text-foreground-muted">
              Professor titular do curso
            </div>
          </div>
        </div>

        <div>
          <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span>▸</span>
            QUEM_ENSINA
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Rafael Vieira
          </h2>
          <p className="mt-4 text-foreground-muted">
            Fiscal de tributos estaduais licenciado, com atuação direta na
            interpretação e aplicação da legislação do ICMS no Centro-Oeste.
            Une a experiência da fiscalização à prática consultiva, com foco
            em transportadoras e operações logísticas.
          </p>
          <p className="mt-3 text-foreground-muted">
            Construiu este curso a partir da LC 214/2025, do SINIEF 24/2024 e
            de pesquisas de campo com empresas do setor.
          </p>

          <ul className="mt-8 space-y-3">
            {credentials.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
