// Aviso de site em construção / template. Fica acima do SiteHeader (não-sticky):
// rola junto com a página e o header continua fixo no topo. Remover quando o
// site sair de fase de desenvolvimento.
export function ConstructionBanner() {
  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-2 text-center">
        <span
          aria-hidden
          className="tech-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
        />
        <span className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          ▸ Ambiente_demo
        </span>
        <span aria-hidden className="hidden text-amber-500/40 sm:inline">
          ·
        </span>
        <span className="text-xs text-amber-700 dark:text-amber-300">
          Site em desenvolvimento, conteúdo template
        </span>
      </div>
    </div>
  );
}
