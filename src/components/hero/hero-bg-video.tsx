"use client";

import { useEffect, useState } from "react";

type Props = {
  /** URL assinada (gerada server-side pelo `signEmbedUrl`). */
  src: string | null;
};

/**
 * Background de vídeo Bunny. Renderiza o iframe SOMENTE depois do hydrate
 * pra evitar qualquer chance de mismatch SSR/CSR no atributo `src` (que
 * carrega token + expiração).
 */
export function HeroBgVideo({ src }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!src || !mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-30 overflow-hidden bg-zinc-950"
    >
      <iframe
        src={src}
        title="Hero background video"
        allow="autoplay; encrypted-media; picture-in-picture"
        loading="eager"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
