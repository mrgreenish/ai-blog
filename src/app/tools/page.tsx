import Link from "next/link";
import { discoveryMetadata } from "@/lib/discovery";

export const metadata = discoveryMetadata("/tools");

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">AI Developer Tools</h1>
      <p className="editorial-lead mb-12">Turn a task into a practical workflow you can take back to your editor.</p>
      <section className="border-y border-border-default py-8">
        <h2 className="text-2xl font-semibold mb-4"><Link className="underline" href="/tools/ai-coding-workflow">AI Coding Workflow Finder and Recipes</Link></h2>
        <p className="text-fg-muted mb-4">Browse five recipes, or answer a few questions to find a starting point. Each includes steps, prompts, guardrails, and an expected output.</p>
        <p className="text-sm text-fg-muted">Free to use. No account or API key required. Copy the recipe and adapt it to your project.</p>
      </section>
      <p className="mt-8"><Link className="underline" href="/guides">Explore the guides behind the workflows →</Link></p>
    </div>
  );
}
