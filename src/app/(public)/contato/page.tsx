import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato — TDC CURSOS",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Fale com a gente
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Contato
        </h1>
        <p className="mt-4 text-foreground-muted md:text-lg">
          Tirar dúvidas sobre inscrição, conteúdo ou condições para grupos —
          escreva pra gente.
        </p>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <ContactItem
          icon={Mail}
          label="E-mail"
          value="contato@tdcadvogados.com.br"
        />
        <ContactItem icon={Phone} label="Telefone" value="(65) 0000-0000" />
        <ContactItem icon={MapPin} label="Endereço" value="Cuiabá / MT" />
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-sm text-foreground-muted">
          Formulário de contato (placeholder — integração com react-hook-form e
          envio por e-mail será adicionada em seguida).
        </p>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
