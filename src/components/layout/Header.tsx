import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-page border-b border-border-default">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-sans text-sm font-semibold text-fg-primary tracking-tight"
        >
          AI Field Notes
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap justify-end gap-x-3 gap-y-1 sm:gap-x-6">
          <Link
            href="/guides"
            className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors"
          >
            Guides
          </Link>
          <Link href="/tools" className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors">Tools</Link>
          <Link
            href="/chapters/what-is-happening"
            className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg-primary transition-colors"
          >
            Updates
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
