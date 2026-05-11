import { signInWithGoogle } from "@/app/(auth)/actions";
import { GoogleLogo } from "@/components/svg/google-logo";

export function GoogleSignInButton({
  next = "/dashboard",
  label = "Continuar com Google",
}: {
  next?: string;
  label?: string;
}) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <GoogleLogo className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
