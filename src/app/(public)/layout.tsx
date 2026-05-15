import { SiteHeader } from "@/components/header/site-header";
import { SiteFooter } from "@/components/footer/site-footer";
import { ConstructionBanner } from "@/components/banner/construction-banner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ConstructionBanner />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
