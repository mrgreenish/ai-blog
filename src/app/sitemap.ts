import type { MetadataRoute } from "next";
import { getAllChapters, getIndexableNewsEntries } from "@/lib/content";
import { SITE_URL as BASE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const chapters = getAllChapters();
  const newsEntries = getIndexableNewsEntries();
  const contentDates = [
    ...chapters.flatMap((chapter) => [
      chapter.frontmatter.updatedAt,
      chapter.frontmatter.publishedAt,
    ]),
    ...newsEntries.flatMap((entry) => [
      entry.frontmatter.lastVerifiedAt,
      entry.frontmatter.publishedAt,
    ]),
  ].filter((date): date is string => Boolean(date));
  const latestContentDate = contentDates.sort((a, b) => b.localeCompare(a))[0];

  const chapterEntries: MetadataRoute.Sitemap = chapters.map((chapter) => ({
    url: `${BASE_URL}/chapters/${chapter.slug}`,
    lastModified: chapter.frontmatter.updatedAt ?? chapter.frontmatter.publishedAt,
  }));
  const newsSitemapEntries: MetadataRoute.Sitemap = newsEntries.map((entry) => ({
    url: `${BASE_URL}/chapters/what-is-happening/${entry.slug}`,
    lastModified: entry.frontmatter.lastVerifiedAt,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: latestContentDate,
    },
    ...chapterEntries,
    ...newsSitemapEntries,
  ];
}
