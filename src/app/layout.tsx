import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeScript } from "@/components/theme/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "TDC CURSOS — Reforma Tributária no Transporte Rodoviário",
    template: "%s",
  },
  description:
    "Plataforma de cursos da TDC Advogados — IBS, CBS, ICMS e a transição da Reforma Tributária aplicada ao transporte rodoviário.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Sem max-w global: cada seção decide o próprio container
            (max-w-content nos blocos internos). Backgrounds full-bleed
            agora se estendem em monitores ultrawide. */}
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
