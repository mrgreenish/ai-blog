"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Search } from "lucide-react";

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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-zinc-950/80 px-5 py-3 shadow-lg shadow-black/20 backdrop-blur-xl">
          <Link
            href="/"
            className="group flex items-center gap-2 shrink-0"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
              <Terminal className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white">
              field notes
            </span>
            <span className="font-mono text-xs text-zinc-600">/</span>
            <span className="font-display text-sm font-semibold tracking-tight text-blue-400 transition-colors group-hover:text-blue-300">
              ai
            </span>
          </Link>

          <form action="/search" method="get" className="flex flex-1 min-w-0 max-w-xs items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 focus-within:border-white/16 focus-within:bg-white/6">
            <Search className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search articles..."
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
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
                  className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/8 text-zinc-100"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-linear-to-r from-transparent via-blue-400/60 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
