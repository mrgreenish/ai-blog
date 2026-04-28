import Image from "next/image";
import type { Metadata } from "next";
import { SITE_LOCALE, SITE_NAME } from "@/lib/siteConfig";

const pageTitle = "AI Model Guidelines";
const pageDescription =
  "Opinionated guidelines for picking the right AI model, reasoning effort, and mode for different software tasks.";

const creativityScale = [
  {
    level: "1/5",
    title: "No creativity",
    description:
      "Clear implementation, small bug fix, rename, formatting, simple extraction.",
  },
  {
    level: "2/5",
    title: "Low creativity",
    description:
      "Straightforward coding where the desired outcome is already clear.",
  },
  {
    level: "3/5",
    title: "Medium creativity",
    description:
      "Some judgment is needed: component structure, copy improvements, UX details, refactors.",
  },
  {
    level: "4/5",
    title: "High creativity",
    description:
      "Writing, design, product ideas, architecture options, or exploring multiple solutions.",
  },
  {
    level: "5/5",
    title: "Very high creativity",
    description:
      "Open-ended strategy, major redesigns, brand voice, complex product decisions.",
  },
];

const modelRecommendations = [
  {
    title: "Complex tasks",
    description: "Use GPT-5.5 or Claude Opus 4.7.",
  },
  {
    title: "Medium tasks with creative work",
    description:
      "Use Claude Sonnet 4.6. It is usually a good balance for writing, UI ideas, refactoring, and judgment-heavy tasks.",
  },
  {
    title: "Medium tasks with low creativity",
    description:
      "Use Gemini 3.1 Pro or GPT-5.4. Good when you need competence and context, but not the absolute heaviest model.",
  },
  {
    title: "Simple, clearly defined tasks",
    description:
      "Use Gemini 3 Flash or Composer 2 Standard. Avoid Fast mode by default. Fast is quicker, but more expensive, and often not worth it if you can do something else while the model works.",
  },
];

const reasoningEffort = [
  {
    title: "Low",
    description: "Summaries, copy tweaks, simple Q&A, tiny code edits.",
  },
  {
    title: "Medium",
    description:
      "Normal coding tasks, modest refactors, article editing, UI improvements.",
  },
  {
    title: "High",
    description:
      "Multi-step debugging, architecture, tricky code changes, tests, data modeling.",
  },
  {
    title: "Highest",
    description:
      "Hard reasoning, complex bugs, legal/financial analysis, large cross-file changes, or anything where being wrong is expensive.",
  },
];

const promptChecklist = [
  "what you want",
  "why you want it",
  "what constraints matter",
  "what files or systems are relevant",
  "what good looks like",
  "ask the model to ask you questions if anything is unclear",
];

const modelPrices = [
  ["Composer 2 Standard", "$0.50 input / $2.50 output"],
  ["Composer 2 Fast", "$1.50 input / $7.50 output"],
  ["Gemini 3 Flash", "$0.50 input / $3 output"],
  ["Gemini 3.1 Pro", "$2 input / $12 output"],
  ["Claude Sonnet 4.6", "$3 input / $15 output"],
  ["GPT-5.4", "$2.50 input / $15 output"],
  ["GPT-5.5", "$5 input / $30 output"],
  ["Claude Opus 4.7", "$5 input / $25 output"],
  ["Claude Opus Fast", "around $30 input / $150 output"],
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/ai-model-guidelines",
  },
  openGraph: {
    type: "article",
    siteName: SITE_NAME,
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/ai-model-guidelines",
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
  },
};

function CardList({
  items,
}: {
  items: Array<{ title: string; description: string; level?: string }>;
}) {
  return (
    <div className="not-prose my-8 grid gap-4">
      {items.map((item) => (
        <div
          key={`${item.level ?? ""}${item.title}`}
          className="rounded-lg border border-border-default bg-bg-surface p-5"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder">
            {item.level ?? item.title}
          </p>
          {item.level && (
            <h3 className="mt-2 font-sans text-lg font-semibold tracking-tight text-fg-primary">
              {item.title}
            </h3>
          )}
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AiModelGuidelinesPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder mb-4">
          Working note
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-fg-primary leading-tight mb-4">
          AI Model Guidelines
        </h1>
        <p className="editorial-lead max-w-xl">
          Opinionated guidelines for picking the right model for the task.
        </p>
      </header>

      <div className="section-divider mb-12" />

      <div className="prose prose-stone max-w-none">
        <p>
          The short version: do not always use the smartest model, and do not
          always use the cheapest one. Pick the model that matches the task.
        </p>

        <p>
          A model that is too heavy wastes money. A model that is too light
          wastes time because you need more rounds, more corrections, and
          sometimes still get worse output.
        </p>

        <h2>Model Pick</h2>

        <p>Think about two things first:</p>

        <ol>
          <li>
            <strong>Complexity:</strong> how much reasoning, codebase context,
            or multi-step work does this need?
          </li>
          <li>
            <strong>Creativity:</strong> do we want the model to invent, write,
            design, or explore options?
          </li>
        </ol>

        <p>A practical creativity scale:</p>

        <CardList items={creativityScale} />

        <p>Recommended picks:</p>

        <CardList items={modelRecommendations} />

        <h2>Reasoning Effort</h2>

        <p>
          Reasoning effort is how hard the model should think before answering.
        </p>

        <figure className="not-prose my-8">
          <div className="overflow-hidden rounded-lg border border-border-default bg-bg-surface">
            <Image
              src="/images/cursor-reasoning-effort.png"
              alt="Cursor model menu showing reasoning effort options: None, Low, Medium, High, and Extra High."
              width={631}
              height={481}
              className="h-auto w-full"
            />
          </div>
          <figcaption className="figure-caption text-left">
            In Cursor, reasoning effort is set from the model menu. Choose the
            model first, then pick the context window and reasoning level for the
            task.
          </figcaption>
        </figure>

        <CardList items={reasoningEffort} />

        <p>
          Rule of thumb: match reasoning effort to the real risk of the task. Do
          not overthink a simple prompt. But do not underthink a task where a
          bad answer creates cleanup work.
        </p>

        <h2>Productivity, Performance, and Cost Tips</h2>

        <h3>Use Plan Mode</h3>

        <p>
          For complex tasks, start in Plan Mode with a stronger model. Let the
          model understand the problem, inspect the codebase, and decide the
          approach.
        </p>

        <p>
          Then switch to a lighter model for implementation if the plan is
          clear.
        </p>

        <p>Example:</p>

        <blockquote>
          <p>Create a new component in our application.</p>
        </blockquote>

        <p>Good approach:</p>

        <ul>
          <li>Plan with GPT-5.5 or Opus 4.7.</li>
          <li>Use medium or high reasoning depending on complexity.</li>
          <li>
            Implement with Sonnet 4.6, GPT-5.4, or Composer 2 if the work is
            straightforward.
          </li>
        </ul>

        <p>
          This often gives better results than immediately throwing a cheap
          model at a vague task.
        </p>

        <h3>Max Mode</h3>

        <p>Use Max Mode with caution.</p>

        <p>
          Do not be afraid of it. It is useful when the model needs a lot of
          context: large codebases, many files, long chats, big refactors, or
          deep debugging.
        </p>

        <p>
          But do not use Max Mode for small tasks. It can cost much more because
          the model reads and reasons over more tokens.
        </p>

        <p>
          Doing everything with Opus 4.7 in Max Mode can get really expensive
          very quickly. Do not do this by default. Use it only when the task
          truly benefits from deep context and stronger reasoning.
        </p>

        <h3>Fast Mode</h3>

        <p>Avoid Fast mode by default.</p>

        <p>
          It is convenient, but often more expensive. If the task is not urgent,
          standard mode is usually the better tradeoff. You can do other work
          while it runs.
        </p>

        <h3>Skills and Rules</h3>

        <p>
          Use skills and rules so the AI does not need to rediscover your whole
          workflow every time.
        </p>

        <p>Good rules can tell the model:</p>

        <ul>
          <li>how your project is structured</li>
          <li>which patterns to follow</li>
          <li>which files are important</li>
          <li>how to test changes</li>
          <li>what not to touch</li>
        </ul>

        <p>
          Also give context in the prompt. The better the context, the less the
          model has to guess.
        </p>

        <h3>Prompts</h3>

        <p>English prompts usually work a bit better than Dutch.</p>

        <p>For simple tasks, be direct.</p>

        <p>For complex tasks, explain:</p>

        <ul>
          {promptChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p>
          That last point helps a lot. It prevents the model from guessing when
          the task has missing context.
        </p>

        <h2>Example Pricing</h2>

        <p>
          Approximate Cursor model prices, per 1M tokens, as of April 2026:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-lg border border-border-default">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-bg-surface">
              <tr>
                <th className="border-b border-border-default px-4 py-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
                  Model
                </th>
                <th className="border-b border-border-default px-4 py-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
                  Price per 1M tokens
                </th>
              </tr>
            </thead>
            <tbody>
              {modelPrices.map(([model, price]) => (
                <tr key={model} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-medium text-fg-primary">
                    {model}
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          These examples ignore caching and plan-specific usage pools, so treat
          them as directionally useful, not exact invoices.
        </p>

        <h3>Example 1: Simple Task</h3>

        <p>Task: Rename this prop and update the few places it is used.</p>

        <p>Estimated usage: 20k input tokens, 2k output tokens.</p>

        <p>Approximate cost:</p>

        <ul>
          <li>Composer 2 Standard: about $0.02</li>
          <li>Gemini 3 Flash: about $0.02</li>
          <li>Gemini 3.1 Pro: about $0.06</li>
          <li>GPT-5.5: about $0.16</li>
          <li>Opus 4.7: about $0.15</li>
          <li>Claude Opus Fast: about $0.90</li>
        </ul>

        <p>
          Advice: do not use Opus or GPT-5.5 for this unless there is hidden
          complexity. Composer 2 Standard or Gemini Flash is enough.
        </p>

        <h3>Example 2: Medium Creative Task</h3>

        <p>Task: Improve this article section and make the examples clearer.</p>

        <p>Estimated usage: 80k input tokens, 8k output tokens.</p>

        <p>Approximate cost:</p>

        <ul>
          <li>Composer 2 Standard: about $0.06</li>
          <li>Composer 2 Fast: about $0.18</li>
          <li>Gemini 3.1 Pro: about $0.26</li>
          <li>Claude Sonnet 4.6: about $0.36</li>
          <li>GPT-5.4: about $0.32</li>
          <li>GPT-5.5: about $0.64</li>
          <li>Opus 4.7: about $0.60</li>
        </ul>

        <p>
          Advice: Sonnet 4.6 is probably the best fit here. It is strong
          creatively without jumping straight to the most expensive models.
        </p>

        <h3>Example 3: Complex Codebase Task</h3>

        <p>Task: Plan and implement a cross-file refactor with tests.</p>

        <p>Estimated usage:</p>

        <ul>
          <li>Planning phase: 300k input tokens, 20k output tokens</li>
          <li>Implementation phase: 120k input tokens, 20k output tokens</li>
        </ul>

        <p>Better approach:</p>

        <ul>
          <li>Plan in Plan Mode with Opus 4.7.</li>
          <li>
            Implement with Composer 2 Standard if the plan is clear and the
            implementation is straightforward.
          </li>
        </ul>

        <p>Approximate cost:</p>

        <ul>
          <li>Opus 4.7 planning: about $2.00</li>
          <li>Composer 2 Standard implementation: about $0.11</li>
          <li>Total: about $2.11</li>
        </ul>

        <p>Cheaper but riskier implementation option:</p>

        <ul>
          <li>Gemini 3 Flash implementation: about $0.12</li>
          <li>Total with Opus 4.7 planning: about $2.12</li>
        </ul>

        <p>Expensive version:</p>

        <ul>
          <li>Doing the whole task with Opus 4.7 in Max Mode: about $2.25 or more</li>
        </ul>

        <p>
          Advice: use the strong model where it matters most: understanding the
          problem, reading the codebase, and making the plan. Once the plan is
          clear, use a cheaper model for the mechanical implementation. Composer
          2 Standard is usually a better fit than Gemini 3 Flash for codebase
          implementation work, but Gemini Flash can be useful when the
          implementation is very mechanical and tightly specified.
        </p>

        <p>
          The real cost is not just token price. If a model is too weak, you may
          spend five extra rounds fixing bad assumptions. That can be more
          expensive than choosing the right model once.
        </p>
      </div>
    </article>
  );
}
