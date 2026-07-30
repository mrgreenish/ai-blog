import { describe, expect, it } from "vitest";
import { getContentExcerpt } from "@/lib/content";

describe("getContentExcerpt", () => {
  it("turns common MDX formatting into readable search copy", () => {
    const markdown =
      "OpenAI's **Voice** mode uses the [official guide](https://example.com) as its source.";

    expect(getContentExcerpt(markdown)).toBe(
      "OpenAI's Voice mode uses the official guide as its source.",
    );
  });

  it("truncates at a word boundary", () => {
    const excerpt = getContentExcerpt(
      "A deliberately long paragraph about AI-assisted development workflows and the practical lessons that make them reliable in production.",
      80,
    );

    expect(excerpt.length).toBeLessThanOrEqual(80);
    expect(excerpt).toMatch(/\u2026$/);
    expect(excerpt).not.toMatch(/\s\u2026$/);
  });
});
