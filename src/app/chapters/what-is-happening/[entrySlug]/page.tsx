import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getAdjacentNewsEntries,
  getNewsEntries,
  getNewsEntry,
} from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import {
  AUTHOR_NAME,
  AUTHOR_TWITTER,
  AUTHOR_URL,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/siteConfig";

export function generateStaticParams() {
  return getNewsEntries().map((entry) => ({ entrySlug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ entrySlug: string }>;
}): Promise<Metadata> {
  const { entrySlug } = await params;
  const entry = getNewsEntry(entrySlug);
  if (!entry) return {};

  const canonicalPath = `/chapters/what-is-happening/${entry.slug}`;
  return {
    title: entry.frontmatter.title,
    description: `A dated AI tooling update, last verified ${entry.frontmatter.lastVerifiedAt}.`,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: entry.frontmatter.title,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime: entry.frontmatter.publishedAt,
      modifiedTime: entry.frontmatter.lastVerifiedAt,
      section: "What Is Happening",
      authors: [AUTHOR_URL],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.frontmatter.title,
      creator: AUTHOR_TWITTER,
    },
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  };
}

export default async function NewsEntryPage({
  params,
}: {
  params: Promise<{ entrySlug: string }>;
}) {
  const { entrySlug } = await params;
  const entry = getNewsEntry(entrySlug);
  if (!entry) notFound();

  const { newer, older } = getAdjacentNewsEntries(entrySlug);
  const canonicalUrl = `${SITE_URL}/chapters/what-is-happening/${entry.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: entry.frontmatter.title,
    datePublished: entry.frontmatter.publishedAt,
    dateModified: entry.frontmatter.lastVerifiedAt,
    author: { "@type": "Person", name: AUTHOR_NAME, url: AUTHOR_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <JsonLd data={articleJsonLd} />
      <nav className="mb-12">
        <Link
          href="/chapters/what-is-happening"
          className="font-mono text-xs text-fg-muted hover:text-fg-primary transition-colors uppercase tracking-widest"
        >
          ← What Is Happening
        </Link>
      </nav>

      <header className="mb-12">
        <p className="font-mono text-xs text-fg-placeholder uppercase tracking-widest mb-4">
          Entry {entry.frontmatter.publishedAt}
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-fg-primary leading-tight">
          {entry.frontmatter.title}
        </h1>
        <p className="mt-4 font-sans text-sm text-fg-muted">
          Last verified {entry.frontmatter.lastVerifiedAt}
          {" · "}
          <a
            href={entry.frontmatter.primarySourceUrl}
            className="underline underline-offset-2 hover:text-fg-primary"
          >
            Primary source
          </a>
        </p>
      </header>

      <div className="section-divider mb-12" />
      <div className="prose prose-stone max-w-none">
        <MDXRemote
          source={entry.content}
          components={MDX_COMPONENTS}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: { light: "github-light", dark: "github-light" },
                    keepBackground: false,
                  },
                ],
              ],
            },
          }}
        />
      </div>

      <div className="section-divider mt-16 mb-8" />
      <nav className="flex justify-between gap-8">
        {newer ? (
          <Link
            href={`/chapters/what-is-happening/${newer.slug}`}
            className="group flex max-w-xs flex-col gap-1"
          >
            <span className="font-mono text-xs text-fg-placeholder uppercase tracking-widest">
              ← Newer entry
            </span>
            <span className="font-sans text-sm font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
              {newer.frontmatter.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {older ? (
          <Link
            href={`/chapters/what-is-happening/${older.slug}`}
            className="group flex max-w-xs flex-col gap-1 text-right"
          >
            <span className="font-mono text-xs text-fg-placeholder uppercase tracking-widest">
              Older entry →
            </span>
            <span className="font-sans text-sm font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
              {older.frontmatter.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
