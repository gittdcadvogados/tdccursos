import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { AppNav } from "@/components/sidebar/app-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function initials(name: string | null | undefined, email: string) {
  const source = (name?.trim() || email).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const display =
    profile?.display_name?.trim() ||
    profile?.full_name?.trim() ||
    user.email!;
  const userInitials = initials(profile?.full_name, user.email!);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <Link href="/dashboard" className="group">
            <Logo className="transition-opacity group-hover:opacity-80" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/perfil"
              className="hidden items-center gap-2 rounded-full transition hover:opacity-80 sm:flex"
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={display}
                  width={32}
                  height={32}
                  unoptimized
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-accent/20"
                />
              ) : (
                <span
                  className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-soft-fg ring-1 ring-accent/20"
                  aria-hidden
                >
                  {userInitials}
                </span>
              )}
              <span className="text-sm text-foreground-muted">{display}</span>
            </Link>

            <ThemeToggle />

            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                <LogOut />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-content gap-8 px-4 py-8 md:px-6">
        <AppNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
