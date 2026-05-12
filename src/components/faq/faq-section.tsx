"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Para quem é esse curso?",
    a: "Profissionais que atuam direta ou indiretamente com transporte rodoviário: contadores e advogados tributaristas que atendem transportadoras, equipes fiscais e financeiras de empresas de transporte de cargas e passageiros, e gestores que precisam tomar decisões estratégicas na transição.",
  },
  {
    q: "Preciso ter conhecimento prévio sobre IBS e CBS?",
    a: "Não. O Módulo 1 cobre os fundamentos da nova tributação do consumo desde a CF/88, garantindo que todos partam de uma base sólida antes dos módulos específicos de transporte.",
  },
  {
    q: "Como funcionam os encontros ao vivo?",
    a: "São 7 sessões ao vivo, uma ao final de cada módulo, com tira-dúvidas conduzido pelo professor. Todos os encontros são gravados e ficam disponíveis na plataforma para quem não puder participar em tempo real.",
  },
  {
    q: "Por quanto tempo terei acesso?",
    a: "O acesso ao conteúdo gravado e aos encontros é vitalício a partir da inscrição, incluindo atualizações futuras durante o período da transição (2026–2033).",
  },
  {
    q: "O conteúdo é atualizado conforme novos regulamentos?",
    a: "Sim. A transição vai gerar novos atos normativos, ajustes do Comitê Gestor e decisões dos tribunais. As aulas afetadas são revisadas e novas aulas são publicadas no mesmo acesso vitalício, sem custo adicional.",
  },
  {
    q: "Posso pagar com CNPJ e receber nota fiscal?",
    a: "Sim. A inscrição pode ser feita em nome da pessoa jurídica, com emissão de nota fiscal pela TDC Advogados (Cuiabá / MT) e pagamento por boleto, cartão ou Pix.",
  },
  {
    q: "Há certificado de conclusão?",
    a: "Sim. Ao completar todas as aulas, oficinas e encontros, você recebe certificado digital com a carga horária total do curso (aproximadamente 31h).",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-24">
      <header className="max-w-3xl text-center md:text-left">
        <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span>▸</span>
          DÚVIDAS_FREQUENTES
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Perguntas comuns antes da inscrição
        </h2>
      </header>

      <div className="mt-10 space-y-3 max-w-3xl">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface-muted"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium md:text-base">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-foreground-muted transition",
                    isOpen && "rotate-180 text-accent",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-foreground-muted">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
