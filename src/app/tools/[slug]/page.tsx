import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOL_CATALOG } from "@/lib/toolCatalog";
import { discoveryMetadata } from "@/lib/discovery";
import { ToolFrame } from "@/components/ui/ToolFrame";
import { ToolRenderer } from "@/components/interactive/ToolRenderer";
import { Arrow } from "@/components/ui/Arrow";

export const dynamicParams = false;
export function generateStaticParams() {
  return TOOL_CATALOG.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!TOOL_CATALOG.some((tool) => tool.id === slug)) notFound();
  return discoveryMetadata(`/tools/${slug}`);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOL_CATALOG.find((entry) => entry.id === slug);
  if (!tool) notFound();
  return (
    <div className="site-shell discovery-page tool-page standalone-tool">
      <Link href="/tools" className="text-link">
        ← All tools
      </Link>
      <header className="page-heading mt-8">
        <p className="eyebrow">{tool.category}</p>
        <h1>{tool.title}</h1>
        <p className="editorial-lead">{tool.description}</p>
      </header>
      <div className="tool-intro">
        <p>{tool.instruction}</p>
        <span className="eyebrow">Free · Runs in your browser</span>
      </div>
      <h2 className="sr-only">Use {tool.title}</h2>
      <ToolFrame id={tool.id}>
        <ToolRenderer id={tool.id} />
      </ToolFrame>
      <aside className="tool-next-step">
        <div>
          <p className="eyebrow">Take it further</p>
          <h2>{tool.guideTitle}</h2>
        </div>
        <Link className="text-link" href={`/chapters/${tool.guide}`}>
          Read the companion guide <Arrow />
        </Link>
      </aside>
    </div>
  );
}
