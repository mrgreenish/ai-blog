import Link from "next/link";
import { Terminal } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Content",
    links: [
      { href: "/models", label: "Models" },
      { href: "/workflows", label: "Workflows" },
      { href: "/tooling", label: "Tooling" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Gradient border top */}
      <div className="gradient-divider" />

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand column */}
          <div className="sm:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 transition-colors group-hover:border-blue-400/40 group-hover:bg-blue-500/15">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span className="font-display text-sm font-semibold text-zinc-400 transition-colors group-hover:text-zinc-200">
                field notes / ai
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
              Developer field notes on working with AI — what actually worked,
              what broke, and what I&apos;d do differently. Updated as tools change.
            </p>

            <p className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-zinc-700">
              The ground is shifting.
              <br />
              <span className="text-zinc-600">Stay calibrated.</span>
            </p>
          </div>

          {/* Nav columns */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="section-label mb-4">{section.label}</p>
              <ul className="space-y-2.5">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-zinc-900 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-zinc-700">
            © {new Date().getFullYear()} AI Field Notes
          </p>
          <p className="font-mono text-xs text-zinc-700">
            Built with Next.js · Tailwind · MDX
          </p>
        </div>
      </div>
    </footer>
  );
}
