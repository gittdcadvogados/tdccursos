import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// =========================
// Content-Security-Policy
// Política montada para o stack atual:
// - Supabase (REST + Realtime WSS) → connect-src
// - Bunny Stream player → frame-src iframe.mediadelivery.net + media/img *.b-cdn.net
// - Google OAuth avatars → img-src lh3.googleusercontent.com
// - Vídeo do hero (self-hospedado) → media-src 'self'
// Em dev, libera ws/http localhost p/ o HMR do Next não quebrar.
// =========================
const cspDirectives = [
  "default-src 'self'",
  // Next 16 injeta scripts inline (hydration, ThemeScript). 'unsafe-eval' fica
  // p/ libs como apexcharts. Para tightenar depois, migrar p/ CSP com nonce.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.supabase.co https://*.b-cdn.net https://lh3.googleusercontent.com`,
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${
    isDev ? " ws://localhost:* http://localhost:*" : ""
  }`,
  "frame-src 'self' https://iframe.mediadelivery.net",
  "media-src 'self' blob: https://*.b-cdn.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Equivalente a X-Frame-Options: DENY (CSP moderna). Mantém XFO também
  // p/ navegadores legados.
  "frame-ancestors 'none'",
  // Em prod, força HTTP→HTTPS em qualquer request residual (mixed content).
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  // 1 ano + subdomínios + elegível p/ preload list do Chrome
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Bloqueia o site de ser carregado dentro de iframe (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Browser respeita o Content-Type do servidor; não tenta adivinhar
  // executável a partir do conteúdo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não vaza URL completa em navegações cross-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensíveis que o site não usa. 'payment=(self)' fica liberado
  // p/ Payment Request API caso a gente venha a usar.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["54.232.189.113", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        // Aplica em todas as rotas
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
