import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>field notes / ai</span>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/models", label: "Models" },
              { href: "/workflows", label: "Workflows" },
              { href: "/tooling", label: "Tooling" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-xs text-zinc-600">
          Developer field notes — what actually worked, what broke, and what I&apos;d do
          differently. Updated as tools change.
        </p>
      </div>
    </footer>
  );
}
