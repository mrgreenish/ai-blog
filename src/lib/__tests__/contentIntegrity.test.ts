// @vitest-environment node
// ---------------------------------------------------------------------------
// Content integrity suite — deterministic, repo-local checks only.
// No web requests. Runs in CI on every PR.
//
// Checks:
//   1. Frontmatter schema — required fields, valid category, valid tool slugs
//   2. Category-directory match — frontmatter.category matches the directory
//   3. No duplicate slugs per category
//   4. No duplicate order values per category
//   5. interactiveTools slugs are all valid InteractiveTool values
//   6. MDX component names used in articles exist in the shared registry
//   7. Model IDs in scenarioLabData, modelPickerScoring resolve in MODEL_REGISTRY
//   8. Article links in decisionTreeData resolve to real articles
//   9. No unresolved merge conflict markers in source/content files
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "../../../");
const CONTENT_DIR = path.join(ROOT, "content");
const CATEGORIES = ["models", "workflows", "tooling"] as const;

type Category = (typeof CATEGORIES)[number];

interface ArticleInfo {
  category: Category;
  slug: string;
  filePath: string;
  raw: string;
  frontmatter: Record<string, unknown>;
}

function loadAllArticles(): ArticleInfo[] {
  const articles: ArticleInfo[] = [];
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      articles.push({ category, slug: file.replace(/\.mdx$/, ""), filePath, raw, frontmatter: data });
    }
  }
  return articles;
}

// ---------------------------------------------------------------------------
// 1 & 2. Frontmatter schema + category-directory match
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = new Set(CATEGORIES);

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

describe("Frontmatter schema", () => {
  const articles = loadAllArticles();

  it("every article has a non-empty string title", () => {
    const bad = articles.filter((a) => !a.frontmatter.title || typeof a.frontmatter.title !== "string");
    expect(bad.map((a) => a.slug), "articles missing title").toEqual([]);
  });

  it("every article has a non-empty string description", () => {
    const bad = articles.filter((a) => !a.frontmatter.description || typeof a.frontmatter.description !== "string");
    expect(bad.map((a) => a.slug), "articles missing description").toEqual([]);
  });

  it("every article has a numeric order", () => {
    const bad = articles.filter((a) => typeof a.frontmatter.order !== "number");
    expect(bad.map((a) => a.slug), "articles missing numeric order").toEqual([]);
  });

  it("every article category matches its directory", () => {
    const bad = articles.filter((a) => a.frontmatter.category !== a.category);
    expect(
      bad.map((a) => `${a.slug}: frontmatter.category="${a.frontmatter.category}" but dir="${a.category}"`),
      "category-directory mismatch"
    ).toEqual([]);
  });

  it("every article category is a valid Category value", () => {
    const bad = articles.filter((a) => !VALID_CATEGORIES.has(a.frontmatter.category as Category));
    expect(bad.map((a) => `${a.slug}: "${a.frontmatter.category}"`), "invalid category").toEqual([]);
  });

  it("publishedAt is a parseable date string when present", () => {
    const bad = articles.filter(
      (a) => a.frontmatter.publishedAt !== undefined && isNaN(Date.parse(a.frontmatter.publishedAt as string))
    );
    expect(bad.map((a) => `${a.slug}: "${a.frontmatter.publishedAt}"`), "unparseable publishedAt").toEqual([]);
  });

  it("updatedAt is a parseable date string when present", () => {
    const bad = articles.filter(
      (a) => a.frontmatter.updatedAt !== undefined && isNaN(Date.parse(a.frontmatter.updatedAt as string))
    );
    expect(bad.map((a) => `${a.slug}: "${a.frontmatter.updatedAt}"`), "unparseable updatedAt").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. No duplicate slugs per category
// ---------------------------------------------------------------------------

describe("Slug uniqueness", () => {
  const articles = loadAllArticles();

  it("no duplicate slugs within a category", () => {
    const duplicates: string[] = [];
    for (const category of CATEGORIES) {
      const slugs = articles.filter((a) => a.category === category).map((a) => a.slug);
      const seen = new Set<string>();
      for (const slug of slugs) {
        if (seen.has(slug)) duplicates.push(`${category}/${slug}`);
        seen.add(slug);
      }
    }
    expect(duplicates, "duplicate slugs").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. No duplicate order values per category
// ---------------------------------------------------------------------------

describe("Order uniqueness", () => {
  const articles = loadAllArticles();

  it("no duplicate order values within a category", () => {
    const duplicates: string[] = [];
    for (const category of CATEGORIES) {
      const catArticles = articles.filter((a) => a.category === category);
      const seen = new Map<number, string>();
      for (const a of catArticles) {
        const order = a.frontmatter.order as number;
        if (seen.has(order)) {
          duplicates.push(`${category}: order ${order} used by both "${seen.get(order)}" and "${a.slug}"`);
        } else {
          seen.set(order, a.slug);
        }
      }
    }
    expect(duplicates, "duplicate order values").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. interactiveTools slugs are all valid
// ---------------------------------------------------------------------------

describe("interactiveTools slugs", () => {
  const articles = loadAllArticles();

  it("every interactiveTool slug is a valid InteractiveTool value", () => {
    const invalid: string[] = [];
    for (const a of articles) {
      const tools = a.frontmatter.interactiveTools;
      if (!Array.isArray(tools)) continue;
      for (const tool of tools) {
        if (!VALID_TOOL_SLUGS.has(tool as string)) {
          invalid.push(`${a.category}/${a.slug}: unknown slug "${tool}"`);
        }
      }
    }
    expect(invalid, "invalid interactiveTool slugs").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 6. MDX component names used in articles exist in the shared registry
// ---------------------------------------------------------------------------

describe("MDX component registration", () => {
  const articles = loadAllArticles();

  // Registered component names — derived from the actual registry file
  const registryPath = path.join(ROOT, "src/lib/mdxComponents.tsx");
  const registrySource = fs.readFileSync(registryPath, "utf-8");
  // Extract keys from the MDX_COMPONENTS object literal
  const registeredComponents = new Set(
    [...registrySource.matchAll(/^\s{2}(\w+),?\s*$/gm)].map((m) => m[1])
  );

  it("every JSX component used in MDX body is registered in MDX_COMPONENTS", () => {
    const unregistered: string[] = [];
    for (const a of articles) {
      // Strip fenced code blocks to avoid false positives on code examples
      const bodyWithoutCode = a.raw.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
      // Match self-closing or opening JSX tags that start with an uppercase letter
      const used = [...bodyWithoutCode.matchAll(/<([A-Z][A-Za-z0-9]*)[^>]*\/?>/g)].map((m) => m[1]);
      for (const component of used) {
        if (!registeredComponents.has(component)) {
          unregistered.push(`${a.category}/${a.slug}: <${component} /> not in MDX_COMPONENTS`);
        }
      }
    }
    expect(unregistered, "unregistered MDX components").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 7. Model IDs in data files resolve in MODEL_REGISTRY
// ---------------------------------------------------------------------------

describe("Model ID integrity", () => {
  // Load MODEL_REGISTRY ids dynamically
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

  it("every hardcoded model ID in getCostCalculatorModels/getScenarioLabModels resolves in MODEL_REGISTRY", () => {
    const source = fs.readFileSync(modelSpecsPath, "utf-8");
    // Extract IDs inside the const ids = [...] arrays in selector functions.
    // Match quoted strings that look like model IDs (contain a hyphen or are known patterns).
    const selectorSection = source.slice(source.indexOf("export function getCostCalculatorModels"));
    // Only match IDs that appear inside array literals: [ "id1", "id2", ... ]
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
// 8. Article links in decisionTreeData resolve to real articles
// ---------------------------------------------------------------------------

describe("Article link integrity", () => {
  it("every articleLink and relatedLink in decisionTreeData resolves to a real article", () => {
    const treeDataPath = path.join(ROOT, "src/lib/decisionTreeData.ts");
    const source = fs.readFileSync(treeDataPath, "utf-8");
    const hrefs = [...source.matchAll(/href:\s*"(\/[^"]+)"/g)].map((m) => m[1]);

    const missing: string[] = [];
    for (const href of hrefs) {
      // href format: /category/slug
      const parts = href.replace(/^\//, "").split("/");
      if (parts.length !== 2) continue;
      const [category, slug] = parts;
      const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
      if (!fs.existsSync(filePath)) {
        missing.push(href);
      }
    }
    expect([...new Set(missing)], "broken article links in decisionTreeData").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 9. No unresolved merge conflict markers
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
        // Skip node_modules and .git
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
