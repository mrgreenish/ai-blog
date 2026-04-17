import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllChapters } from "@/lib/content";
import { SearchView, type SearchableChapter } from "./SearchView";
import { SITE_NAME, SITE_LOCALE, AUTHOR_TWITTER } from "@/lib/siteConfig";

const SEARCH_TITLE = "Search";
const SEARCH_DESCRIPTION =
  "Search every chapter of AI Field Notes — find specific models, workflows, tools, and lessons learned from shipping with AI.";

export const metadata: Metadata = {
  title: SEARCH_TITLE,
  description: SEARCH_DESCRIPTION,
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SEARCH_TITLE} | ${SITE_NAME}`,
    description: SEARCH_DESCRIPTION,
    url: "/search",
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEARCH_TITLE} | ${SITE_NAME}`,
    description: SEARCH_DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
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
