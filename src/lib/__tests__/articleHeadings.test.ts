import { describe, expect, it } from "vitest";
import { compileMDX } from "next-mdx-remote/rsc";
import { createHeadingPlugin, type ArticleHeading } from "../articleHeadings";

describe("article heading navigation", () => {
  it("uses rendered text, skips code fences, and gives repeated headings distinct destinations", async () => {
    const headings: ArticleHeading[] = [];
    await compileMDX({
      source:
        "## A **working** `spec`\n\n```md\n## Not a section\n```\n\n### Review & test\n\n## A working spec\n\n## Café",
      options: {
        mdxOptions: { rehypePlugins: [createHeadingPlugin(headings)] },
      },
    });
    expect(headings).toEqual([
      { id: "a-working-spec", text: "A working spec", level: 2 },
      { id: "review-test", text: "Review & test", level: 3 },
      { id: "a-working-spec-2", text: "A working spec", level: 2 },
      { id: "cafe", text: "Café", level: 2 },
    ]);
  });
});
