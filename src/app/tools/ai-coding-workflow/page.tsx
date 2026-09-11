import Link from "next/link";
import { WorkflowRecipe } from "@/components/interactive/WorkflowRecipe";
import { discoveryMetadata, START_TASKS } from "@/lib/discovery";

export const metadata = discoveryMetadata("/tools/ai-coding-workflow");

export default function WorkflowPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/tools" className="text-sm underline">← All tools</Link>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mt-8 mb-6">AI Coding Workflow Finder and Recipes</h1>
      <p className="editorial-lead">Choose a workflow for a feature, bug fix, design handoff, or code review. Take the steps and prompts straight into your project.</p>
      <p className="text-sm text-fg-muted mt-4">Browse a recipe if you know your task, or select Help Me Choose for a guided recommendation. Copy the result as Markdown and replace the placeholders with your project context. Recommendations are starting points, not measured model rankings.</p>
      <WorkflowRecipe />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Put the workflow into practice</h2>
        <ul className="space-y-3">{START_TASKS.map((task) => <li key={task.slug}><Link className="underline" href={`/chapters/${task.slug}`}>{task.title}</Link> — {task.description}</li>)}</ul>
      </section>
      <section className="mt-12 prose prose-stone max-w-none">
        <h2>What should I do with the recipe?</h2>
        <p>Paste it into a task document or editor conversation. Supply your acceptance criteria, relevant files, and constraints. Ask for a plan, review the changes, and run the tests before merging.</p>
        <h2>Does this run an agent or change my code?</h2>
        <p>No. The finder selects from prepared workflows in your browser. You choose how to apply the resulting instructions.</p>
      </section>
    </div>
  );
}
