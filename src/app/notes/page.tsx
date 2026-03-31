import { getArticlesByCategory } from "@/lib/content";
import { CategoryHeader } from "@/components/content/CategoryHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Things moving fast in agent tooling — hooks, harness design, browser automation, and the emerging infrastructure layer. Currently diving in.",
};

export default function NotesPage() {
  const articles = getArticlesByCategory("notes");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <CategoryHeader category="notes" articleCount={articles.length} />

      <FadeIn delay={0.05}>
        <div className="mt-8 mb-2 space-y-4 text-base leading-relaxed text-fg-secondary">
          <p>
            Not finished thinking — just thinking out loud. These are areas I'm
            actively exploring: new tools, patterns, and infrastructure that
            haven't settled into full articles yet.
          </p>
        </div>
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
