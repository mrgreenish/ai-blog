import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models",
  description:
    "When to reach for which model — from real shipping experience. Reasoning vs fast, model personalities, design to code.",
};

export default function ModelsPage() {
  const articles = getArticlesByCategory("models");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader category="models" articleCount={articles.length} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
