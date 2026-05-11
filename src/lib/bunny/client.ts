// Cliente do Bunny Stream — usado em server components / server actions.
// Doc: https://docs.bunny.net/reference/stream-api
//
// Duas funções principais:
//  - signEmbedUrl(libraryId, videoGuid, expiresInSeconds): gera URL assinada do iframe
//  - createVideo(libraryId, title): cria um placeholder de vídeo (para upload posterior)
//
// O Token Authentication do Bunny Stream funciona assim:
//   token = sha256_hex(TokenAuthenticationKey + videoGuid + expirationUnix)
//   url = https://iframe.mediadelivery.net/embed/{libraryId}/{videoGuid}?token={token}&expires={expirationUnix}
// Quando ativado no painel da Library, embeds sem token válido retornam 403.

import { createHash } from "node:crypto";

const STREAM_API_URL = "https://video.bunnycdn.com";
const IFRAME_BASE = "https://iframe.mediadelivery.net";

function libraryId(): string {
  const id = process.env.BUNNY_STREAM_LIBRARY_ID;
  if (!id) throw new Error("BUNNY_STREAM_LIBRARY_ID não configurada");
  return id;
}

function apiKey(): string {
  const key = process.env.BUNNY_STREAM_API_KEY;
  if (!key) throw new Error("BUNNY_STREAM_API_KEY não configurada");
  return key;
}

function tokenAuthKey(): string {
  const key = process.env.BUNNY_STREAM_TOKEN_AUTH_KEY;
  if (!key) throw new Error("BUNNY_STREAM_TOKEN_AUTH_KEY não configurada");
  return key;
}

// =========================
// Token-signed embed URL
// =========================
export type SignedEmbed = {
  src: string;
  expiresAt: number; // unix seconds
};

export function signEmbedUrl(
  videoGuid: string,
  expiresInSeconds = 6 * 60 * 60, // 6h default
  opts: { libraryIdOverride?: string; autoplay?: boolean } = {},
): SignedEmbed {
  const libId = opts.libraryIdOverride ?? libraryId();
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const token = createHash("sha256")
    .update(tokenAuthKey() + videoGuid + expires)
    .digest("hex");

  const qs = new URLSearchParams({
    token,
    expires: String(expires),
    autoplay: opts.autoplay ? "true" : "false",
    preload: "true",
  });

  return {
    src: `${IFRAME_BASE}/embed/${libId}/${videoGuid}?${qs.toString()}`,
    expiresAt: expires,
  };
}

// =========================
// Stream API — administração (usar em scripts/admin, não no fluxo do aluno)
// =========================
type BunnyErrorBody = { Message?: string; ErrorKey?: string };

async function streamRequest<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`${STREAM_API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      AccessKey: apiKey(),
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (init.body as BodyInit | undefined),
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as BunnyErrorBody;
      detail = body.Message ?? "";
    } catch {
      // sem JSON
    }
    throw new Error(`Bunny ${res.status} em ${path}${detail ? `: ${detail}` : ""}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type BunnyVideo = {
  guid: string;
  title: string;
  length: number; // segundos
  status: number; // 0=created, 1=uploaded, 2=processing, 3=transcoding, 4=finished, 5=error, 6=upload_failed
  thumbnailFileName: string;
  views: number;
  isPublic: boolean;
  encodeProgress: number;
};

export async function createVideo(title: string): Promise<BunnyVideo> {
  return await streamRequest<BunnyVideo>(`/library/${libraryId()}/videos`, {
    method: "POST",
    json: { title },
  });
}

export async function getVideo(videoGuid: string): Promise<BunnyVideo> {
  return await streamRequest<BunnyVideo>(
    `/library/${libraryId()}/videos/${videoGuid}`,
  );
}

export async function listVideos(opts: { page?: number; itemsPerPage?: number } = {}) {
  const qs = new URLSearchParams({
    page: String(opts.page ?? 1),
    itemsPerPage: String(opts.itemsPerPage ?? 100),
  });
  return await streamRequest<{
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    items: BunnyVideo[];
  }>(`/library/${libraryId()}/videos?${qs.toString()}`);
}
