import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

interface CategoryHeaderProps {
  category: Category;
  articleCount?: number;
  showBreadcrumb?: boolean;
  showEyebrow?: boolean;
  showCount?: boolean;
}

const CATEGORY_GLOW: Record<Category, string> = {
  models:    "from-blue-600/[0.08] via-transparent",
  workflows: "from-emerald-600/[0.08] via-transparent",
  tooling:   "from-violet-600/[0.08] via-transparent",
};

const CATEGORY_GRADIENT_TEXT: Record<Category, string> = {
  models:    "gradient-text-blue",
  workflows: "gradient-text-emerald",
  tooling:   "gradient-text-violet",
};

export function CategoryHeader({
  category,
  articleCount,
  showBreadcrumb = false,
  showEyebrow = true,
  showCount = true,
}: CategoryHeaderProps) {
  const meta = CATEGORY_META[category];
  const glowClass = CATEGORY_GLOW[category];
  const gradientTextClass = CATEGORY_GRADIENT_TEXT[category];

  return (
    <div className="relative overflow-hidden pb-12">
      {/* Background glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${glowClass} to-transparent`}
        aria-hidden="true"
      />

      {/* Breadcrumb */}
      {showBreadcrumb && (
        <nav className="relative mb-6 flex items-center gap-1 font-mono text-xs text-zinc-600">
          <Link href="/" className="transition-colors hover:text-zinc-400">
            home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className={meta.accent}>{category}</span>
        </nav>
      )}

      <div className="relative flex items-end justify-between gap-6">
        <div>
          {/* Section label */}
          {showEyebrow && <p className="section-label mb-4">{meta.label}</p>}

          {/* Large gradient heading */}
          <h1 className={`font-display text-5xl font-bold tracking-tight sm:text-6xl ${gradientTextClass}`}>
            {meta.label}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
            {meta.description}
          </p>
        </div>

        {/* Article count badge */}
        {showCount && articleCount !== undefined && (
          <div className="shrink-0 text-right">
            <div className={`font-display text-4xl font-bold ${gradientTextClass} opacity-30`}>
              {articleCount}
            </div>
            <p className="font-mono text-xs text-zinc-600">
              {articleCount === 1 ? "article" : "articles"}
            </p>
          </div>
        )}
      </div>

      {/* Gradient divider */}
      <div className="gradient-divider mt-10" />
    </div>
  );
}
