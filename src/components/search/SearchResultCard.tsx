import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleMeta, Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import type { SearchResult } from "@/lib/search";
import { HighlightedText } from "./HighlightedText";

type RangeTuple = [number, number];

function getIndicesForKey(matches: SearchResult["matches"], key: string): RangeTuple[] {
  const m = matches.find((x) => x.key === key);
  return (m?.indices as RangeTuple[] | undefined) ?? [];
}

export function SearchResultCard({ result }: { result: SearchResult }) {
  const { article, matches } = result;
  const { slug, category, frontmatter } = article;
  const meta = CATEGORY_META[category as Category];

  const titleIndices = getIndicesForKey(matches, "title");
  const descIndices = getIndicesForKey(matches, "description");

  return (
    <Link
      href={`/${category}/${slug}`}
      className="card-hover group flex flex-col rounded-2xl p-6 shadow-transparent hover:-translate-y-1 focus-visible:outline-none"
    >
      <div className="mb-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs ${meta.accentBg} ${meta.accent}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3
          className="font-display text-base font-semibold leading-snug transition-colors text-fg-primary"
        >
          {titleIndices.length > 0 ? (
            <HighlightedText text={frontmatter.title} indices={titleIndices} />
          ) : (
            frontmatter.title
          )}
        </h3>
        <ArrowRight
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 transition-[color,transform] group-hover:translate-x-0.5 text-fg-muted"
        />
      </div>

      {frontmatter.story && (
        <p
          className="mt-3 border-l-2 pl-3 text-sm italic leading-relaxed transition-colors text-fg-secondary border-border-default"
          
        >
          &ldquo;{frontmatter.story}&rdquo;
        </p>
      )}

      <p
        className="mt-3 line-clamp-2 text-sm leading-relaxed transition-colors text-fg-muted"
      >
        {descIndices.length > 0 ? (
          <HighlightedText text={frontmatter.description} indices={descIndices} />
        ) : (
          frontmatter.description
        )}
      </p>

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
