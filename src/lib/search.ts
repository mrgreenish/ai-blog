import Fuse, { type FuseResultMatch } from "fuse.js";
import { getAllArticles } from "./content";
import type { ArticleMeta, Category } from "./types";
import { CATEGORY_META } from "./types";

/** Normalize tool slugs for search: "model-picker" -> "model picker" */
function toolsToSearchText(tools: string[] | undefined): string {
  if (!tools?.length) return "";
  return tools.map((t) => t.replace(/-/g, " ")).join(" ");
}

export interface SearchableRecord {
  article: ArticleMeta;
  title: string;
  description: string;
  story: string;
  toolsSearchText: string;
  categoryLabel: string;
}

export interface SearchResult {
  article: ArticleMeta;
  matches: ReadonlyArray<FuseResultMatch>;
}

const CATEGORY_ORDER: Category[] = ["models", "workflows", "tooling"];

function toSearchableRecords(articles: ArticleMeta[]): SearchableRecord[] {
  return articles.map((article) => ({
    article,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    story: article.frontmatter.story ?? "",
    toolsSearchText: toolsToSearchText(article.frontmatter.interactiveTools),
    categoryLabel: CATEGORY_META[article.category].label,
  }));
}

let fuseInstance: Fuse<SearchableRecord> | null = null;

function getFuse(): Fuse<SearchableRecord> {
  if (!fuseInstance) {
    const records = toSearchableRecords(getAllArticles());
    fuseInstance = new Fuse(records, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.3 },
        { name: "story", weight: 0.2 },
        { name: "toolsSearchText", weight: 0.1 },
      ],
      threshold: 0.4,
      includeMatches: true,
    });
  }
  return fuseInstance;
}

/**
 * Run fuzzy search over article metadata. Returns results with match indices for highlighting.
 */
export function searchArticles(query: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const fuse = getFuse();
  const results = fuse.search(q);

  return results.map((r) => ({
    article: r.item.article,
    matches: r.matches ?? [],
  }));
}

/**
 * Group search results by category (Models, Workflows, Tooling order).
 */
export function groupResultsByCategory(
  results: SearchResult[]
): Map<Category, SearchResult[]> {
  const map = new Map<Category, SearchResult[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const result of results) {
    const list = map.get(result.article.category)!;
    list.push(result);
  }
  return map;
}
