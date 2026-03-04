"use client";

import { useState } from "react";
import { ChefHat, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

interface RecipeStep {
  label: string;
  description: string;
}

interface Recipe {
  id: string;
  label: string;
  prompt: string;
  steps: RecipeStep[];
  tools: string[];
  guardrails: string[];
  output: string;
}

// --- Data ---

const RECIPES: Recipe[] = [
  {
    id: "spec-to-pr",
    label: "Spec \u2192 PR",
    prompt:
      "I need to build [feature]. Here\u2019s the spec: inputs, outputs, edge cases, constraints. Produce a plan before writing any code.",
    steps: [
      {
        label: "Spec",
        description:
          "Write a developer spec with inputs, outputs, edge cases, and constraints.",
      },
      {
        label: "Plan",
        description:
          "Ask the model to produce a plan \u2014 files to create/modify, key decisions. Review before coding.",
      },
      {
        label: "Code",
        description:
          "Implement against the plan. One feature, one PR. Pull the model back if it goes out of scope.",
      },
      {
        label: "Review",
        description:
          'Ask the model to review its own code: "What edge cases might this miss? What would break this?"',
      },
      {
        label: "Tests",
        description:
          'Generate tests from the review\u2019s edge cases: "Write tests for the edge cases you identified."',
      },
      {
        label: "PR description",
        description:
          "Generate the PR description from the spec and the diff. Full context produces clear descriptions.",
      },
    ],
    tools: ["Cursor", "Claude Code", "GitHub Actions"],
    guardrails: [
      "One feature, one PR \u2014 keep scope tight",
      "Review the plan before writing code",
      "Don\u2019t let the model touch files outside scope",
      "Ask before refactoring adjacent code",
    ],
    output:
      "Working PR with passing CI, clear description, and tests covering the identified edge cases.",
  },
  {
    id: "bug-to-fix",
    label: "Bug \u2192 Fix",
    prompt:
      "I have a bug: [description]. Expected: [X]. Actual: [Y]. Here\u2019s a minimal repro: [code].",
    steps: [
      {
        label: "Reproduce",
        description:
          "Reliably reproduce the bug. If you can\u2019t reproduce it, start there.",
      },
      {
        label: "Isolate",
        description:
          "Strip away everything unnecessary. Reduce to the smallest case that still shows the bug.",
      },
      {
        label: "Diagnose",
        description:
          'With the minimal repro, ask: "Here\u2019s a minimal example that demonstrates the bug. What\u2019s causing it?"',
      },
      {
        label: "Fix",
        description:
          "Implement the fix narrowly \u2014 fix the specific bug, don\u2019t refactor adjacent code.",
      },
      {
        label: "Regression test",
        description:
          "Write a test that would have caught this bug. Prevents it from coming back.",
      },
    ],
    tools: ["Cursor", "Claude Code"],
    guardrails: [
      "Always create a minimal repro first",
      "Keep the fix narrow \u2014 one bug, one fix",
      'Ask "why does this fix work?" \u2014 if the explanation doesn\u2019t make sense, the fix might be wrong',
      "Don\u2019t refactor adjacent code in the same PR",
    ],
    output:
      "Targeted fix with a regression test that would have caught the original bug.",
  },
  {
    id: "ai-code-review",
    label: "AI Review",
    prompt:
      "Review this PR for bugs, type safety issues, missing edge cases, and security concerns.",
    steps: [
      {
        label: "Open PR",
        description:
          "Push your changes and open (or update) the pull request with a clear description.",
      },
      {
        label: "Run AI review",
        description:
          "Run BugBot or Codex review. Let it scan for type errors, null checks, security issues, and inconsistencies.",
      },
      {
        label: "Triage findings",
        description:
          "Review each finding. Treat them as suggestions \u2014 some are valid, some are false positives.",
      },
      {
        label: "Fix valid issues",
        description:
          "Address the real issues. Ignore out-of-scope refactor suggestions.",
      },
      {
        label: "Human review",
        description:
          "Request human review with mechanical issues already resolved.",
      },
    ],
    tools: ["Cursor BugBot", "Codex on GitHub", "GitHub PR"],
    guardrails: [
      "Treat AI findings as suggestions, not mandates",
      "Ignore out-of-scope refactor suggestions",
      "Verify fixes don\u2019t introduce new issues",
      "AI catches mechanical bugs \u2014 humans review business logic",
    ],
    output:
      "Clean PR with mechanical issues resolved before human review begins.",
  },
  {
    id: "design-to-storybook",
    label: "Design \u2192 SB",
    prompt:
      "Implement this Figma component: [Figma link]. Use our design tokens and existing atoms.",
    steps: [
      {
        label: "Design tokens",
        description:
          "Map Figma variables to your Tailwind config or CSS custom properties.",
      },
      {
        label: "Component spec",
        description:
          "Use Figma MCP to pull properties, variants, and constraints. Generate a TypeScript interface.",
      },
      {
        label: "Implementation",
        description:
          "Build the component against the spec. The model has actual design values \u2014 no guessing from screenshots.",
      },
      {
        label: "Storybook stories",
        description:
          "Generate stories for each variant defined in Figma. Covers all combinations of size, color, and state.",
      },
      {
        label: "Visual review",
        description:
          "Compare Storybook output against the Figma design. Use Figma MCP for side-by-side verification.",
      },
    ],
    tools: ["Figma MCP", "Cursor", "Storybook"],
    guardrails: [
      "Use actual token values, not guessed ones",
      "Reuse existing atoms \u2014 don\u2019t create duplicates",
      "Generate stories for all variants, not just the default",
      "Verify spacing and color against Figma, not screenshots",
    ],
    output:
      "Production component with typed props, matching design tokens, and Storybook stories for every variant.",
  },
  {
    id: "jira-to-cursor",
    label: "Jira \u2192 PR",
    prompt:
      "Implement this ticket: [scope, acceptance criteria, edge cases]. Figma design: [link].",
    steps: [
      {
        label: "Generate ticket",
        description:
          "Use AI to generate a Jira ticket with scope, acceptance criteria, edge cases, and analytics from a brief description.",
      },
      {
        label: "Set up context",
        description:
          "Paste the ticket into Cursor. Add the Figma link. Keep Figma Desktop open for MCP access.",
      },
      {
        label: "Plan",
        description:
          "Let the model plan the implementation using ticket scope as boundaries and acceptance criteria as checkpoints.",
      },
      {
        label: "Implement",
        description:
          "Build against the plan. Acceptance criteria become test cases, edge cases become guardrails.",
      },
      {
        label: "PR from criteria",
        description:
          "Write the PR description from the ticket\u2019s acceptance criteria. It maps directly to what was built.",
      },
    ],
    tools: ["AI ticket generator", "Cursor", "Figma MCP", "GitHub"],
    guardrails: [
      "Acceptance criteria become test cases",
      "Edge cases from the ticket become guardrails",
      "Stay within ticket scope \u2014 out-of-scope work gets its own ticket",
      "Keep Figma Desktop open during the session",
    ],
    output:
      "PR that maps directly to ticket acceptance criteria with design-accurate implementation.",
  },
  {
    id: "building-blocks",
    label: "Blocks",
    prompt:
      "Build [component/feature] using only existing atoms and molecules. Check what exists first.",
    steps: [
      {
        label: "Audit",
        description:
          "Check existing atoms, molecules, and organisms. Know what\u2019s available before building anything new.",
      },
      {
        label: "Plan composition",
        description:
          "Identify what to reuse vs. what to create. New atoms only when nothing existing fits.",
      },
      {
        label: "Build atoms first",
        description:
          "If new primitives are needed, build them first. Typed props, defined variants, no business logic.",
      },
      {
        label: "Compose up",
        description:
          "Assemble atoms into molecules, molecules into organisms. Each layer only uses the layer below.",
      },
      {
        label: "Storybook stories",
        description:
          "Generate stories for each new component. Cover default state, variants, and edge cases.",
      },
    ],
    tools: ["Cursor with project rules", "Storybook", "cva"],
    guardrails: [
      "One component, one job \u2014 split if it does two things",
      "Typed props always \u2014 TypeScript interfaces for every component",
      "Variants over conditionals \u2014 use cva patterns",
      "Shared tokens only \u2014 no hardcoded colors or spacing",
      "Naming describes function \u2014 PriceBadge, not Badge2",
    ],
    output:
      "New component composed from existing building blocks with typed props, defined variants, and Storybook coverage.",
  },
];

// --- Helpers ---

function formatRecipeAsMarkdown(recipe: Recipe): string {
  const lines: string[] = [];
  lines.push(`# ${recipe.label}`);
  lines.push("");
  lines.push("## Prompt");
  lines.push(recipe.prompt);
  lines.push("");
  lines.push("## Steps");
  recipe.steps.forEach((step, i) => {
    lines.push(`${i + 1}. **${step.label}** \u2014 ${step.description}`);
  });
  lines.push("");
  lines.push("## Tools");
  lines.push(recipe.tools.join(", "));
  lines.push("");
  lines.push("## Guardrails");
  recipe.guardrails.forEach((g) => {
    lines.push(`- ${g}`);
  });
  lines.push("");
  lines.push("## Expected output");
  lines.push(recipe.output);
  return lines.join("\n");
}

// --- Sub-components ---

function CopyButton({
  recipe,
}: {
  recipe: Recipe;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = formatRecipeAsMarkdown(recipe);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
        copied
          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-emerald-400/50 hover:text-emerald-300"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy recipe
        </>
      )}
    </button>
  );
}

function StepFlow({ steps }: { steps: RecipeStep[] }) {
  return (
    <div className="relative ml-2.5 border-l border-emerald-400/20 pl-5">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          className={`relative ${i < steps.length - 1 ? "pb-3" : ""}`}
        >
          {/* Step number dot on the line */}
          <div className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/30 bg-zinc-900 font-mono text-[10px] font-medium text-emerald-400">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{step.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400/70">
      {children}
    </p>
  );
}

// --- Main component ---

export function WorkflowRecipe() {
  const [recipeId, setRecipeId] = useState(RECIPES[0].id);
  const recipe = RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-emerald-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-emerald-400">
          <ChefHat className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-emerald-400">
            Workflow Recipe
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Copy-pasteable flows I actually run as a developer
          </p>
        </div>
      </div>

      {/* Recipe selector */}
      <div className="border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-zinc-500">
          Pick a workflow
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {RECIPES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRecipeId(r.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                r.id === recipeId
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe content */}
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-5"
          >
            {/* Prompt */}
            <div>
              <FieldLabel>Prompt</FieldLabel>
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-3 py-2.5">
                <p className="font-mono text-xs leading-relaxed text-zinc-300">
                  {recipe.prompt}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div>
              <FieldLabel>Steps</FieldLabel>
              <StepFlow steps={recipe.steps} />
            </div>

            {/* Tools */}
            <div>
              <FieldLabel>Tools</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {recipe.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Guardrails */}
            <div>
              <FieldLabel>Guardrails</FieldLabel>
              <ul className="space-y-1.5">
                {recipe.guardrails.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/40" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected output */}
            <div>
              <FieldLabel>Expected output</FieldLabel>
              <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5">
                <p className="text-xs leading-relaxed text-zinc-300">
                  {recipe.output}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900/40 px-3 py-3 sm:px-5">
        <p className="text-[11px] text-zinc-600">
          Paste into CLAUDE.md, .cursorrules, or your workflow docs
        </p>
        <CopyButton recipe={recipe} />
      </div>
    </div>
  );
}
