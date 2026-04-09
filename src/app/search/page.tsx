import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllChapters } from "@/lib/content";
import { SearchView, type SearchableChapter } from "./SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search chapters across AI Field Notes.",
};

export default function SearchPage() {
  const chapters: SearchableChapter[] = getAllChapters().map((c) => ({
    slug: c.slug,
    chapter: c.frontmatter.chapter,
    title: c.frontmatter.title,
    subtitle: c.frontmatter.subtitle,
    part: c.frontmatter.part,
    interactiveTools: c.frontmatter.interactiveTools,
  }));

  return (
    <Suspense>
      <SearchView chapters={chapters} />
    </Suspense>
  );
}
