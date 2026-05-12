import type { NextRequest } from "next/server";

// Atrás de reverse proxy (Coolify/Traefik), `request.url` retorna a URL
// INTERNA do container (http://localhost:3000/...). Os headers
// x-forwarded-host + x-forwarded-proto trazem a URL externa real.
// Use isso pra montar redirects que precisam apontar pro domínio do user.
export function getPublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`;
  }
  const host = request.headers.get("host");
  if (host) {
    return `${forwardedProto ?? "http"}://${host}`;
  }
  return new URL(request.url).origin;
}
