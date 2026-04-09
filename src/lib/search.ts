import Fuse, { type FuseResultMatch } from "fuse.js";
import { getAllChapters } from "./content";
import type { Chapter } from "./types";

function toolsToSearchText(tools: string[] | undefined): string {
  if (!tools?.length) return "";
  return tools.map((t) => t.replace(/-/g, " ")).join(" ");
}

export interface SearchableRecord {
  chapter: Chapter;
  title: string;
  subtitle: string;
  toolsSearchText: string;
  partLabel: string;
}

export interface SearchResult {
  chapter: Chapter;
  matches: ReadonlyArray<FuseResultMatch>;
}

function toSearchableRecords(chapters: Chapter[]): SearchableRecord[] {
  return chapters.map((chapter) => ({
    chapter,
    title: chapter.frontmatter.title,
    subtitle: chapter.frontmatter.subtitle ?? "",
    toolsSearchText: toolsToSearchText(chapter.frontmatter.interactiveTools),
    partLabel: chapter.frontmatter.part ?? "",
  }));
}

let fuseInstance: Fuse<SearchableRecord> | null = null;

function getFuse(): Fuse<SearchableRecord> {
  if (!fuseInstance) {
    const records = toSearchableRecords(getAllChapters());
    fuseInstance = new Fuse(records, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "subtitle", weight: 0.35 },
        { name: "toolsSearchText", weight: 0.15 },
      ],
      threshold: 0.4,
      includeMatches: true,
    });
  }
  return fuseInstance;
}

export function searchChapters(query: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const fuse = getFuse();
  const results = fuse.search(q);

  return results.map((r) => ({
    chapter: r.item.chapter,
    matches: r.matches ?? [],
  }));
}

// Keep old name as alias for search page compatibility
export const searchArticles = searchChapters;

export function groupResultsByPart(results: SearchResult[]): SearchResult[] {
  return results.sort(
    (a, b) => a.chapter.frontmatter.chapter - b.chapter.frontmatter.chapter
  );
}

// Keep for search page compatibility
export const groupResultsByCategory = (results: SearchResult[]) =>
  groupResultsByPart(results);
