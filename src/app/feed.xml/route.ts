import { getAllChapters } from "@/lib/content";
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

export function GET() {
  const chapters = getAllChapters();
  const lastBuildDate = new Date().toUTCString();

  const items = chapters
    .slice()
    .reverse()
    .map((chapter) => {
      const url = `${SITE_URL}/chapters/${chapter.slug}`;
      const { title, subtitle, publishedAt, updatedAt, part } =
        chapter.frontmatter;
      const pubDate = new Date(
        updatedAt ?? publishedAt ?? Date.now()
      ).toUTCString();
      const category = PART_META[part]?.label ?? "";

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(subtitle)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${escapeXml(AUTHOR)})</author>
      <category>${escapeXml(category)}</category>
    </item>`;
    })
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
