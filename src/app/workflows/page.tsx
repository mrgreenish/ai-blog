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
      {/* Prompting callout */}
      <FadeIn delay={0.05}>
        <div className="mt-8 mb-2 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-6 py-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
            Prompting tip
          </p>
          <p className="text-sm leading-relaxed text-zinc-300">
            <span className="font-semibold text-zinc-100">If anything is unclear, ask clarifying questions first.</span>{" "}
            One question upfront is almost always faster than confidently solving the wrong problem.
            Before starting a task, try:{" "}
            <span className="font-mono text-xs text-emerald-300 bg-emerald-950/60 rounded px-1.5 py-0.5">
              &ldquo;Before you start, ask me anything that would help you do this better.&rdquo;
            </span>
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
              Spec → Plan → Code →
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
