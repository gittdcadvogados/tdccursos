import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/public-origin";

// Handler do redirect OAuth (Google, etc). Troca o `code` retornado
// pelo provedor por uma sessão ativa via cookies do Supabase SSR.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = getPublicOrigin(request);
  const code = searchParams.get("code");
  const errorDesc = searchParams.get("error_description");

  if (errorDesc) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDesc)}`,
    );
  }

  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Só permite redirect interno relativo
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Código de autenticação ausente.")}`,
  );
}
