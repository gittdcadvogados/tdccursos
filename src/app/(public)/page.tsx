import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/landing-hero";
import { LandingStats } from "@/components/dashboard/stat-grid";
import { ModulesOverview } from "@/components/course/modules-overview";
import { InstructorBio } from "@/components/instructor/instructor-bio";
import { FaqSection } from "@/components/faq/faq-section";
import { FinalCta } from "@/components/cta/final-cta";

export const metadata: Metadata = {
  title:
    "Tributação do Transporte Rodoviário na Reforma Tributária — TDC CURSOS",
  description:
    "Curso completo sobre IBS, CBS, ICMS e a transição da Reforma Tributária aplicada ao setor de transporte rodoviário. Com Rafael Vieira, fiscal de tributos estaduais.",
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingStats />
      <ModulesOverview />
      <InstructorBio />
      <FaqSection />
      <FinalCta />
    </>
  );
}
