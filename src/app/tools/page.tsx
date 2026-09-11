import Link from "next/link";
import { discoveryMetadata } from "@/lib/discovery";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = discoveryMetadata("/tools");
const tools = [
  {
    title: "Model Picker",
    description: "Match a model to your task, constraints, and working style.",
    slug: "reasoning-vs-fast",
    id: "model-picker",
    category: "Model selection",
  },
  {
    title: "Cost Calculator",
    description: "Explore token costs and compare estimates across models.",
    slug: "reasoning-vs-fast",
    id: "cost-calculator",
    category: "Planning & costs",
  },
  {
    title: "Model Personalities",
    description:
      "Explore how different models approach a task and where they fit.",
    slug: "model-personalities",
    id: "model-tinder",
    category: "Model selection",
  },
  {
    title: "Scenario Lab",
    description:
      "Explore coding scenarios, model examples, and cost assumptions.",
    slug: "reasoning-vs-fast",
    id: "scenario-lab",
    category: "Practice & exploration",
  },
  {
    title: "Context & Cost Explorer",
    description:
      "Explore context windows, token budgets, and long-context pricing.",
    slug: "max-mode",
    id: "max-mode-viz",
    category: "Context strategy",
  },
  {
    title: "Model Mixer",
    description: "Map model choices to workflow steps and compare their cost.",
    slug: "reasoning-vs-fast",
    id: "model-mixer",
    category: "Planning & costs",
  },
];
export default function ToolsPage() {
  return (
    <div className="site-shell discovery-page">
      <header className="page-heading">
        <p className="eyebrow">
          <span className="status-dot" />
          The workbench
        </p>
        <h1>AI Developer Tools</h1>
        <p className="editorial-lead">
          Turn a task into a practical workflow you can take back to your
          editor.
        </p>
      </header>
      <section className="tool-feature">
        <div>
          <p className="eyebrow">Featured / Workflow finder</p>
          <h2>
            <Link href="/tools/ai-coding-workflow">
              AI Coding Workflow Finder and Recipes
            </Link>
          </h2>
          <p>
            Browse five recipes, or answer a few questions to find a starting
            point. Each includes steps, prompts, guardrails, and an expected
            output.
          </p>
        </div>
        <div className="tool-feature-aside">
          <Link
            href="/tools/ai-coding-workflow"
            className="action-link action-primary"
          >
            Find your workflow <Arrow />
          </Link>
          <p>
            Free to use. No account or API key required. Copy the recipe and
            adapt it to your project.
          </p>
        </div>
      </section>
      <div className="section-heading">
        <p className="eyebrow">Explore the instruments</p>
        <h2>A little less trial and error.</h2>
      </div>
      <div className="tool-grid">
        {tools.map((tool, index) => (
          <article className="tool-directory-card" key={tool.id}>
            <p className="eyebrow">
              {tool.category}
              <span>0{index + 1}</span>
            </p>
            <h2>
              <Link href={`/chapters/${tool.slug}#tool-${tool.id}`}>
                {tool.title}
              </Link>
            </h2>
            <p>{tool.description}</p>
            <Link
              className="text-link"
              href={`/chapters/${tool.slug}#tool-${tool.id}`}
            >
              Open tool in guide <Arrow diagonal />
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-10">
        <Link className="text-link" href="/guides">
          Explore the guides behind the workflows <Arrow />
        </Link>
      </p>
    </div>
  );
}
