// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsFeedList } from "@/components/content/NewsFeedList";
import {
  getIndexableNewsEntries,
  getNewsEntries,
} from "@/lib/content";
import { SITE_URL } from "@/lib/siteConfig";
import { TOOL_CATALOG } from "@/lib/toolCatalog";
import sitemap from "../sitemap";
import { GET as getFeed } from "../feed.xml/route";
import { generateMetadata as generateNewsMetadata } from "../chapters/what-is-happening/[entrySlug]/page";

describe("selective news indexing", () => {
  const allEntries = getNewsEntries();
  const indexableEntries = getIndexableNewsEntries();

  it("keeps all 51 reports public while selecting 26 for search", () => {
    expect(allEntries).toHaveLength(51);
    expect(indexableEntries).toHaveLength(26);
  });

  it("renders all reports in the visible news feed", () => {
    render(<NewsFeedList entries={allEntries} />);
    expect(screen.getAllByRole("article")).toHaveLength(51);
  });

  it("keeps all reports in RSS", async () => {
    const xml = await getFeed().text();
    const newsCategories = xml.match(
      /<category>What Is Happening<\/category>/g,
    );
    expect(newsCategories).toHaveLength(51);

    for (const entry of allEntries) {
      expect(xml).toContain(
        `${SITE_URL}/chapters/what-is-happening/${entry.slug}`,
      );
    }
  });

  it("puts only indexable reports and public tools in the sitemap", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(49 + TOOL_CATALOG.length);
    for (const tool of TOOL_CATALOG) {
      expect(entries.some(entry => entry.url === `${SITE_URL}/tools/${tool.id}`)).toBe(true);
    }

    const urls = new Set(entries.map((entry) => entry.url));
    for (const entry of allEntries) {
      const url = `${SITE_URL}/chapters/what-is-happening/${entry.slug}`;
      expect(urls.has(url)).toBe(entry.frontmatter.indexable);
    }
  });

  it("emits indexable metadata for selected reports", async () => {
    const entry = indexableEntries[0];
    const metadata = await generateNewsMetadata({
      params: Promise.resolve({ entrySlug: entry.slug }),
    });

    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
  });

  it("emits noindex,follow metadata for unselected reports", async () => {
    const entry = allEntries.find(
      (candidate) => !candidate.frontmatter.indexable,
    );
    expect(entry).toBeDefined();

    const metadata = await generateNewsMetadata({
      params: Promise.resolve({ entrySlug: entry!.slug }),
    });

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    });
  });
});
