import { describe, it, expect } from "vitest";

// The Home page is a Next.js Server Component that reads from the filesystem
// at render time and uses framer-motion animations. Full render tests require
// a Next.js test environment. These smoke tests verify the module loads and
// exports correctly.
describe("Home Page module", () => {
  it("exports a default function", async () => {
    const mod = await import("../page");
    expect(typeof mod.default).toBe("function");
  });
});
