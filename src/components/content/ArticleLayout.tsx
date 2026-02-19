import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { ArticleFrontmatter, Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import type { ArticleMeta } from "@/lib/types";
import { ScrollToMatchButton } from "./ScrollToMatchButton";

interface ArticleLayoutProps {
  frontmatter: ArticleFrontmatter;
  category: Category;
  children: React.ReactNode;
  nextArticle?: ArticleMeta | null;
}

export function ArticleLayout({ frontmatter, category, children, nextArticle }: ArticleLayoutProps) {
  const meta = CATEGORY_META[category];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1 font-mono text-xs text-zinc-600">
        <Link href="/" className="hover:text-zinc-400 transition-colors">
          home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/${category}`}
          className={`hover:text-zinc-300 transition-colors ${meta.accent}`}
        >
          {meta.label.toLowerCase()}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-500 truncate max-w-48">{frontmatter.title}</span>
      </nav>

      {/* Article header */}
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <div className="mb-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}
          >
            {meta.label}
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          {frontmatter.description}
        </p>

        {frontmatter.interactiveTools && frontmatter.interactiveTools.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-600 self-center mr-1">includes:</span>
            {frontmatter.interactiveTools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-500"
              >
                {tool}
              </span>
            ))}
            {frontmatter.interactiveTools.includes("model-tinder") && (
              <ScrollToMatchButton />
            )}
          </div>
        )}
      </header>

      {/* MDX content */}
      <article>{children}</article>

      {/* Footer navigation */}
      <div className="mt-16 border-t border-zinc-800 pt-8">
        {nextArticle ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/${category}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {meta.label}
            </Link>
            <Link
              href={`/${category}/${nextArticle.slug}`}
              className={`group inline-flex items-center gap-3 rounded-lg border ${meta.accentBg} px-5 py-3 transition-opacity hover:opacity-80`}
            >
              <div className="text-right">
                <div className="text-xs text-zinc-500 mb-0.5">Continue to next part</div>
                <div className={`text-sm font-medium ${meta.accent}`}>
                  {nextArticle.frontmatter.title}
                </div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 ${meta.accent}`} />
            </Link>
          </div>
        ) : (
          <Link
            href={`/${category}`}
            className={`inline-flex items-center gap-2 text-sm ${meta.accent} hover:opacity-80 transition-opacity`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {meta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
