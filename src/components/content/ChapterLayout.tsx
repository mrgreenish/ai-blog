import Link from "next/link";
import { getChapter } from "@/lib/content";
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/siteConfig";
import { RelatedGuideLink } from "./RelatedGuideLink";
import { ReadingNavigation, ReadingProgress } from "./ReadingNavigation";
import type { ArticleHeading } from "@/lib/articleHeadings";
import type { Chapter } from "@/lib/types";

interface ChapterLayoutProps {
  chapter: Chapter;
  partMeta: { label: string; number: number };
  prev: Chapter | null;
  next: Chapter | null;
  children: React.ReactNode;
  headings?: ArticleHeading[];
}
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));

export function ChapterLayout({
  chapter,
  partMeta,
  prev,
  next,
  children,
  headings = [],
}: ChapterLayoutProps) {
  const { frontmatter } = chapter;
  return (
    <article className="site-shell article-page">
      <ReadingProgress />
      <nav className="article-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">← Contents</Link>
        <span aria-hidden="true">/</span>
        <Link href="/guides">Guides</Link>
        <span aria-hidden="true">/</span>
        <span>Field note {String(frontmatter.chapter).padStart(2, "0")}</span>
      </nav>
      <header className="article-heading">
        <p className="eyebrow">
          <span className="status-dot" />
          Part {String(partMeta.number).padStart(2, "0")} / {partMeta.label}
        </p>
        <h1>{frontmatter.title}</h1>
        {frontmatter.subtitle ? (
          <p className="editorial-lead">{frontmatter.subtitle}</p>
        ) : null}
        <div className="article-meta">
          <span>
            By{" "}
            <a href={AUTHOR_URL} rel="author">
              {AUTHOR_NAME}
            </a>
          </span>
          {frontmatter.publishedAt ? (
            <time dateTime={frontmatter.publishedAt}>
              Published {formatDate(frontmatter.publishedAt)}
            </time>
          ) : null}
          {frontmatter.updatedAt &&
          frontmatter.updatedAt !== frontmatter.publishedAt ? (
            <time dateTime={frontmatter.updatedAt}>
              Updated {formatDate(frontmatter.updatedAt)}
            </time>
          ) : null}
        </div>
        {frontmatter.wonderQuestion ? (
          <p className="article-question">{frontmatter.wonderQuestion}</p>
        ) : null}
      </header>
      <div
        className={`article-grid ${headings.length ? "" : "article-grid-full"}`}
      >
        <ReadingNavigation headings={headings} />
        <div className="article-column">
          <ReadingNavigation headings={headings} mobile />
          <div id="article-body" className="prose article-prose">
            {children}
          </div>
          {frontmatter.relatedSlugs?.length ? (
            <section
              className="related-guides"
              aria-labelledby="related-guides"
            >
              <p className="eyebrow mb-4">Keep exploring</p>
              <h2 id="related-guides">Continue with a related guide</h2>
              <ul>
                {frontmatter.relatedSlugs.map((slug) => {
                  const related = getChapter(slug);
                  return related ? (
                    <li key={slug}>
                      <RelatedGuideLink
                        sourceSlug={chapter.slug}
                        targetSlug={slug}
                      >
                        {related.frontmatter.title}
                      </RelatedGuideLink>
                    </li>
                  ) : null;
                })}
              </ul>
            </section>
          ) : null}
          <nav className="chapter-navigation" aria-label="Chapter navigation">
            {prev ? (
              <Link href={`/chapters/${prev.slug}`}>
                <span>
                  ← Chapter {String(prev.frontmatter.chapter).padStart(2, "0")}
                </span>
                {prev.frontmatter.title}
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={`/chapters/${next.slug}`}>
                <span>
                  Chapter {String(next.frontmatter.chapter).padStart(2, "0")} →
                </span>
                {next.frontmatter.title}
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
