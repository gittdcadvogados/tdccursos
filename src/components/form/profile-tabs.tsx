"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "perfil", label: "Perfil" },
  { key: "senha", label: "Senha" },
];

export function ProfileTabs() {
  const sp = useSearchParams();
  const active = sp.get("tab") === "senha" ? "senha" : "perfil";

  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 px-1">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <Link
              key={t.key}
              href={t.key === "perfil" ? "/perfil" : `/perfil?tab=${t.key}`}
              scroll={false}
              className={cn(
                "tech-mono relative px-4 py-3 text-xs font-semibold uppercase tracking-wider transition",
                isActive
                  ? "text-accent"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {t.label.toUpperCase()}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
