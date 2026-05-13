"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Calendar,
  Cog,
  Home,
  MessagesSquare,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const primary: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/curso", label: "Meu curso", icon: BookOpen },
  { href: "/calendario", label: "Encontros ao vivo", icon: Calendar },
  { href: "/oficinas", label: "Oficinas", icon: Wrench },
  { href: "/duvidas", label: "Dúvidas", icon: MessagesSquare },
  { href: "/certificado", label: "Certificado", icon: Award },
];

const secondary: NavItem[] = [
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Cog },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { href, label, icon: Icon } = item;
  const active =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-accent-soft text-accent-soft-fg"
          : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent"
        />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition",
          active
            ? "text-accent"
            : "text-foreground-muted group-hover:text-foreground",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div>
      <span className="tech-mono mb-2 block px-3 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
        ▸ {title}
      </span>
      <div className="flex flex-col gap-0.5">
        {items.map((it) => (
          <NavLink key={it.href} item={it} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 md:block">
      <div className="sticky top-20 rounded-xl border border-border bg-surface p-4">
        <nav className="flex flex-col gap-6">
          <NavSection
            title="ÁREA_DO_ALUNO"
            items={primary}
            pathname={pathname}
          />
          <NavSection title="CONTA" items={secondary} pathname={pathname} />
        </nav>

        {/* Card promocional — vibe Acadia mas em tema TDC */}
        <div className="mt-6 overflow-hidden rounded-lg border border-accent/30 bg-accent-soft p-4">
          <div className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
            ▸ AULA_GRATUITA
          </div>
          <p className="mt-2 text-sm font-medium leading-snug text-foreground">
            Compartilhe a aula inaugural com colegas
          </p>
          <Link
            href="/aula-inaugural"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover"
          >
            Ver aula →
          </Link>
        </div>
      </div>
    </aside>
  );
}
