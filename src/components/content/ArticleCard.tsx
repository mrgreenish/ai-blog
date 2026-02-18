import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleMeta, Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleMeta;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, category, frontmatter } = article;
  const meta = CATEGORY_META[category as Category];

  return (
    <Link
      href={`/${category}/${slug}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
          {frontmatter.title}
        </h3>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>

      {frontmatter.story && (
        <p className="mt-3 text-sm italic leading-relaxed text-zinc-300">
          &ldquo;{frontmatter.story}&rdquo;
        </p>
      )}

      <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
        {frontmatter.description}
      </p>

      {frontmatter.interactiveTools && frontmatter.interactiveTools.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {frontmatter.interactiveTools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className={`rounded-full border px-2 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}
            >
              {tool}
            </span>
          ))}
          {frontmatter.interactiveTools.length > 3 && (
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-500">
              +{frontmatter.interactiveTools.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
