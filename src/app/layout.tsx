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
        <div className="mx-auto flex w-full max-w-shell flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
