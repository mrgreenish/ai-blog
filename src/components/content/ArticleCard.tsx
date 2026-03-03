import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleMeta, Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleMeta;
}

const CATEGORY_HOVER_GLOW: Record<Category, string> = {
  models:    "hover:shadow-[0_8px_40px_-8px_rgba(96,165,250,0.25)]",
  workflows: "hover:shadow-[0_8px_40px_-8px_rgba(52,211,153,0.25)]",
  tooling:   "hover:shadow-[0_8px_40px_-8px_rgba(167,139,250,0.25)]",
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, category, frontmatter } = article;
  const meta = CATEGORY_META[category as Category];
  const hoverGlow = CATEGORY_HOVER_GLOW[category as Category];

  return (
    <Link
      href={`/${category}/${slug}`}
      className={`group flex flex-col rounded-2xl border border-white/7 bg-white/2 p-6 shadow-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/12 hover:bg-white/4 ${hoverGlow}`}
    >
      {/* Category badge */}
      <div className="mb-4">
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}>
          {meta.label}
        </span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
          {frontmatter.title}
        </h3>
        <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-700 transition-all group-hover:${meta.accent} group-hover:translate-x-0.5`} />
      </div>

      {/* Story quote */}
      {frontmatter.story && (
        <p className="mt-3 text-sm italic leading-relaxed text-zinc-400 border-l-2 border-zinc-800 pl-3 group-hover:border-zinc-700 transition-colors">
          &ldquo;{frontmatter.story}&rdquo;
        </p>
      )}

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2 group-hover:text-zinc-400 transition-colors">
        {frontmatter.description}
      </p>

      {/* Tool tags */}
      {frontmatter.interactiveTools && frontmatter.interactiveTools.length > 0 && (
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
