import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/aula-inaugural", label: "Aula gratuita" },
  { href: "/sobre", label: "Sobre o curso" },
  { href: "/contato", label: "Contato" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-3">
        <Link href="/" aria-label="TDC CURSOS">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="text-sm text-foreground-muted transition hover:text-foreground"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ size: "sm" })}>
              Meu curso
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Entrar
              </Link>
              <Link href="/cadastro" className={buttonVariants({ size: "sm" })}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
