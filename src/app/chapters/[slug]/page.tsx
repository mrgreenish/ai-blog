import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllChapters, getChapter, getAdjacentChapters } from "@/lib/content";
import { ChapterLayout } from "@/components/content/ChapterLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { PART_META } from "@/lib/types";
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  SITE_LANGUAGE,
  AUTHOR_NAME,
  AUTHOR_URL,
  AUTHOR_TWITTER,
} from "@/lib/siteConfig";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

function countWords(markdown: string): number {
  // Strip code fences, then count whitespace-separated tokens.
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, " ");
  const stripped = withoutCode
    .replace(/[#>*_`~\-[\]()!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped ? stripped.split(" ").length : 0;
}

export async function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return {};
  const { title, subtitle, publishedAt, updatedAt, part } = chapter.frontmatter;
  const partLabel = PART_META[part]?.label;
  const canonicalPath = `/chapters/${slug}`;

  return {
    title,
    description: subtitle,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title,
      description: subtitle,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? publishedAt,
      section: partLabel,
      authors: [AUTHOR_URL],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subtitle,
      creator: AUTHOR_TWITTER,
    },
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(slug);
  const partMeta = PART_META[chapter.frontmatter.part];
  const canonicalUrl = `${SITE_URL}/chapters/${slug}`;
  const wordCount = countWords(chapter.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.frontmatter.title,
    description: chapter.frontmatter.subtitle,
    image: [
      {
        "@type": "ImageObject",
        url: `${canonicalUrl}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    ],
    datePublished: chapter.frontmatter.publishedAt,
    dateModified:
      chapter.frontmatter.updatedAt ?? chapter.frontmatter.publishedAt,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: partMeta?.label,
    inLanguage: SITE_LANGUAGE,
    wordCount,
    isPartOf: {
      "@type": "Book",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: chapter.frontmatter.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <ChapterLayout chapter={chapter} partMeta={partMeta} prev={prev} next={next}>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <MDXRemote
        source={chapter.content}
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
    </ChapterLayout>
  );
}
