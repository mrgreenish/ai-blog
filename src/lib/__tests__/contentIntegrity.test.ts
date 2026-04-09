// @vitest-environment node
// ---------------------------------------------------------------------------
// Content integrity suite — deterministic, repo-local checks only.
// No web requests. Runs in CI on every PR.
//
// Checks:
//   1. Chapter frontmatter schema — required fields, valid part, valid tool slugs
//   2. No duplicate chapter slugs
//   3. No duplicate chapter numbers
//   4. interactiveTools slugs are all valid InteractiveTool values
//   5. MDX component names used in chapters exist in the shared registry
//   6. Model IDs in data files resolve in MODEL_REGISTRY
//   7. Chapter links in decisionTreeData resolve to real chapters
//   8. No unresolved merge conflict markers in source/content files
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "../../../");
const CHAPTERS_DIR = path.join(ROOT, "content/chapters");

const VALID_PARTS = new Set([
  "understanding-models",
  "shipping-workflows",
  "review-quality",
  "tools-infrastructure",
]);

interface ChapterInfo {
  slug: string;
  filePath: string;
  raw: string;
  frontmatter: Record<string, unknown>;
}

function loadAllChapters(): ChapterInfo[] {
  if (!fs.existsSync(CHAPTERS_DIR)) return [];
  const files = fs.readdirSync(CHAPTERS_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const filePath = path.join(CHAPTERS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/^\d+-/, "").replace(/\.mdx$/, "");
    return { slug, filePath, raw, frontmatter: data };
  });
}

const VALID_TOOL_SLUGS = new Set([
  "model-picker",
  "model-tinder",
  "model-mixer",
  "workflow-recipe",
  "scenario-lab",
  "prompt-lab",
  "failure-gallery",
  "dev-benchmark",
  "config-generator",
  "cost-calculator",
  "context-window-viz",
  "decision-tree",
  "max-mode-viz",
  "model-compare",
]);

// ---------------------------------------------------------------------------
// 1. Chapter frontmatter schema
// ---------------------------------------------------------------------------

describe("Chapter frontmatter schema", () => {
  const chapters = loadAllChapters();

  it("every chapter has a non-empty string title", () => {
    const bad = chapters.filter((c) => !c.frontmatter.title || typeof c.frontmatter.title !== "string");
    expect(bad.map((c) => c.slug), "chapters missing title").toEqual([]);
  });

  it("every chapter has a non-empty string subtitle", () => {
    const bad = chapters.filter((c) => !c.frontmatter.subtitle || typeof c.frontmatter.subtitle !== "string");
    expect(bad.map((c) => c.slug), "chapters missing subtitle").toEqual([]);
  });

  it("every chapter has a numeric chapter number", () => {
    const bad = chapters.filter((c) => typeof c.frontmatter.chapter !== "number");
    expect(bad.map((c) => c.slug), "chapters missing numeric chapter").toEqual([]);
  });

  it("every chapter has a valid part", () => {
    const bad = chapters.filter((c) => !VALID_PARTS.has(c.frontmatter.part as string));
    expect(bad.map((c) => `${c.slug}: "${c.frontmatter.part}"`), "invalid part").toEqual([]);
  });

  it("publishedAt is a parseable date string when present", () => {
    const bad = chapters.filter(
      (c) => c.frontmatter.publishedAt !== undefined && isNaN(Date.parse(c.frontmatter.publishedAt as string))
    );
    expect(bad.map((c) => `${c.slug}: "${c.frontmatter.publishedAt}"`), "unparseable publishedAt").toEqual([]);
  });

  it("updatedAt is a parseable date string when present", () => {
    const bad = chapters.filter(
      (c) => c.frontmatter.updatedAt !== undefined && isNaN(Date.parse(c.frontmatter.updatedAt as string))
    );
    expect(bad.map((c) => `${c.slug}: "${c.frontmatter.updatedAt}"`), "unparseable updatedAt").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 2. No duplicate chapter slugs
// ---------------------------------------------------------------------------

describe("Chapter slug uniqueness", () => {
  const chapters = loadAllChapters();

  it("no duplicate slugs", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const c of chapters) {
      if (seen.has(c.slug)) dupes.push(c.slug);
      seen.add(c.slug);
    }
    expect(dupes, "duplicate slugs").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. No duplicate chapter numbers
// ---------------------------------------------------------------------------

describe("Chapter number uniqueness", () => {
  const chapters = loadAllChapters();

  it("no duplicate chapter numbers", () => {
    const seen = new Map<number, string>();
    const dupes: string[] = [];
    for (const c of chapters) {
      const num = c.frontmatter.chapter as number;
      if (seen.has(num)) {
        dupes.push(`chapter ${num} used by both "${seen.get(num)}" and "${c.slug}"`);
      } else {
        seen.set(num, c.slug);
      }
    }
    expect(dupes, "duplicate chapter numbers").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. interactiveTools slugs are all valid
// ---------------------------------------------------------------------------

describe("interactiveTools slugs", () => {
  const chapters = loadAllChapters();

  it("every interactiveTool slug is a valid InteractiveTool value", () => {
    const invalid: string[] = [];
    for (const c of chapters) {
      const tools = c.frontmatter.interactiveTools;
      if (!Array.isArray(tools)) continue;
      for (const tool of tools) {
        if (!VALID_TOOL_SLUGS.has(tool as string)) {
          invalid.push(`${c.slug}: unknown slug "${tool}"`);
        }
      }
    }
    expect(invalid, "invalid interactiveTool slugs").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. MDX component names used in chapters exist in the shared registry
// ---------------------------------------------------------------------------

describe("MDX component registration", () => {
  const chapters = loadAllChapters();

  const registryPath = path.join(ROOT, "src/lib/mdxComponents.tsx");
  const registrySource = fs.readFileSync(registryPath, "utf-8");
  const registeredComponents = new Set(
    [...registrySource.matchAll(/^\s{2}(\w+),?\s*$/gm)].map((m) => m[1])
  );

  it("every JSX component used in MDX body is registered in MDX_COMPONENTS", () => {
    const unregistered: string[] = [];
    for (const c of chapters) {
      const bodyWithoutCode = c.raw.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
      const used = [...bodyWithoutCode.matchAll(/<([A-Z][A-Za-z0-9]*)[^>]*\/?>/g)].map((m) => m[1]);
      for (const component of used) {
        if (!registeredComponents.has(component)) {
          unregistered.push(`${c.slug}: <${component} /> not in MDX_COMPONENTS`);
        }
      }
    }
    expect(unregistered, "unregistered MDX components").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 6. Model IDs in data files resolve in MODEL_REGISTRY
// ---------------------------------------------------------------------------

describe("Model ID integrity", () => {
  const modelSpecsPath = path.join(ROOT, "src/lib/modelSpecs.ts");
  const modelSpecsSource = fs.readFileSync(modelSpecsPath, "utf-8");
  const registryIds = new Set(
    [...modelSpecsSource.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1])
  );

  it("MODEL_REGISTRY has no duplicate IDs", () => {
    const allIds = [...modelSpecsSource.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const id of allIds) {
      if (seen.has(id)) dupes.push(id);
      seen.add(id);
    }
    expect(dupes, "duplicate model IDs in MODEL_REGISTRY").toEqual([]);
  });

  it("every modelId in scenarioLabData resolves in MODEL_REGISTRY", () => {
    const scenarioPath = path.join(ROOT, "src/lib/scenarioLabData.ts");
    const source = fs.readFileSync(scenarioPath, "utf-8");
    const ids = [...source.matchAll(/modelId:\s*"([^"]+)"/g)].map((m) => m[1]);
    const missing = ids.filter((id) => !registryIds.has(id));
    expect([...new Set(missing)], "scenarioLabData model IDs not in registry").toEqual([]);
  });

  it("every modelId branch in modelPickerScoring resolves in MODEL_REGISTRY", () => {
    const scoringPath = path.join(ROOT, "src/lib/modelPickerScoring.ts");
    const source = fs.readFileSync(scoringPath, "utf-8");
    const ids = [...source.matchAll(/modelId\s*===\s*"([^"]+)"/g)].map((m) => m[1]);
    const missing = ids.filter((id) => !registryIds.has(id));
    expect([...new Set(missing)], "modelPickerScoring model IDs not in registry").toEqual([]);
  });

  it("every hardcoded model ID in selector functions resolves in MODEL_REGISTRY", () => {
    const source = fs.readFileSync(modelSpecsPath, "utf-8");
    const selectorSection = source.slice(source.indexOf("export function getCostCalculatorModels"));
    const arrayMatches = [...selectorSection.matchAll(/const ids\s*=\s*\[([\s\S]*?)\]/g)];
    const ids: string[] = [];
    for (const match of arrayMatches) {
      const inner = match[1];
      for (const idMatch of inner.matchAll(/"([^"]+)"/g)) {
        ids.push(idMatch[1]);
      }
    }
    const missing = ids.filter((id) => !registryIds.has(id));
    expect([...new Set(missing)], "selector function model IDs not in registry").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 7. Chapter links in decisionTreeData resolve to real chapters
// ---------------------------------------------------------------------------

describe("Chapter link integrity", () => {
  const chapters = loadAllChapters();
  const chapterSlugs = new Set(chapters.map((c) => c.slug));

  it("every articleLink and relatedLink in decisionTreeData resolves to a real chapter", () => {
    const treeDataPath = path.join(ROOT, "src/lib/decisionTreeData.ts");
    const source = fs.readFileSync(treeDataPath, "utf-8");
    const hrefs = [...source.matchAll(/href:\s*"(\/[^"]+)"/g)].map((m) => m[1]);

    const missing: string[] = [];
    for (const href of hrefs) {
      // href format: /chapters/slug
      const match = href.match(/^\/chapters\/(.+)$/);
      if (!match) {
        missing.push(`${href} (not a /chapters/ link)`);
        continue;
      }
      if (!chapterSlugs.has(match[1])) {
        missing.push(href);
      }
    }
    expect([...new Set(missing)], "broken chapter links in decisionTreeData").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 8. No unresolved merge conflict markers
// ---------------------------------------------------------------------------

describe("No merge conflict markers", () => {
  const MERGE_MARKER = /^(<{7}|={7}|>{7})\s/m;

  const dirsToCheck = [
    path.join(ROOT, "content"),
    path.join(ROOT, "src"),
    path.join(ROOT, ".cursor/skills"),
  ];

  const extensions = new Set([".ts", ".tsx", ".mdx", ".md"]);

  function collectFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        results.push(...collectFiles(fullPath));
      } else if (extensions.has(path.extname(entry.name))) {
        results.push(fullPath);
      }
    }
    return results;
  }

  it("no unresolved merge conflict markers in source and content files", () => {
    const conflicted: string[] = [];
    for (const dir of dirsToCheck) {
      for (const filePath of collectFiles(dir)) {
        const content = fs.readFileSync(filePath, "utf-8");
        if (MERGE_MARKER.test(content)) {
          conflicted.push(filePath.replace(ROOT + "/", ""));
        }
      }
    }
    expect(conflicted, "files with unresolved merge conflict markers").toEqual([]);
  });
});
