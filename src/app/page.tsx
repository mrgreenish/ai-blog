import Link from "next/link";
import { ArrowRight, Compass, Calculator, Beaker, Terminal } from "lucide-react";
import { CATEGORY_META } from "@/lib/types";
import { getArticlesByCategory, getAllArticles } from "@/lib/content";
import { HomeHero } from "@/components/content/HomeHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { GlassCard } from "@/components/ui/GlassCard";

const JOURNEY = [
  {
    step: "01",
    cat: "models" as const,
    tagline: "Which model for what? I tested them so you don't have to.",
  },
  {
    step: "02",
    cat: "workflows" as const,
    tagline: "From spec to PR, avoiding doom spirals — flows that actually work.",
  },
  {
    step: "03",
    cat: "tooling" as const,
    tagline: "Cursor, Claude Code, MCP — how to configure everything.",
  },
];

const FEATURED_TOOLS = [
  { icon: Compass, name: "Model Picker", description: "Find the right model for any task" },
  { icon: Calculator, name: "Cost Calculator", description: "Compare token costs at scale" },
  { icon: Beaker, name: "Scenario Lab", description: "Real tasks, real outputs — see which model wins" },
  { icon: Terminal, name: "Config Generator", description: "Generate tool configurations" },
];

const NARRATIVE_SECTIONS = [
  {
    heading: "The vibe",
    body: [
      <>
        If you squint, this whole era feels like the early internet — the 1980s kind.
        Everyone experimenting. Nothing standardised. Half the tools built in a weekend.
      </>,
      <>
        But faster. Wildly faster. And with a persistent hum of{" "}
        <em className="not-italic font-medium text-fg-primary">
          are we building something we don&apos;t fully control?
        </em>
      </>,
    ],
  },
  {
    heading: "The main question",
    body: [
      <span key="q" className="block text-lg font-medium italic text-fg-primary">
        Which model should I use for this task?
      </span>,
      <>
        That question shapes everything else — the workflow, the guardrails, the cost.
        These notes walk through how I answer it, project by project.
      </>,
    ],
  },
];

export default function Home() {
  const articleCounts = {
    models: getArticlesByCategory("models").length,
    workflows: getArticlesByCategory("workflows").length,
    tooling: getArticlesByCategory("tooling").length,
  };

  const allArticles = getAllArticles();
  const uniqueToolCount = new Set(
    allArticles.flatMap((a) => a.frontmatter.interactiveTools ?? [])
  ).size;
  const featuredToolCount = FEATURED_TOOLS.length;
  const extraToolCount = Math.max(0, uniqueToolCount - featuredToolCount);

  return (
    <div>
      {/* Hero */}
      <HomeHero />

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-5xl" />

      {/* Narrative */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <FadeIn>
          <p className="section-label mb-12">Background</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: intro paragraph */}
          <FadeIn delay={0.05}>
            <div className="space-y-5 text-base leading-relaxed text-fg-secondary">
              <p>
                Over the past year I&apos;ve been using AI inside real projects —
                specs, tickets, production code. What started as curiosity turned into
                a set of habits I now run every day.
              </p>
              <p className="font-medium text-fg-primary">
                This site is the distilled version of what I&apos;ve learned.
              </p>
            </div>
          </FadeIn>

          {/* Right: narrative sections */}
          <div className="space-y-10">
            {NARRATIVE_SECTIONS.map((section, i) => (
              <FadeIn key={section.heading} delay={0.1 + i * 0.08}>
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight mb-3 text-fg-primary">
                    {section.heading}
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-fg-muted">
                    {section.body.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-5xl" />

      {/* Journey */}
      <section id="navigate" className="mx-auto max-w-5xl px-6 py-20">
        <FadeIn>
          <div className="mb-12">
            <p className="section-label mb-3">How to navigate</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-fg-primary">
              Here&apos;s how most people move through it
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted">
              The site is built around three topics. Most readers start with models, then explore workflows and tooling.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {JOURNEY.map(({ step, cat, tagline }, i) => {
            const meta = CATEGORY_META[cat];
            const count = articleCounts[cat];
            const glowVariant = cat === "models" ? "blue" : cat === "workflows" ? "emerald" : "violet";

            return (
              <FadeIn key={cat} delay={0.1 + i * 0.1}>
                <Link href={`/${cat}`} className="group block h-full">
                  <GlassCard hover glow={glowVariant} className="h-full p-6 transition-all duration-300">
                    {/* Step number */}
                    <div className="mb-5 flex items-center justify-between">
                      <span className={`font-mono text-3xl font-bold leading-none ${meta.accent} opacity-30 group-hover:opacity-50 transition-opacity`}>
                        {step}
                      </span>
                      <ArrowRight className={`h-4 w-4 ${meta.accent} opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0`} />
                    </div>

                    {/* Category badge */}
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent} mb-3`}>
                      {meta.label}
                    </span>

                    {/* Tagline */}
                    <p className="text-sm leading-relaxed transition-colors text-fg-secondary">
                      {tagline}
                    </p>

                    {/* Article count */}
                    <p className="mt-4 font-mono text-xs transition-colors text-fg-muted">
                      {count} articles
                    </p>
                  </GlassCard>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-5xl" />

      {/* Interactive tools */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <FadeIn>
          <div className="mb-12">
            <p className="section-label mb-3">Built-in tools</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-fg-primary">
              Every article ships with
              <br />
              at least one interactive tool
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted">
              Model pickers, cost calculators, prompt labs, workflow recipes — built to stay
              useful as things change, not just read once and forget.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_TOOLS.map(({ icon: Icon, name, description }, i) => (
            <FadeIn key={name} delay={0.05 + i * 0.07}>
              <GlassCard className="p-5">
                <div
                  className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-bg-elevated border border-border-default"
                  
                >
                  <Icon className="h-4 w-4 text-fg-secondary" />
                </div>
                <p className="font-display text-sm font-semibold text-fg-primary">{name}</p>
                <p className="mt-1 text-xs leading-relaxed text-fg-muted">{description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {extraToolCount > 0 && (
          <FadeIn delay={0.35}>
            <p className="mt-4 font-mono text-xs text-fg-muted">
              + {extraToolCount} more tool{extraToolCount !== 1 ? "s" : ""} across all articles
            </p>
          </FadeIn>
        )}
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20">
        <FadeIn>
          <div
            className="relative overflow-hidden rounded-2xl p-10 text-center bg-bg-surface border border-border-default"
            
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-600/[0.05] via-transparent to-violet-600/[0.04]" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-3xl" aria-hidden="true" />

            <div className="relative">
              <p className="section-label mb-4">Ready to dive in?</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-fg-primary">
                Start with Models
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-base text-fg-secondary">
                The foundation. Understand the tools before building the workflows.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/models"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400 hover:shadow-blue-400/35 active:scale-[0.98]"
                >
                  Explore Models
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <div className="flex items-center gap-3 text-sm text-fg-muted">
                  <Link href="/workflows" className="transition-colors hover:opacity-70">
                    Workflows
                  </Link>
                  <span  className="text-border-strong">·</span>
                  <Link href="/tooling" className="transition-colors hover:opacity-70">
                    Tooling
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
