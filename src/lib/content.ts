import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import type { Chapter, ChapterFrontmatter, Part } from "./types";

// ─── Chapter loading (v2) ────────────────────────────────────────────────────

const CHAPTERS_DIR = path.join(process.cwd(), "content/chapters");

export const getAllChapters = cache(function getAllChapters(): Chapter[] {
  if (!fs.existsSync(CHAPTERS_DIR)) return [];
  const files = fs.readdirSync(CHAPTERS_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CHAPTERS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      // Slug strips the leading number prefix: "01-reasoning-vs-fast" → "reasoning-vs-fast"
      const slug = file.replace(/^\d+-/, "").replace(/\.mdx$/, "");
      return { slug, frontmatter: data as ChapterFrontmatter, content };
    })
    .sort((a, b) => (a.frontmatter.chapter ?? 0) - (b.frontmatter.chapter ?? 0));
});

export const getChapter = cache(function getChapter(slug: string): Chapter | null {
  return getAllChapters().find((c) => c.slug === slug) ?? null;
});

export const getChaptersByPart = cache(function getChaptersByPart(part: Part): Chapter[] {
  return getAllChapters().filter((c) => c.frontmatter.part === part);
});

export const getAdjacentChapters = cache(function getAdjacentChapters(slug: string) {
  const all = getAllChapters();
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
});

