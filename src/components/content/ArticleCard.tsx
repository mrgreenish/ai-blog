import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleMeta, Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleMeta;
  showCategoryBadge?: boolean;
  showStory?: boolean;
  showTools?: boolean;
}

const CATEGORY_HOVER_GLOW: Record<Category, string> = {
  models:    "hover:shadow-[0_8px_40px_-8px_rgba(96,165,250,0.25)]",
  workflows: "hover:shadow-[0_8px_40px_-8px_rgba(52,211,153,0.25)]",
  tooling:   "hover:shadow-[0_8px_40px_-8px_rgba(167,139,250,0.25)]",
};

const CATEGORY_ARROW_HOVER: Record<Category, string> = {
  models:    "group-hover:text-blue-400",
  workflows: "group-hover:text-emerald-400",
  tooling:   "group-hover:text-violet-400",
};

export function ArticleCard({
  article,
  showCategoryBadge = true,
  showStory = true,
  showTools = true,
}: ArticleCardProps) {
  const { slug, category, frontmatter } = article;
  const meta = CATEGORY_META[category as Category];
  const hoverGlow = CATEGORY_HOVER_GLOW[category as Category];
  const arrowHover = CATEGORY_ARROW_HOVER[category as Category];

  return (
    <Link
      href={`/${category}/${slug}`}
      className={`group flex flex-col rounded-2xl border border-white/7 bg-white/2 p-6 shadow-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/12 hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${hoverGlow}`}
    >
      {/* Category badge */}
      {showCategoryBadge && (
        <div className="mb-4">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}>
            {meta.label}
          </span>
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
          {frontmatter.title}
        </h3>
        <ArrowRight aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-700 transition-[color,transform] ${arrowHover} group-hover:translate-x-0.5`} />
      </div>

      {/* Story quote */}
      {showStory && frontmatter.story && (
        <p className="mt-3 border-l-2 border-zinc-800 pl-3 text-sm italic leading-relaxed text-zinc-400 transition-colors group-hover:border-zinc-700">
          &ldquo;{frontmatter.story}&rdquo;
        </p>
      )}

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
        {frontmatter.description}
      </p>

      {/* Tool tags */}
      {showTools && frontmatter.interactiveTools && frontmatter.interactiveTools.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {frontmatter.interactiveTools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className={`rounded-full border px-2 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}
            >
              {tool}
            </span>
          ))}
          {frontmatter.interactiveTools.length > 3 && (
            <span className="rounded-full border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-600">
              +{frontmatter.interactiveTools.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
