"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg" aria-hidden="true" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all"
      style={{
        borderColor: "var(--color-border-default)",
        background: "var(--color-bg-input)",
        color: "var(--color-fg-secondary)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-hover)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-fg-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-input)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-default)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-fg-secondary)";
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
