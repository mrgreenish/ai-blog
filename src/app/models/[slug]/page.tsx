import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getArticle, getAllArticlePaths, getNextArticle } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import type { Metadata } from "next";
import type { ArticleFrontmatter } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticlePaths()
    .filter((p) => p.category === "models")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("models", slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  };
}

export default async function ModelArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("models", slug);
  if (!article) notFound();

  const nextArticle = getNextArticle("models", slug);

  const { content } = await compileMDX<ArticleFrontmatter>({
    source: article.content,
    components: MDX_COMPONENTS,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode as never, { theme: "github-dark-dimmed" }]],
      },
    },
  });

  return (
    <ArticleLayout frontmatter={article.frontmatter} category="models" nextArticle={nextArticle}>
      <div className="prose prose-zinc max-w-none">{content}</div>
    </ArticleLayout>
  );
}
