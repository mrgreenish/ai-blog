import Link from "next/link";
import { discoveryMetadata } from "@/lib/discovery";
import { Arrow } from "@/components/ui/Arrow";
import { TOOL_CATALOG, TOOL_CATEGORIES } from "@/lib/toolCatalog";

export const metadata = discoveryMetadata("/tools");
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
      <nav className="tool-category-nav" aria-label="Tool categories">
        {TOOL_CATEGORIES.map((category, index) => (
          <a key={category} href={`#category-${index}`}>
            {category} <Arrow diagonal />
          </a>
        ))}
      </nav>
      {TOOL_CATEGORIES.map((category, categoryIndex) => (
        <section
          key={category}
          id={`category-${categoryIndex}`}
          className="tool-category"
        >
          <h2 className="tool-category-title">{category}</h2>
          <div className="tool-grid">
            {TOOL_CATALOG.filter((tool) => tool.category === category).map(
              (tool, index) => (
                <article className="tool-directory-card" key={tool.id}>
                  <p className="eyebrow">
                    {tool.category}
                    <span>
                      {String(categoryIndex * 3 + index + 1).padStart(2, "0")}
                    </span>
                  </p>
                  <h3>
                    <Link href={`/tools/${tool.id}`}>{tool.title}</Link>
                  </h3>
                  <p>{tool.description}</p>
                  <p className="tool-outcome">
                    <span>You get</span>
                    {tool.outcome}
                  </p>
                  <Link
                    className="text-link"
                    href={`/tools/${tool.id}`}
                    aria-label={`Open ${tool.title}`}
                  >
                    Open tool <Arrow diagonal />
                  </Link>
                </article>
              ),
            )}
          </div>
        </section>
      ))}
      <p className="mt-10">
        <Link className="text-link" href="/guides">
          Explore the guides behind the workflows <Arrow />
        </Link>
      </p>
    </div>
  );
}
