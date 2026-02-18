import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import { getArticle, getAllArticlePaths } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticlePaths()
    .filter((p) => p.category === "workflows")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("workflows", slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  };
}

export default async function WorkflowArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("workflows", slug);
  if (!article) notFound();

  const mdxSource = await serialize(article.content, {
    mdxOptions: {
      rehypePlugins: [[rehypePrettyCode as never, { theme: "github-dark-dimmed" }]],
    },
  });

  return (
    <ArticleLayout frontmatter={article.frontmatter} category="workflows">
      <MdxRenderer source={mdxSource} />
    </ArticleLayout>
  );
}
