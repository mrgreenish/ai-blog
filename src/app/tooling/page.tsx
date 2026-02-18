import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
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
    </div>
  );
}
