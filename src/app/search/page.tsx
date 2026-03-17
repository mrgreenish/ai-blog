import type { Metadata } from "next";
import { searchArticles, groupResultsByCategory } from "@/lib/search";
import { SearchResults } from "@/components/search/SearchResults";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles across models, workflows, and tooling.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "")?.trim() ?? "";

  const results = searchArticles(query);
  const groupedResults = groupResultsByCategory(results);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12">
      <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        Search
      </h1>
      <p className="mt-3 text-base text-zinc-400">
        Find articles by title, description, story, or tool tags.
      </p>

      <div className="gradient-divider mt-8" />

      {query ? (
        <SearchResults query={query} groupedResults={groupedResults} />
      ) : (
        <div className="py-16">
          <p className="text-zinc-500">
            Enter a search term in the header to find articles.
          </p>
        </div>
      )}
    </div>
  );
}
