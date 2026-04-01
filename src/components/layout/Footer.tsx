import Link from "next/link";
import { Terminal } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Content",
    links: [
      { href: "/models", label: "Models" },
      { href: "/workflows", label: "Workflows" },
      { href: "/tooling", label: "Tooling" },
      { href: "/notes", label: "Notes" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Gradient border top */}
      <div className="gradient-divider" />

      {/* Subtle background fade */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, var(--color-bg-page), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          {/* Brand column */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
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
                className="font-display text-sm font-semibold transition-colors text-fg-secondary"
              >
                field notes / ai
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
              Developer field notes on working with AI — what actually worked,
              what broke, and what I&apos;d do differently. Updated as tools change.
            </p>

            <p
              className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-fg-secondary"
            >
              The ground is shifting.
              <br />
              <span className="text-fg-muted">Stay calibrated.</span>
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
                      className="text-sm transition-colors text-fg-muted"
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
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-8 sm:flex-row sm:items-center border-border-subtle"
          
        >
          <p className="font-mono text-xs text-border-strong">
            © {new Date().getFullYear()} AI Field Notes
          </p>
          <p className="font-mono text-xs text-border-strong">
            Built with Next.js · Tailwind · MDX
          </p>
        </div>
      </div>
    </footer>
  );
}
