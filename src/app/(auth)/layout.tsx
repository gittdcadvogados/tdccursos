import { Logo } from "@/components/ui/logo";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <TechBackdrop pattern="grid-fade" glow="center" />

      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </main>
  );
}
