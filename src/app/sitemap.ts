import type { MetadataRoute } from "next";
import { getAllChapters } from "@/lib/content";
import { SITE_URL as BASE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const chapters = getAllChapters();
  const now = new Date();

  const chapterEntries: MetadataRoute.Sitemap = chapters.map((chapter) => ({
    url: `${BASE_URL}/chapters/${chapter.slug}`,
    lastModified:
      chapter.frontmatter.updatedAt ?? chapter.frontmatter.publishedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...chapterEntries,
  ];
}
