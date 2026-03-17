"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/models", label: "Models" },
  { href: "/workflows", label: "Workflows" },
  { href: "/tooling", label: "Tooling" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-4 pb-0">
      <div className="w-full max-w-5xl">
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3 shadow-lg backdrop-blur-xl bg-bg-overlay border border-border-default"
          style={{boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)"}}
        >
          <Link
            href="/"
            className="group flex items-center gap-2 shrink-0"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
              style={{
                border: "1px solid rgba(37, 99, 235, 0.30)",
                background: "rgba(37, 99, 235, 0.10)",
              }}
            >
              <Terminal className="h-3.5 w-3.5 text-accent-blue" />
            </div>
            <span
              className="font-display text-sm font-semibold tracking-tight transition-colors text-fg-primary"
            >
              field notes
            </span>
            <span className="font-mono text-xs text-fg-muted">/</span>
            <span
              className="font-display text-sm font-semibold tracking-tight transition-colors text-accent-blue"
            >
              ai
            </span>
          </Link>

          <form
            action="/search"
            method="get"
            className="flex flex-1 min-w-0 max-w-xs items-center gap-2 rounded-lg px-3 py-1.5 transition-all bg-bg-input border border-border-default"
            
            onFocus={(e) => {
              const el = e.currentTarget as HTMLFormElement;
              el.style.borderColor = "var(--color-border-strong)";
              el.style.background = "var(--color-bg-input-focus)";
            }}
            onBlur={(e) => {
              const el = e.currentTarget as HTMLFormElement;
              el.style.borderColor = "var(--color-border-default)";
              el.style.background = "var(--color-bg-input)";
            }}
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-fg-muted" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search articles..."
              className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none text-fg-primary"
              aria-label="Search articles"
            />
          </form>

          <nav className="flex items-center gap-1 shrink-0">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all"
                  style={{
                    background: isActive ? "var(--color-bg-active)" : "transparent",
                    color: isActive ? "var(--color-fg-primary)" : "var(--color-fg-secondary)",
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ background: "var(--color-accent-blue)", opacity: 0.8 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
