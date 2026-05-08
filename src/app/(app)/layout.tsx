import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

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
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const display = profile?.full_name?.trim() || user.email!;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/dashboard" className="group">
            <Logo className="transition-opacity group-hover:opacity-80" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span
                className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-soft-fg ring-1 ring-accent/20"
                aria-hidden
              >
                {initials(profile?.full_name, user.email!)}
              </span>
              <span className="text-sm text-foreground-muted">{display}</span>
            </div>

            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                <LogOut />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
