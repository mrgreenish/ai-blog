import Link from "next/link";
import { ArrowRight, Compass, Calculator, Shuffle, Layers, Maximize2 } from "lucide-react";
import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models",
  description:
    "When to reach for which model — from real shipping experience. Reasoning vs fast, model personalities, design to code.",
};

const NARRATIVE_SECTIONS = [
  {
    heading: "The real question",
    body: [
      "Not \"which model is best\" — that question has no answer. The real question is which model is right for this task, at this cost, with this latency budget.",
      "That framing changes everything. It turns model selection from a one-time setup decision into a skill you develop over time.",
    ],
  },
  {
    heading: "The tradeoff",
    body: [
      "Reasoning models think longer and cost more. Fast models respond in seconds and cost almost nothing. Neither is always right.",
      "The mistake I made early on: defaulting to the most capable model for everything. The bill was painful. The latency was worse.",
    ],
  },
  {
    heading: "It keeps shifting",
    body: [
      "New versions drop. Behaviour changes. A model that was unreliable for a task six months ago might be the right choice today.",
      "So this isn't a reference page. It's a set of frameworks for thinking about model choice — ones that hold up even as the models themselves change.",
    ],
  },
];

const READING_JOURNEY = [
  {
    step: "01",
    slug: "reasoning-vs-fast",
    bridge: "Start here. The first split you need to understand: when is raw reasoning power worth the cost, and when does speed win?",
  },
  {
    step: "02",
    slug: "design-to-code-and-back",
    bridge: "See how model choice plays out in a concrete workflow — turning Figma designs into code and back again.",
  },
  {
    step: "03",
    slug: "max-mode",
    bridge: "Understand the usage tiers. When does Max Mode pay for itself — and when is the API a better call?",
  },
  {
    step: "04",
    slug: "model-personalities",
    bridge: "Go deeper. Beyond speed and cost, every model has instincts. Knowing their tendencies changes how you prompt.",
  },
];

const MODEL_TOOLS = [
  { icon: Compass, name: "Model Picker", description: "Answer a few questions, get a model recommendation" },
  { icon: Calculator, name: "Cost Calculator", description: "Compare token costs across models at your actual scale" },
  { icon: Shuffle, name: "Model Tinder", description: "Swipe through model personalities to find your match" },
  { icon: Layers, name: "Model Mixer", description: "Assign the right model to each step of a multi-stage task" },
  { icon: Maximize2, name: "Max Mode Calc", description: "See when Cursor Max Mode earns its cost vs. Auto" },
];

export default function ModelsPage() {
  const articles = getArticlesByCategory("models");
  const articlesBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader category="models" articleCount={articles.length} />

      {/* Narrative intro */}
      <section className="py-16">
        <FadeIn>
          <p className="section-label mb-12">Why this matters</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: personal context */}
          <FadeIn delay={0.05}>
            <div className="space-y-5 text-base leading-relaxed text-zinc-400">
              <p>
                Model choice was the first thing I got wrong. I defaulted to the most capable model
                for everything — and paid for it in latency, cost, and occasionally in quality.
              </p>
              <p>
                The better mental model: think of each AI model like a specialist. Some are slow,
                methodical, expensive — great for hard problems. Others are fast, cheap, and
                surprisingly capable — ideal for well-defined tasks in a loop.
              </p>
              <p className="font-medium text-zinc-300">
                Knowing which to reach for, and when, is the foundation everything else builds on.
              </p>
            </div>
          </FadeIn>

          {/* Right: narrative mini-sections */}
          <div className="space-y-10">
            {NARRATIVE_SECTIONS.map((section, i) => (
              <FadeIn key={section.heading} delay={0.1 + i * 0.08}>
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight text-zinc-200 mb-3">
                    {section.heading}
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-zinc-500">
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

      <div className="gradient-divider" />

      {/* Reading journey */}
      <section className="py-16">
        <FadeIn>
          <div className="mb-12">
            <p className="section-label mb-3">Reading order</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Here&apos;s how the articles connect
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-6">
          {READING_JOURNEY.map(({ step, slug, bridge }, i) => {
            const article = articlesBySlug[slug];
            if (!article) return null;

            return (
              <FadeIn key={slug} delay={0.05 + i * 0.1}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6 items-start">
                  {/* Step + bridge */}
                  <div className="sm:w-56 shrink-0">
                    <span className="font-mono text-4xl font-bold leading-none text-blue-400 opacity-25">
                      {step}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{bridge}</p>
                  </div>

                  {/* Article card */}
                  <div className="flex-1">
                    <ArticleCard article={article} />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Interactive tools preview */}
      <section className="py-16">
        <FadeIn>
          <div className="mb-12">
            <p className="section-label mb-3">Built into the articles</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Interactive tools, not just text
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-500">
              Each article ships with tools you can actually use — not just read once and forget.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODEL_TOOLS.map(({ icon: Icon, name, description }, i) => (
            <FadeIn key={name} delay={0.05 + i * 0.07}>
              <GlassCard hover glow="blue" className="p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="h-4 w-4 text-zinc-400" />
                </div>
                <p className="font-display text-sm font-semibold text-zinc-200">{name}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA to Workflows */}
      <section className="pb-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-emerald-950/40 via-zinc-900/60 to-blue-950/30 p-10">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-600/8 via-transparent to-blue-600/6" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/4 top-0 h-40 w-80 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-label mb-2">What&apos;s next</p>
                <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
                  Now put the models to work
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                  Once you know which model to reach for, the next question is how to structure the
                  work. That&apos;s what Workflows covers.
                </p>
              </div>

              <Link
                href="/workflows"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30 active:scale-[0.98]"
              >
                Explore Workflows
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
