import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

interface CategoryHeaderProps {
  category: Category;
  articleCount?: number;
  showBreadcrumb?: boolean;
}

export function CategoryHeader({
  category,
  articleCount,
  showBreadcrumb = false,
}: CategoryHeaderProps) {
  const meta = CATEGORY_META[category];

  return (
    <div className="border-b border-zinc-800 pb-8">
      {showBreadcrumb && (
        <nav className="mb-4 flex items-center gap-1 font-mono text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className={meta.accent}>{category}</span>
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`font-mono text-3xl font-bold ${meta.accent}`}>
            {meta.label}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
            {meta.description}
          </p>
        </div>
        {articleCount !== undefined && (
          <span className="shrink-0 rounded-full border border-zinc-700 px-3 py-1 font-mono text-sm text-zinc-500">
            {articleCount} {articleCount === 1 ? "article" : "articles"}
          </span>
        )}
      </div>
    </div>
  );
}
