import { getAllChapters, getNewsEntries } from "@/lib/content";
import { PART_META } from "@/lib/types";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  AUTHOR_NAME as AUTHOR,
  AUTHOR_EMAIL,
} from "@/lib/siteConfig";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface FeedItem {
  title: string;
  url: string;
  description: string;
  date: string;
  category: string;
}

export function GET() {
  const chapters = getAllChapters();
  const newsEntries = getNewsEntries();
  const lastBuildDate = new Date().toUTCString();

  const feedItems: FeedItem[] = [
    ...newsEntries.map((entry) => ({
      title: entry.frontmatter.title,
      url: `${SITE_URL}/chapters/what-is-happening/${entry.slug}`,
      description: `AI tooling update last verified ${entry.frontmatter.lastVerifiedAt}.`,
      date: entry.frontmatter.publishedAt,
      category: "What Is Happening",
    })),
    ...chapters.map((chapter) => ({
      title: chapter.frontmatter.title,
      url: `${SITE_URL}/chapters/${chapter.slug}`,
      description: chapter.frontmatter.subtitle,
      date:
        chapter.frontmatter.updatedAt ??
        chapter.frontmatter.publishedAt ??
        new Date().toISOString(),
      category: PART_META[chapter.frontmatter.part]?.label ?? "",
    })),
  ];

  const items = feedItems
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <author>${AUTHOR_EMAIL} (${escapeXml(AUTHOR)})</author>
      <category>${escapeXml(item.category)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
