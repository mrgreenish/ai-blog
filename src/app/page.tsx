import Link from "next/link";
import { ArrowRight, Compass, Shuffle, ChefHat, Beaker, AlertTriangle, ClipboardCheck, Settings2, Calculator, GitCompare, Maximize2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/types";

const SECTION_ARTICLES = {
  models: 4,
  workflows: 6,
  tooling: 6,
};

const TOOLS = [
  {
    icon: Compass,
    name: "Model Picker",
    desc: "Decision wizard based on real usage",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: Shuffle,
    name: "Model Mixer",
    desc: "Chain models across a single task",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    icon: ChefHat,
    name: "Workflow Recipe",
    desc: "Copy-pasteable developer flows",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: Beaker,
    name: "Prompt Lab",
    desc: "Side-by-side model comparisons",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: AlertTriangle,
    name: "Failure Gallery",
    desc: "Real failure modes and exact fixes",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  {
    icon: ClipboardCheck,
    name: "Dev Benchmark",
    desc: "Checks that matter when shipping",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    icon: Settings2,
    name: "Config Generator",
    desc: "Generate .cursorrules, CLAUDE.md",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  {
    icon: Calculator,
    name: "Cost Calculator",
    desc: "Real cost comparison across providers",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: GitCompare,
    name: "Diff Viewer",
    desc: "Annotated before/after code diffs",
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
  },
  {
    icon: Maximize2,
    name: "Context Window Viz",
    desc: "Will your content fit? Visualized.",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <section className="mb-20">
        <div className="mb-4 font-mono text-sm text-zinc-500">
          developer field notes
        </div>
        <h1 className="text-4xl font-bold leading-tight text-zinc-50 sm:text-5xl">
          This isn&apos;t an AI news blog.
        </h1>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-zinc-400">
          It&apos;s my developer field notes: what actually worked, what broke, what
          surprised me, and what I&apos;d do differently next time.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-sm font-semibold text-zinc-300 mb-3">My rule:</p>
          <p className="text-sm leading-relaxed text-zinc-400">
            Every article ships with at least one interactive thing, because
            &ldquo;read-only&rdquo; AI content gets stale fast. Interactive bits turn my
            learnings into something you can reuse — and something I can keep
            updating as tools change.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm text-zinc-500">
            {[
              "Opinionated, not neutral",
              "Measurable, not vibes",
              "Grounded in shipping real stuff",
            ].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-blue-400" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mb-20">
        <h2 className="mb-6 font-mono text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Content
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["models", "workflows", "tooling"] as const).map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = SECTION_ARTICLES[cat];
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
              >
                <div className="flex items-start justify-between">
                  <h3 className={`font-mono text-lg font-bold ${meta.accent}`}>
                    {meta.label}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-0.5" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {meta.description}
                </p>
                <p className="mt-4 font-mono text-xs text-zinc-600">
                  {count} articles
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Interactive tools teaser */}
      <section>
        <div className="mb-6">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Interactive Tools
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            10 tools embedded throughout the articles — each one a placeholder
            for something being built. They explain what&apos;s coming and why.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className={`flex items-start gap-3 rounded-lg border p-3 ${tool.bg}`}
              >
                <div className={`mt-0.5 shrink-0 ${tool.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${tool.color}`}>
                    {tool.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
