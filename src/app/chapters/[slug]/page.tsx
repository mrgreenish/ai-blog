import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllChapters, getChapter, getAdjacentChapters } from "@/lib/content";
import { ChapterLayout } from "@/components/content/ChapterLayout";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { PART_META } from "@/lib/types";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

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
  return {
    title: chapter.frontmatter.title,
    description: chapter.frontmatter.subtitle,
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

  return (
    <ChapterLayout chapter={chapter} partMeta={partMeta} prev={prev} next={next}>
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
