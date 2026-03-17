import Link from "next/link";
import type { Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import type { SearchResult } from "@/lib/search";
import { SearchResultCard } from "./SearchResultCard";

const CATEGORY_ORDER: Category[] = ["models", "workflows", "tooling"];
const CATEGORY_GRADIENT: Record<Category, string> = {
  models: "gradient-text-blue",
  workflows: "gradient-text-emerald",
  tooling: "gradient-text-violet",
};

interface SearchResultsProps {
  query: string;
  groupedResults: Map<Category, SearchResult[]>;
}

export function SearchResults({ query, groupedResults }: SearchResultsProps) {
  const totalCount = Array.from(groupedResults.values()).reduce(
    (sum, list) => sum + list.length,
    0
  );

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-lg text-zinc-400">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Try a different search, or browse by category:
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold transition-all hover:border-white/16 hover:bg-white/7 ${meta.accent} hover:text-white`}
              >
                {meta.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="mb-10 font-mono text-sm text-zinc-500">
        {totalCount} result{totalCount !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>

      <div className="space-y-14">
        {CATEGORY_ORDER.map((cat) => {
          const results = groupedResults.get(cat) ?? [];
          if (results.length === 0) return null;

          const meta = CATEGORY_META[cat];
          const gradientClass = CATEGORY_GRADIENT[cat];

          return (
            <section key={cat}>
              <h2 className={`font-display text-xl font-bold tracking-tight ${gradientClass} mb-6`}>
                {meta.label}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {results.map((result) => (
                  <SearchResultCard key={`${result.article.category}-${result.article.slug}`} result={result} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
