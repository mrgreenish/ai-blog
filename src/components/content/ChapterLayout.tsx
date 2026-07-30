import Link from "next/link";
import type { Chapter } from "@/lib/types";
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/siteConfig";

interface ChapterLayoutProps {
  chapter: Chapter;
  partMeta: { label: string; number: number };
  prev: Chapter | null;
  next: Chapter | null;
  children: React.ReactNode;
}

function toRoman(n: number): string {
  return (["I", "II", "III", "IV", "V"] as const)[n - 1] ?? String(n);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function ChapterLayout({ chapter, partMeta, prev, next, children }: ChapterLayoutProps) {
  const { frontmatter } = chapter;
  const chapterNum = String(frontmatter.chapter).padStart(2, "0");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-12">
        <Link
          href="/"
          className="font-mono text-xs text-fg-muted hover:text-fg-primary transition-colors uppercase tracking-widest"
        >
          ← Contents
        </Link>
      </nav>

      {/* Chapter header */}
      <header className="mb-12">
        <p className="font-mono text-xs text-fg-placeholder uppercase tracking-widest mb-4">
          Part {toRoman(partMeta.number)} · {partMeta.label}
        </p>
        <p className="font-mono text-[6rem] leading-none text-fg-placeholder mb-8 -ml-1 font-normal">
          {chapterNum}
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-fg-primary leading-tight mb-4">
          {frontmatter.title}
        </h1>
        {frontmatter.subtitle && (
          <p className="editorial-lead max-w-xl">
            {frontmatter.subtitle}
          </p>
        )}
        <p className="mt-5 font-mono text-xs text-fg-muted">
          By{" "}
          <a
            href={AUTHOR_URL}
            rel="author"
            className="underline underline-offset-2 hover:text-fg-primary"
          >
            {AUTHOR_NAME}
          </a>
          {frontmatter.publishedAt ? (
            <>
              {" · "}
              <time dateTime={frontmatter.publishedAt}>
                Published {formatDate(frontmatter.publishedAt)}
              </time>
            </>
          ) : null}
          {frontmatter.updatedAt &&
          frontmatter.updatedAt !== frontmatter.publishedAt ? (
            <>
              {" · "}
              <time dateTime={frontmatter.updatedAt}>
                Updated {formatDate(frontmatter.updatedAt)}
              </time>
            </>
          ) : null}
        </p>
        {frontmatter.wonderQuestion && (
          <p className="mt-6 font-sans text-sm italic text-fg-muted border-l-2 border-border-default pl-4">
            {frontmatter.wonderQuestion}
          </p>
        )}
      </header>

      <div className="section-divider mb-12" />

      {/* Content */}
      <div className="prose prose-stone max-w-none">
        {children}
      </div>

      {/* Chapter navigation */}
      <div className="section-divider mt-16 mb-8" />
      <nav className="flex justify-between gap-8">
        {prev ? (
          <Link href={`/chapters/${prev.slug}`} className="group flex flex-col gap-1 max-w-xs">
            <span className="font-mono text-xs text-fg-placeholder uppercase tracking-widest">
              ← Chapter {String(prev.frontmatter.chapter).padStart(2, "0")}
            </span>
            <span className="font-sans text-sm font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
              {prev.frontmatter.title}
            </span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/chapters/${next.slug}`} className="group flex flex-col gap-1 max-w-xs text-right">
            <span className="font-mono text-xs text-fg-placeholder uppercase tracking-widest">
              Chapter {String(next.frontmatter.chapter).padStart(2, "0")} →
            </span>
            <span className="font-sans text-sm font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
              {next.frontmatter.title}
            </span>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
