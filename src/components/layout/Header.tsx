import Link from "next/link";
import { Terminal } from "lucide-react";

const NAV_LINKS = [
  { href: "/models", label: "Models" },
  { href: "/workflows", label: "Workflows" },
  { href: "/tooling", label: "Tooling" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold text-zinc-100 hover:text-white transition-colors"
        >
          <Terminal className="h-4 w-4 text-blue-400" />
          <span>field notes</span>
          <span className="text-zinc-500">/</span>
          <span className="text-blue-400">ai</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
