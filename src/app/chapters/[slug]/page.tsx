import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllChapters, getChapter, getAdjacentChapters } from "@/lib/content";
import { ChapterLayout } from "@/components/content/ChapterLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { PART_META } from "@/lib/types";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

const SITE_URL = "https://ai-field-notes.com";
const AUTHOR_NAME = "Filip van Harreveld";
const AUTHOR_URL = "https://filipvanharreveld.com/";

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
      siteName: "AI Field Notes",
      locale: "en_US",
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? publishedAt,
      section: partLabel,
      authors: [AUTHOR_URL],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subtitle,
      creator: "@fvanharreveld",
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.frontmatter.title,
    description: chapter.frontmatter.subtitle,
    image: [`${canonicalUrl}/opengraph-image`],
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
      name: "AI Field Notes",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: partMeta?.label,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Book",
      name: "AI Field Notes",
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
        name: partMeta?.label ?? "Contents",
        item: `${SITE_URL}/#contents`,
      },
      {
        "@type": "ListItem",
        position: 3,
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
