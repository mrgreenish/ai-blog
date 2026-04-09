import type { Metadata } from "next";
import { searchArticles } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search",
  description: "Search chapters across AI Field Notes.",
};

function SearchResultRow({ result }: { result: SearchResult }) {
  const { chapter } = result;
  const { frontmatter, slug } = chapter;
  return (
    <Link
      href={`/chapters/${slug}`}
      className="toc-entry group"
    >
      <span className="font-mono text-sm text-fg-placeholder w-8 shrink-0">
        {String(frontmatter.chapter).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <span className="font-sans text-base font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
          {frontmatter.title}
        </span>
        {frontmatter.subtitle && (
          <span className="block font-sans text-sm text-fg-muted mt-0.5">
            {frontmatter.subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const results = searchArticles(query);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-fg-primary mb-4">
          Search
        </h1>
        <form action="/search" method="get">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search chapters..."
            autoFocus
            className="w-full max-w-md border border-border-default rounded-sm px-4 py-2.5 font-sans text-sm text-fg-primary bg-bg-page focus:outline-none focus:border-border-strong"
          />
        </form>
      </div>

      <div className="section-divider mb-8" />

      {query && results.length === 0 && (
        <p className="font-sans text-sm text-fg-muted">
          No results for &ldquo;{query}&rdquo;. Try a different term or{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-fg-primary">
            browse all chapters
          </Link>.
        </p>
      )}

      {results.length > 0 && (
        <div>
          <p className="font-mono text-xs text-fg-placeholder uppercase tracking-widest mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          {results.map((result) => (
            <SearchResultRow key={result.chapter.slug} result={result} />
          ))}
        </div>
      )}

      {!query && (
        <p className="font-sans text-sm text-fg-muted">
          Enter a search term above, or{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-fg-primary">
            browse all chapters
          </Link>.
        </p>
      )}
    </div>
  );
}
