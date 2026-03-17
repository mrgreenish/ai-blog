import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolingCTAProps {
  compact?: boolean;
}

export function ToolingCTA({ compact = false }: ToolingCTAProps) {
  return (
    <div
      className={`not-prose relative overflow-hidden rounded-2xl my-10 ${compact ? "p-6" : "p-10"}`}
       className="bg-bg-surface border border-border-default"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-600/[0.05] via-transparent to-blue-600/[0.03]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-40 w-80 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-accent-violet">
            What&apos;s next
          </p>
          <h3 className="font-display text-2xl font-bold tracking-tight text-fg-primary">
            Now set up your environment
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-secondary">
            The workflows only work well with the right tools behind them. Tooling covers Claude Code, Codex, Figma MCP, and the agent setup that makes it all click.
          </p>
        </div>

        <Link
          href="/tooling"
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-[background-color,box-shadow,transform] hover:bg-violet-400 hover:shadow-violet-400/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          Explore Tooling
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
