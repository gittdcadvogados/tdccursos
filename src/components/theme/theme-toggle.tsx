"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

function readTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const t = window.localStorage.getItem("theme");
  if (t === "dark" || t === "light") return t;
  return "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    window.localStorage.removeItem("theme");
  } else {
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }
}

// Resolve qual tema o navegador está mostrando agora (considerando OS).
function resolveActive(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // Sincroniza após mount (evita mismatch SSR/CSR)
  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  function cycle() {
    // light → dark → system → light
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    applyTheme(next);
  }

  // Placeholder estático antes da hidratação
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Alternar tema"
        className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-foreground-muted"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const active = resolveActive(theme);
  const Icon = theme === "system" ? Monitor : active === "dark" ? Moon : Sun;
  const label =
    theme === "system"
      ? "Tema: sistema (clique pra trocar)"
      : theme === "dark"
        ? "Tema: escuro (clique pra trocar)"
        : "Tema: claro (clique pra trocar)";

  return (
    <button
      type="button"
      onClick={cycle}
      title={label}
      aria-label={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-foreground-muted transition hover:border-accent/40 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
