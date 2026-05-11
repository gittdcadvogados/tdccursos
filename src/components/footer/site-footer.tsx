import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-content gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-foreground-muted">
            Plataforma de cursos da TDC Advogados — formação aprofundada para
            profissionais do setor de transporte rodoviário diante da Reforma
            Tributária.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
            Curso
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/aula-inaugural" className="hover:text-accent">
                Aula gratuita
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:text-accent">
                Sobre o curso
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="hover:text-accent">
                Inscrever-se
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
            Legal
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/contato" className="hover:text-accent">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/politica-privacidade" className="hover:text-accent">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos" className="hover:text-accent">
                Termos de uso
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 text-xs text-foreground-muted">
          <span>© {year} TDC Advogados. Todos os direitos reservados.</span>
          <span className="hidden md:inline">
            CNPJ XX.XXX.XXX/0001-XX · Cuiabá / MT
          </span>
        </div>
      </div>
    </footer>
  );
}
