import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
  description:
    "Battle-tested flows I actually run as a developer. Spec to PR, bug to fix, design to Storybook — with guardrails and expected outputs.",
};

export default function WorkflowsPage() {
  const articles = getArticlesByCategory("workflows");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader category="workflows" articleCount={articles.length} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
