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

const CATEGORY_GLOW: Record<Category, string> = {
  models:    "from-blue-600/[0.06] via-transparent",
  workflows: "from-emerald-600/[0.06] via-transparent",
  tooling:   "from-violet-600/[0.06] via-transparent",
};

const CATEGORY_GRADIENT_TEXT: Record<Category, string> = {
  models:    "gradient-text-blue",
  workflows: "gradient-text-emerald",
  tooling:   "gradient-text-violet",
};

export function ArticleLayout({ frontmatter, category, children, nextArticle }: ArticleLayoutProps) {
  const meta = CATEGORY_META[category];
  const glowClass = CATEGORY_GLOW[category];
  const gradientTextClass = CATEGORY_GRADIENT_TEXT[category];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">

      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-1.5 font-mono text-xs text-fg-muted">
        <Link href="/" className="transition-colors hover:opacity-70">
          home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/${category}`}
          className={`transition-colors hover:opacity-70 ${meta.accent}`}
        >
          {meta.label.toLowerCase()}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-48 text-fg-secondary">{frontmatter.title}</span>
      </nav>

      {/* Article header */}
      <header
        className="relative mb-12 overflow-hidden rounded-2xl p-8 pb-10 bg-bg-surface border border-border-default"
        
      >
        {/* Background glow */}
        <div
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${glowClass} to-transparent`}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Category badge */}
          <div className="mb-4">
            <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-xs ${meta.accentBg} ${meta.accent}`}>
              {meta.label}
            </span>
          </div>

          {/* Title */}
          <h1 className={`font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${gradientTextClass}`}>
            {frontmatter.title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-base leading-relaxed text-fg-secondary">
            {frontmatter.description}
          </p>

          {/* Interactive tools */}
          {frontmatter.interactiveTools && frontmatter.interactiveTools.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="section-label">includes:</span>
              {frontmatter.interactiveTools.map((tool) => (
                <span
                  key={tool}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}
                >
                  {tool}
                </span>
              ))}
              {frontmatter.interactiveTools.includes("model-tinder") && (
                <ScrollToMatchButton />
              )}
            </div>
          )}
        </div>
      </header>

      {/* MDX content */}
      <article className="prose prose-base max-w-none">{children}</article>

      {/* Footer navigation */}
      <div className="mt-16">
        <div className="gradient-divider mb-10" />

        {nextArticle ? (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/${category}`}
              className="inline-flex items-center gap-2 text-sm transition-colors text-fg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {meta.label}
            </Link>
            <Link
              href={`/${category}/${nextArticle.slug}`}
              className={`group inline-flex items-center gap-4 rounded-2xl border border-border-default p-5 transition-all hover:-translate-y-0.5 ${meta.accentBg}`}
            >
              <div className="text-right">
                <div className="section-label mb-1">Continue to next part</div>
                <div className={`font-display text-sm font-semibold ${meta.accent}`}>
                  {nextArticle.frontmatter.title}
                </div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 ${meta.accent} transition-transform group-hover:translate-x-0.5`} />
            </Link>
          </div>
        ) : (
          <Link
            href={`/${category}`}
            className={`inline-flex items-center gap-2 text-sm font-medium ${meta.accent} transition-opacity hover:opacity-70`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {meta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
