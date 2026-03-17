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

export function ArticleCard({
  article,
  showCategoryBadge = true,
  showStory = true,
  showTools = true,
}: ArticleCardProps) {
  const { slug, category, frontmatter } = article;
  const meta = CATEGORY_META[category as Category];

  return (
    <Link
      href={`/${category}/${slug}`}
      className="card-hover group flex flex-col rounded-2xl p-6 shadow-transparent hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2"
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
        <h3
          className="font-display text-base font-semibold leading-snug transition-colors text-fg-primary"
        >
          {frontmatter.title}
        </h3>
        <ArrowRight
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 transition-[color,transform] group-hover:translate-x-0.5 text-fg-muted"
        />
      </div>

      {/* Story quote */}
      {showStory && frontmatter.story && (
        <p
          className="mt-3 border-l-2 pl-3 text-sm italic leading-relaxed transition-colors text-fg-secondary border-border-default"
          
        >
          &ldquo;{frontmatter.story}&rdquo;
        </p>
      )}

      {/* Description */}
      <p
        className="mt-3 line-clamp-2 text-sm leading-relaxed transition-colors text-fg-muted"
      >
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
            <span
              className="rounded-full border px-2 py-0.5 font-mono text-xs text-fg-muted border-border-default"
              
            >
              +{frontmatter.interactiveTools.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
