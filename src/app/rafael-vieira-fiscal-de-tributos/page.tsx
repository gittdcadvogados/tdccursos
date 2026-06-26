import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  GraduationCap,
  MapPin,
  PlayCircle,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

export const metadata: Metadata = {
  title: "Rafael Vieira — Fiscal de Tributos · SEFAZ-MT Licenciado",
  description:
    "Fiscal de Tributos · SEFAZ-MT Licenciado. Reforma Tributária aplicada ao transporte rodoviário — IBS, CBS e transição 2026–2033. Cuiabá / MT.",
  robots: { index: true, follow: true },
};

/* ───────────────────────────────────────────────────────────────────────────
 * Edite aqui os links externos. Os internos (curso, aula, sobre) já apontam
 * pras páginas do site. Coloque os perfis reais antes de publicar no bio.
 * ─────────────────────────────────────────────────────────────────────────── */
const SOCIAL = {
  whatsapp:
    "https://wa.me/5565000000000?text=Ol%C3%A1%2C%20Rafael%21%20Vim%20pelo%20Instagram.",
  linkedin: "https://www.linkedin.com/in/rafael-bacana/",
};

type LinkCard = {
  href: string;
  external?: boolean;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
};

const links: LinkCard[] = [
  {
    href: "/",
    title: "Curso · Reforma Tributária no Transporte",
    subtitle: "IBS · CBS · ICMS · LC 214/2025",
    icon: GraduationCap,
    primary: true,
  },
  {
    href: "/aula-inaugural",
    title: "Aula inaugural gratuita",
    subtitle: "Entenda a transição 2026–2033 em 40 min",
    icon: PlayCircle,
  },
  {
    href: "/sobre",
    title: "Sobre o curso",
    subtitle: "Programa, módulos e quem é pra você",
    icon: ShieldCheck,
  },
  {
    href: SOCIAL.whatsapp,
    external: true,
    title: "WhatsApp direto",
    subtitle: "Dúvidas sobre inscrição e turmas",
    icon: WhatsAppIcon,
  },
  {
    href: SOCIAL.linkedin,
    external: true,
    title: "LinkedIn — Rafael Vieira",
    subtitle: "Trajetória profissional",
    icon: LinkedInIcon,
  },
];

export default function RafaelLinkInBioPage() {
  return (
    <div className="dark-zone relative isolate min-h-dvh overflow-hidden bg-zinc-950 text-zinc-50">
      <TechBackdrop pattern="grid-fade" glow="top" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-5 pt-8 pb-12">
        {/* status bar tech/terminal */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="tech-mono inline-flex items-center gap-2">
            <span className="tech-pulse inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            ONLINE
          </span>
          <span className="tech-mono">BIO_LINK · v1</span>
        </div>

        {/* identidade */}
        <header className="mt-8 flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden
              className="glow-emerald absolute inset-0 -z-10 h-full w-full"
            />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-accent/70 bg-zinc-900 ring-4 ring-zinc-950">
              <Image
                src="/IMG/rafael-vieira.jpg"
                alt="Rafael Vieira"
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>
            <span
              aria-hidden
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-zinc-950 bg-accent text-zinc-950"
            >
              <Scale className="h-3.5 w-3.5" />
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Rafael Vieira
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Fiscal de Tributos
          </p>
          <p className="tech-mono mt-0.5 text-[11px] uppercase tracking-[0.16em] text-accent">
            SEFAZ-MT · LICENCIADO
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs text-zinc-300">Cuiabá / MT</span>
          </div>

          <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-zinc-400">
            Reforma Tributária aplicada ao{" "}
            <span className="text-zinc-100">transporte rodoviário</span>. IBS,
            CBS e a transição 2026–2033 com base na LC 214/2025.
          </p>
        </header>

        {/* label terminal */}
        <div className="mt-10 flex items-center gap-2 text-xs text-accent">
          <span>▸</span>
          <span className="tech-mono font-semibold uppercase tracking-[0.18em]">
            LINKS_RAPIDOS
          </span>
          <span className="ml-2 h-px flex-1 bg-zinc-800" />
        </div>

        {/* lista de cards */}
        <nav aria-label="Links de Rafael Vieira" className="mt-4 space-y-3">
          {links.map((link) => (
            <LinkRow key={link.title} {...link} />
          ))}
        </nav>

        {/* rodapé */}
        <footer className="mt-10 flex flex-col items-center gap-2 text-center">
          <span className="tech-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            © {new Date().getFullYear()} — Cuiabá / MT
          </span>
        </footer>
      </div>
    </div>
  );
}

function LinkRow({
  href,
  external,
  title,
  subtitle,
  icon: Icon,
  primary,
}: LinkCard) {
  const baseClass = primary
    ? "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-accent/40 bg-accent/10 p-4 transition-all hover:border-accent hover:bg-accent/15 active:scale-[0.99]"
    : "group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur transition-all hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.99]";

  const content = (
    <>
      {primary && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl"
        />
      )}
      <span
        className={
          primary
            ? "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent text-zinc-950"
            : "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-zinc-800 text-zinc-100"
        }
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <div
          className={
            primary
              ? "truncate text-sm font-semibold text-zinc-50"
              : "truncate text-sm font-semibold text-zinc-100"
          }
        >
          {title}
        </div>
        <div className="truncate text-xs text-zinc-400">{subtitle}</div>
      </div>
      <ArrowUpRight
        className={
          primary
            ? "h-4 w-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            : "h-4 w-4 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        }
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={baseClass}>
      {content}
    </Link>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
