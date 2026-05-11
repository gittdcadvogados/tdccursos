"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const COOKIE_NAME = "tdc_aula_inaugural_unlocked";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 dias

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type UnlockResult =
  | { ok: true }
  | { ok: false; error: string };

export async function unlockAulaInaugural(
  _prev: UnlockResult | null,
  formData: FormData,
): Promise<UnlockResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "").trim() || null;

  if (name.length < 2) {
    return { ok: false, error: "Informe seu nome completo." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Email inválido." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return {
      ok: false,
      error: "Configuração do servidor incompleta. Tente novamente em instantes.",
    };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") ?? null;
  const forwardedFor = hdrs.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || null;

  const { error } = await supabase.from("aula_inaugural_leads").upsert(
    {
      name,
      email,
      source,
      user_agent: userAgent,
      ip,
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("[aula-inaugural] upsert lead falhou:", error);
    return {
      ok: false,
      error: "Não consegui registrar agora. Tenta de novo em alguns segundos.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    httpOnly: false, // o client lê pra esconder o gate sem reload
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { ok: true };
}

export async function isAulaInauguralUnlocked(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "1";
}
