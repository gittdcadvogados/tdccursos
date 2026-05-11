import Image from "next/image";
import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProfileTabs } from "@/components/form/profile-tabs";
import { AvatarUpload } from "@/components/form/avatar-upload";
import { TechBackdrop } from "@/components/ui/tech-backdrop";
import { changePassword, updateProfile } from "./actions";

export const metadata: Metadata = {
  title: "Perfil — TDC CURSOS",
};

function initials(name: string | null | undefined, email: string) {
  const source = (name?.trim() || email).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function PerfilPage(props: PageProps<"/perfil">) {
  const sp = await props.searchParams;
  const tab = sp?.tab === "senha" ? "senha" : "perfil";
  const error = typeof sp?.error === "string" ? sp.error : undefined;
  const message = typeof sp?.message === "string" ? sp.message : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, display_name, avatar_url, phone, occupation, bio, created_at, role",
    )
    .eq("id", user!.id)
    .maybeSingle();

  const isOAuth = !!user!.app_metadata?.provider && user!.app_metadata.provider !== "email";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header>
        <span className="tech-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          ▸ CONFIGURACOES
        </span>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Gerencie suas informações pessoais e credenciais.
        </p>
      </header>

      <ProfileTabs />

      {message && (
        <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent-soft-fg">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {tab === "perfil" ? (
        <>
          {/* Cover + avatar */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="relative h-40 md:h-44">
              <TechBackdrop pattern="grid-tight" glow="corners" />
            </div>
            <div className="absolute left-6 top-40 z-10 -translate-y-1/2 md:top-44">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || user!.email!}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-24 w-24 rounded-2xl border-4 border-surface object-cover shadow-md md:h-28 md:w-28"
                />
              ) : (
                <div
                  aria-hidden
                  className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-surface bg-accent-soft text-2xl font-semibold tracking-tight text-accent-soft-fg shadow-md md:h-28 md:w-28 md:text-3xl"
                >
                  {initials(profile?.full_name, user!.email!)}
                </div>
              )}
            </div>
            <div className="px-6 pb-6 pt-16 md:pt-20 md:pl-44">
              <h2 className="text-lg font-semibold tracking-tight">
                {profile?.display_name ||
                  profile?.full_name ||
                  user!.email}
              </h2>
              <p className="tech-mono mt-1 text-xs text-foreground-muted">
                <span className="text-accent">▸</span> {user!.email}
                {isOAuth && (
                  <span className="ml-2 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] uppercase tracking-wider">
                    via {user!.app_metadata?.provider}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Formulário Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
              <p className="text-sm text-foreground-muted">
                Atualize seu nome, contato e bio.
              </p>
            </CardHeader>
            <CardContent>
              <form action={updateProfile} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Nome completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      defaultValue={profile?.full_name ?? ""}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="display_name">Exibir nome publicamente como</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      type="text"
                      defaultValue={profile?.display_name ?? ""}
                      placeholder="Como deve aparecer no fórum"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user!.email ?? ""}
                      disabled
                      readOnly
                      className="opacity-60"
                    />
                    <p className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                      ▸ vinculado_ao_login · não_editável
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone ?? ""}
                      placeholder="(65) 9 0000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="occupation">Ocupação</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    type="text"
                    defaultValue={profile?.occupation ?? ""}
                    placeholder="Advogado tributarista, contador, gestor fiscal..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Sobre mim</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={profile?.bio ?? ""}
                    placeholder="Conte um pouco sobre sua atuação e o que busca no curso (opcional)."
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                  <Button type="submit">
                    <Save />
                    Salvar alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Foto de perfil — upload via Supabase Storage */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de perfil</CardTitle>
              <p className="text-sm text-foreground-muted">
                Sua foto aparece no banner do dashboard, no header e em
                eventuais comentários e dúvidas.
              </p>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentUrl={profile?.avatar_url ?? null}
                fallbackInitials={initials(profile?.full_name, user!.email!)}
                isOAuth={isOAuth}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        // Tab Senha
        <Card>
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
            <p className="text-sm text-foreground-muted">
              {isOAuth
                ? "Sua conta entra via Google — não há senha local. Defina abaixo se quiser ativar login por e-mail."
                : "Informe sua senha atual e a nova senha."}
            </p>
          </CardHeader>
          <CardContent>
            <form action={changePassword} className="space-y-4">
              {!isOAuth && (
                <div className="space-y-1.5">
                  <Label htmlFor="current_password">Senha atual</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="new_password">Nova senha</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Confirmar nova senha</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="submit">
                  <Save />
                  Definir nova senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
