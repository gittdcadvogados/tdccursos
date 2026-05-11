"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getOrigin() {
  const h = await headers();
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next || "/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  const origin = await getOrigin();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    redirect(`/cadastro?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Conta+criada.+Verifique+seu+e-mail+para+confirmar.");
}

export async function signInWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "/dashboard");
  const origin = await getOrigin();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) redirect(data.url);

  redirect("/login?error=Falha+ao+iniciar+login+com+Google");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Etapa 1 do reset: dispara email com link tipo
// `<supabase>/auth/v1/verify?token=...&type=recovery&redirect_to=<origin>/auth/confirm?next=/atualizar-senha`.
// Sempre retornamos sucesso (mesmo se o email não existir) para não vazar
// informação sobre quais emails têm conta — prática padrão.
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    redirect("/recuperar-senha?error=Informe+seu+e-mail.");
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/atualizar-senha`,
  });

  redirect(
    "/recuperar-senha?message=" +
      encodeURIComponent(
        "Se houver conta com esse e-mail, enviamos um link para redefinir a senha.",
      ),
  );
}

// Etapa 2 do reset: usuário já está autenticado via token de recovery
// (a sessão foi estabelecida em /auth/confirm). Aqui só atualizamos a senha.
export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirm") ?? "");

  if (password.length < 8) {
    redirect("/atualizar-senha?error=A+senha+precisa+ter+no+m%C3%ADnimo+8+caracteres.");
  }
  if (password !== confirm) {
    redirect("/atualizar-senha?error=As+senhas+n%C3%A3o+conferem.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/atualizar-senha?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
