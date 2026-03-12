import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tooling",
  description:
    "Claude Code, Codex, Figma MCP, agent guardrails, and the emerging skills ecosystem. What I use, how I configure it, what broke.",
};

export default function ToolingPage() {
  const articles = getArticlesByCategory("tooling");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader category="tooling" articleCount={articles.length} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* CTA back to Models */}
      <section className="pb-8 pt-16">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-blue-950/40 via-zinc-900/60 to-violet-950/30 p-10">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-600/8 via-transparent to-violet-600/6" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/4 top-0 h-40 w-80 -translate-y-1/2 rounded-full bg-blue-500/8 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-label mb-2">Back to the start</p>
                <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
                  Revisit the models
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                  Now that you know the workflows and the tools, the model selection questions hit differently. Worth another look.
                </p>
              </div>

              <Link
                href="/models"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-[background-color,box-shadow,transform] hover:bg-blue-400 hover:shadow-blue-400/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Explore Models
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
