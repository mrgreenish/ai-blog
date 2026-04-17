"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-page border-b border-border-default">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-sans text-sm font-semibold text-fg-primary tracking-tight"
        >
          AI Field Notes
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#contents"
            className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors"
          >
            Contents
          </Link>
          <Link
            href="/chapters/what-is-happening"
            className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors"
          >
            What&apos;s Happening
          </Link>
          <Link
            href="/search"
            className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
