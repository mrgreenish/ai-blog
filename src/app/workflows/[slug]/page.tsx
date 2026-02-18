import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getArticle, getAllArticlePaths } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { ModelPicker } from "@/components/interactive/ModelPicker";
import { ModelMixer } from "@/components/interactive/ModelMixer";
import { WorkflowRecipe } from "@/components/interactive/WorkflowRecipe";
import { PromptLab } from "@/components/interactive/PromptLab";
import { FailureGallery } from "@/components/interactive/FailureGallery";
import { DevBenchmark } from "@/components/interactive/DevBenchmark";
import { ConfigGenerator } from "@/components/interactive/ConfigGenerator";
import { CostCalculator } from "@/components/interactive/CostCalculator";
import { DiffViewer } from "@/components/interactive/DiffViewer";
import { ContextWindowViz } from "@/components/interactive/ContextWindowViz";
import type { Metadata } from "next";
import type { ArticleFrontmatter } from "@/lib/types";

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

  const { content } = await compileMDX<ArticleFrontmatter>({
    source: article.content,
    components: {
      ModelPicker,
      ModelMixer,
      WorkflowRecipe,
      PromptLab,
      FailureGallery,
      DevBenchmark,
      ConfigGenerator,
      CostCalculator,
      DiffViewer,
      ContextWindowViz,
    },
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode as never, { theme: "github-dark-dimmed" }]],
      },
    },
  });

  return (
    <ArticleLayout frontmatter={article.frontmatter} category="workflows">
      <div className="prose prose-zinc max-w-none">{content}</div>
    </ArticleLayout>
  );
}
