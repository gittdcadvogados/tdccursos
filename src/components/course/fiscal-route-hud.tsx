const ROUTE_D =
  "M 60 200 C 160 200, 160 130, 260 130 C 360 130, 380 200, 480 200 C 580 200, 600 130, 700 130 C 800 130, 840 200, 940 200";

type Stop = { x: number; y: number; label: string; caption: string };

const STOPS: Stop[] = [
  { x: 60, y: 200, label: "REGRA", caption: "Constituição" },
  { x: 260, y: 130, label: "TRANSPORTE", caption: "Operações" },
  { x: 480, y: 200, label: "CRÉDITOS", caption: "Aproveitamento" },
  { x: 700, y: 130, label: "OBRIGAÇÕES", caption: "NFe · CT-e" },
  { x: 940, y: 200, label: "CAIXA", caption: "Resultado" },
];

export function FiscalRouteHud() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70">
      {/* Header HUD */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-muted/40 px-4 py-2 md:px-5">
        <div className="tech-mono flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="tech-pulse absolute inset-0 rounded-full bg-accent" />
            <span className="absolute inset-0 rounded-full bg-accent/60" />
          </span>
          MAPA_FISCAL · v2.6
        </div>
        <div className="tech-mono flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
          <span className="tech-pulse rounded-sm border border-accent/40 bg-accent-soft px-1.5 py-0.5 text-accent-soft-fg">
            LIVE
          </span>
          <span className="hidden opacity-60 sm:inline">
            IBS · CBS · NFe · CT-e
          </span>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative w-full overflow-hidden bg-surface">
        <div
          aria-hidden
          className="bg-grid-tight absolute inset-0 text-border opacity-40"
        />
        <div
          aria-hidden
          className="glow-emerald absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 opacity-40"
        />

        <svg
          viewBox="0 0 1000 300"
          className="relative block h-auto w-full"
          aria-hidden="true"
        >
          {/* Rail estático */}
          <path
            id="fiscal-route"
            d={ROUTE_D}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Dashes em fluxo */}
          <path
            d={ROUTE_D}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 10"
            className="route-flow"
            opacity="0.85"
          />

          {/* Pins dropper (label flutuando → stem → marcador na rota) */}
          {STOPS.map((s) => (
            <g key={s.label}>
              {/* Label */}
              <text
                x={s.x}
                y={s.y - 38}
                textAnchor="middle"
                className="tech-mono"
                fontSize="12"
                fontWeight="700"
                fill="var(--accent)"
                letterSpacing="0.5"
              >
                {s.label}
              </text>
              {/* Caption */}
              <text
                x={s.x}
                y={s.y - 28}
                textAnchor="middle"
                className="tech-mono"
                fontSize="7"
                fill="var(--foreground-muted)"
                letterSpacing="0.4"
                opacity="0.75"
              >
                {s.caption}
              </text>
              {/* Stem */}
              <line
                x1={s.x}
                y1={s.y - 24}
                x2={s.x}
                y2={s.y - 10}
                stroke="var(--accent)"
                strokeWidth="0.8"
                opacity="0.55"
              />
              {/* Glow halo no pin */}
              <circle
                cx={s.x}
                cy={s.y - 4}
                r="7"
                fill="var(--accent)"
                opacity="0.16"
              />
              {/* Pin teardrop (ponta na rota em s.y) */}
              <path
                d={`M ${s.x} ${s.y} L ${s.x - 3.5} ${s.y - 8} A 3.5 3.5 0 1 1 ${s.x + 3.5} ${s.y - 8} Z`}
                fill="var(--accent)"
              />
              {/* Furo do pin */}
              <circle
                cx={s.x}
                cy={s.y - 6}
                r="1.4"
                fill="var(--background)"
              />
            </g>
          ))}

          {/* Caminhão em movimento (silhueta side-view, loop SMIL) */}
          <g>
            {/* Halo */}
            <circle r="14" fill="var(--accent)" opacity="0.18" />
            {/* Trailer */}
            <rect
              x="-13"
              y="-7"
              width="16"
              height="12"
              rx="1"
              fill="var(--accent)"
            />
            {/* Faixa superior (highlight 3D) */}
            <rect
              x="-13"
              y="-7"
              width="16"
              height="1.5"
              fill="var(--background)"
              opacity="0.35"
            />
            {/* Cabine */}
            <path
              d="M 3 -3 L 9 -3 L 11 0 L 11 5 L 3 5 Z"
              fill="var(--accent)"
            />
            {/* Janela */}
            <rect
              x="5"
              y="-1.5"
              width="3"
              height="2.5"
              fill="var(--background)"
              opacity="0.65"
            />
            {/* Rodas */}
            <circle
              cx="-8"
              cy="6.5"
              r="1.8"
              fill="var(--background)"
              stroke="var(--accent)"
              strokeWidth="0.8"
            />
            <circle
              cx="-1"
              cy="6.5"
              r="1.8"
              fill="var(--background)"
              stroke="var(--accent)"
              strokeWidth="0.8"
            />
            <circle
              cx="8"
              cy="6.5"
              r="1.6"
              fill="var(--background)"
              stroke="var(--accent)"
              strokeWidth="0.8"
            />
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              rotate="auto"
              path={ROUTE_D}
            />
          </g>

          {/* Brackets de canto (HUD frame) */}
          <g
            stroke="var(--accent)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.45"
          >
            <path d="M 12 12 L 30 12 M 12 12 L 12 30" />
            <path d="M 988 12 L 970 12 M 988 12 L 988 30" />
            <path d="M 12 288 L 30 288 M 12 288 L 12 270" />
            <path d="M 988 288 L 970 288 M 988 288 L 988 270" />
          </g>
        </svg>
      </div>

      {/* Footer ticker */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-muted/40 px-4 py-2 md:px-5">
        <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
          ▸ COMPLIANCE_OK
        </span>
        <span className="tech-mono hidden text-[10px] font-semibold uppercase tracking-wider text-foreground-muted opacity-70 sm:inline">
          07_MÓDULOS · 59_AULAS · ~25H_CONTEÚDO
        </span>
        <span className="tech-mono inline text-[10px] font-semibold uppercase tracking-wider text-foreground-muted opacity-70 sm:hidden">
          07_MÓD · ~25H
        </span>
      </div>
    </div>
  );
}
