import type { MetadataRoute } from "next";
import { getAllChapters } from "@/lib/content";

const BASE_URL = "https://ai-field-notes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const chapters = getAllChapters();

  const chapterEntries: MetadataRoute.Sitemap = chapters.map((chapter) => ({
    url: `${BASE_URL}/chapters/${chapter.slug}`,
    lastModified: chapter.frontmatter.updatedAt ?? chapter.frontmatter.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...chapterEntries,
  ];
}
