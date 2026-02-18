import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

const BASE_URL = "https://ai-field-notes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/${article.category}/${article.slug}`,
    lastModified: article.frontmatter.updatedAt ?? article.frontmatter.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/models`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/workflows`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tooling`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articleEntries,
  ];
}
