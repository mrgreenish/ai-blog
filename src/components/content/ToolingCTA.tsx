import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ToolingCTA() {
  return (
    <div className="not-prose relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-violet-950/40 via-zinc-900/60 to-blue-950/30 p-10 my-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-600/8 via-transparent to-blue-600/6" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-40 w-80 -translate-y-1/2 rounded-full bg-violet-500/8 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-violet-400">
            What&apos;s next
          </p>
          <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
            Now set up your environment
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
            The workflows only work well with the right tools behind them. Tooling covers Claude Code, Codex, Figma MCP, and the agent setup that makes it all click.
          </p>
        </div>

        <Link
          href="/tooling"
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-400 hover:shadow-violet-400/30 active:scale-[0.98]"
        >
          Explore Tooling
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
