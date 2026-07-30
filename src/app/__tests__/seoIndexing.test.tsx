// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { NewsFeedList } from "@/components/content/NewsFeedList";
import {
  getIndexableNewsEntries,
  getNewsEntries,
} from "@/lib/content";
import { SITE_URL } from "@/lib/siteConfig";
import sitemap from "../sitemap";
import { GET as getFeed } from "../feed.xml/route";
import { generateMetadata as generateNewsMetadata } from "../chapters/what-is-happening/[entrySlug]/page";

describe("selective news indexing", () => {
  const allEntries = getNewsEntries();
  const indexableEntries = getIndexableNewsEntries();

  it("keeps all 46 reports public while selecting 22 for search", () => {
    expect(allEntries).toHaveLength(46);
    expect(indexableEntries).toHaveLength(22);
  });

  it("renders all reports in the visible news feed", () => {
    render(<NewsFeedList entries={allEntries} />);
    expect(screen.getAllByRole("article")).toHaveLength(46);
  });

  it("keeps all reports in RSS", async () => {
    const xml = await getFeed().text();
    const newsCategories = xml.match(
      /<category>What Is Happening<\/category>/g,
    );
    expect(newsCategories).toHaveLength(46);

    for (const entry of allEntries) {
      expect(xml).toContain(
        `${SITE_URL}/chapters/what-is-happening/${entry.slug}`,
      );
    }
  });

  it("puts only indexable reports in the 41-URL sitemap", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(41);

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

describe("consolidated review route", () => {
  it("permanently redirects the retired chapter to the merged guide", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/chapters/ai-code-review",
      destination: "/chapters/diff-review-loops",
      statusCode: 301,
    });
  });
});
