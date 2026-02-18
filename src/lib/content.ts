import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, ArticleFrontmatter, ArticleMeta, Category } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getArticlesByCategory(category: Category): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      category,
      frontmatter: data as ArticleFrontmatter,
    };
  });

  return articles.sort(
    (a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99)
  );
}

export function getArticle(category: Category, slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    category,
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const categories: Category[] = ["models", "workflows", "tooling"];
  return categories.flatMap((cat) => getArticlesByCategory(cat));
}

export function getAllArticlePaths(): { category: Category; slug: string }[] {
  const categories: Category[] = ["models", "workflows", "tooling"];
  return categories.flatMap((category) => {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ category, slug: f.replace(/\.mdx$/, "") }));
  });
}
