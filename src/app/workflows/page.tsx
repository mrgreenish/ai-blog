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
