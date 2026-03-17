import Link from "next/link";
import { getArticlesByCategory } from "@/lib/content";
import { CATEGORY_META } from "@/lib/types";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { ToolingCTA } from "@/components/content/ToolingCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
  description: CATEGORY_META.workflows.description,
};

export default function WorkflowsPage() {
  const articles = getArticlesByCategory("workflows");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader
        category="workflows"
        articleCount={articles.length}
        showEyebrow={false}
        showCount={false}
      />

      {/* Section framing */}
      <FadeIn delay={0.05}>
        <div className="mt-8 mb-2 space-y-4 text-base leading-relaxed text-zinc-400">
          <p>
            Now that you know which model to reach for, the question becomes how to
            structure the work. These articles cover the repeatable flows I run —
            from prompting habits through shipping.
          </p>
        </div>
      </FadeIn>

      {/* Prompting callout */}
      <FadeIn delay={0.1}>
        <div className="mt-6 mb-2 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-6 py-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
            Start here
          </p>
          <p className="text-sm leading-relaxed text-zinc-300">
            <span className="font-semibold text-zinc-100">Prompting &amp; Pitfalls</span>{" "}
            covers the habits that produce better output and the failure modes to watch for.
            Everything else builds on it.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link
              href="/workflows/ai-mindset"
              className="font-mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              Prompting &amp; Pitfalls →
            </Link>
            <Link
              href="/workflows/spec-to-pr"
              className="font-mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              Then: Spec → PR →
            </Link>
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            showCategoryBadge={false}
            showStory={false}
          />
        ))}
      </div>

      {/* CTA to Tooling */}
      <section className="pb-8 pt-16">
        <FadeIn>
          <ToolingCTA />
        </FadeIn>
      </section>
    </div>
  );
}
