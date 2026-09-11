import { DISCOVERY_PAGES } from "@/lib/discovery";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllChapters } from "@/lib/content";
import { SearchView, type SearchableChapter } from "./SearchView";
import { SITE_NAME, SITE_LOCALE, AUTHOR_TWITTER } from "@/lib/siteConfig";

const SEARCH_TITLE = "Search";
const SEARCH_DESCRIPTION =
  "Search AI Field Notes guides and tools — find practical workflows, model tradeoffs, and lessons learned from shipping with AI.";

export const metadata: Metadata = {
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
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

  chapters.push(...DISCOVERY_PAGES.map((page) => ({ slug: page.href, href: page.href, title: page.title, subtitle: page.description, part: "resources" })));

  return (
    <Suspense>
      <SearchView chapters={chapters} />
    </Suspense>
  );
}
