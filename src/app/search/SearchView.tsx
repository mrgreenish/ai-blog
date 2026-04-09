"use client";

import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export interface SearchableChapter {
  slug: string;
  chapter: number;
  title: string;
  subtitle: string;
  part: string;
  interactiveTools?: string[];
}

function toolsToSearchText(tools: string[] | undefined): string {
  if (!tools?.length) return "";
  return tools.map((t) => t.replace(/-/g, " ")).join(" ");
}

function SearchResultRow({ chapter }: { chapter: SearchableChapter }) {
  return (
    <Link href={`/chapters/${chapter.slug}`} className="toc-entry group">
      <span className="font-mono text-sm text-fg-placeholder w-8 shrink-0">
        {String(chapter.chapter).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <span className="font-sans text-base font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
          {chapter.title}
        </span>
        {chapter.subtitle && (
          <span className="block font-sans text-sm text-fg-muted mt-0.5">
            {chapter.subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}

export function SearchView({ chapters }: { chapters: SearchableChapter[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const fuse = useMemo(() => {
    const records = chapters.map((c) => ({
      ...c,
      toolsSearchText: toolsToSearchText(c.interactiveTools),
    }));
    return new Fuse(records, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "subtitle", weight: 0.35 },
        { name: "toolsSearchText", weight: 0.15 },
      ],
      threshold: 0.4,
    });
  }, [chapters]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query]);

  // Sync query to URL without full navigation
  useEffect(() => {
    const q = query.trim();
    const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.replace(url, { scroll: false });
  }, [query, router]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-fg-primary mb-4">
          Search
        </h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chapters..."
          autoFocus
          className="w-full max-w-md border border-border-default rounded-sm px-4 py-2.5 font-sans text-sm text-fg-primary bg-bg-page focus:outline-none focus:border-border-strong"
        />
      </div>

      <div className="section-divider mb-8" />

      {query.trim() && results.length === 0 && (
        <p className="font-sans text-sm text-fg-muted">
          No results for &ldquo;{query.trim()}&rdquo;. Try a different term or{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-fg-primary"
          >
            browse all chapters
          </Link>
          .
        </p>
      )}

      {results.length > 0 && (
        <div>
          <p className="font-mono text-xs text-fg-placeholder uppercase tracking-widest mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for
            &ldquo;{query.trim()}&rdquo;
          </p>
          {results.map((chapter) => (
            <SearchResultRow key={chapter.slug} chapter={chapter} />
          ))}
        </div>
      )}

      {!query.trim() && (
        <p className="font-sans text-sm text-fg-muted">
          Enter a search term above, or{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-fg-primary"
          >
            browse all chapters
          </Link>
          .
        </p>
      )}
    </div>
  );
}
