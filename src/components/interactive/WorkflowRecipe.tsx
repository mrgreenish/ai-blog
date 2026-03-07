"use client";

import { useState } from "react";
import { ChefHat, TreeDeciduous, RotateCcw, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  resolveTreePath,
  formatResultAsMarkdown,
  type TreeResult,
  type TreeNode,
} from "@/lib/decisionTreeData";
import {
  CopyButton,
  FieldLabel,
  GuardrailList,
  StepFlow,
  ModeToggle,
} from "@/components/ui/WorkflowPrimitives";

type RecipeMode = "browse" | "choose";

const RECIPE_MODE_OPTIONS = [
  { id: "browse" as const, label: "Browse Recipes", icon: ChefHat },
  { id: "choose" as const, label: "Help Me Choose", icon: TreeDeciduous },
] as const;

// =============================================================================
// Browse Recipes mode (original WorkflowRecipe)
// =============================================================================

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
        label: "Token skill",
        description:
          "Create a SKILL.md that documents how Figma tokens map to your Tailwind config and CSS custom properties. This gives the model persistent context for all future design-to-code work.",
      },
      {
        label: "Design tokens",
        description:
          "Use the skill to map Figma variables to your existing Tailwind tokens. The skill tells the model which Figma token names correspond to which Tailwind classes and CSS variables.",
      },
      {
        label: "Component spec",
        description:
          "Use Figma MCP to pull properties, variants, and constraints. Generate a TypeScript interface.",
      },
      {
        label: "Implementation",
        description:
          "Build the component against the spec. The model has actual design values and the token mapping skill \u2014 no guessing from screenshots.",
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
    tools: ["Figma MCP", "Cursor", "Storybook", "SKILL.md"],
    guardrails: [
      "Create the token skill once \u2014 reuse it across all design-to-code tasks",
      "Use actual token values, not guessed ones",
      "Reuse existing atoms \u2014 don\u2019t create duplicates",
      "Generate stories for all variants, not just the default",
      "Verify spacing and color against Figma, not screenshots",
    ],
    output:
      "Token-mapping skill for persistent AI context, plus a production component with typed props, matching design tokens, and Storybook stories for every variant.",
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

function BrowseRecipes() {
  const [recipeId, setRecipeId] = useState(RECIPES[0].id);
  const recipe = RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0];

  return (
    <>
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
              <FieldLabel accentColor="emerald">Prompt</FieldLabel>
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-3 py-2.5">
                <p className="font-mono text-xs leading-relaxed text-zinc-300">
                  {recipe.prompt}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div>
              <FieldLabel accentColor="emerald">Steps</FieldLabel>
              <StepFlow steps={recipe.steps} accentColor="emerald" />
            </div>

            {/* Tools */}
            <div>
              <FieldLabel accentColor="emerald">Tools</FieldLabel>
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
              <FieldLabel accentColor="emerald">Guardrails</FieldLabel>
              <GuardrailList items={recipe.guardrails} accentColor="emerald" />
            </div>

            {/* Expected output */}
            <div>
              <FieldLabel accentColor="emerald">Expected output</FieldLabel>
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
        <CopyButton
          getText={() => formatRecipeAsMarkdown(recipe)}
          label="Copy recipe"
          accentColor="emerald"
        />
      </div>
    </>
  );
}

// =============================================================================
// Help Me Choose mode (absorbed from DecisionTree)
// =============================================================================

function Breadcrumbs({
  crumbs,
  onNavigate,
}: {
  crumbs: { optionId: string; label: string }[];
  onNavigate: (index: number) => void;
}) {
  if (crumbs.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <button
        onClick={() => onNavigate(-1)}
        className="text-zinc-500 transition-colors hover:text-teal-400"
      >
        Start
      </button>
      {crumbs.map((crumb, i) => (
        <span key={crumb.optionId} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          {i < crumbs.length - 1 ? (
            <button
              onClick={() => onNavigate(i)}
              className="text-zinc-500 transition-colors hover:text-teal-400"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-teal-400">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function QuestionStep({
  node,
  onAnswer,
}: {
  node: TreeNode;
  onAnswer: (optionId: string) => void;
}) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <p className="text-base font-semibold text-zinc-100">{node.question}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {node.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.id)}
            className="group flex flex-col items-start rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-all hover:border-teal-500/50 hover:bg-teal-500/5 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
              {opt.label}
            </span>
            <span className="mt-0.5 text-xs text-zinc-500 group-hover:text-zinc-400">
              {opt.description}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ResultCard({
  result,
  onRestart,
}: {
  result: TreeResult;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      {/* Header card */}
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
        <div className="flex h-24 items-center justify-center bg-linear-to-br from-teal-500/20 to-cyan-500/20">
          <span className="text-5xl">{result.emoji}</span>
        </div>
        <div className="p-4">
          <div className="mb-1 flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-bold text-white">{result.title}</h3>
            <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-400">
              {result.model}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            {result.description}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <FieldLabel accentColor="teal">Steps</FieldLabel>
        <StepFlow steps={result.steps} accentColor="teal" />
      </div>

      {/* Tools */}
      <div>
        <FieldLabel accentColor="teal">Tools</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {result.tools.map((tool) => (
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
        <FieldLabel accentColor="teal">Guardrails</FieldLabel>
        <GuardrailList items={result.guardrails} accentColor="teal" />
      </div>

      {/* Expected output */}
      <div>
        <FieldLabel accentColor="teal">Expected output</FieldLabel>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-zinc-300">
            {result.output}
          </p>
        </div>
      </div>

      {/* Article link */}
      <Link
        href={result.articleLink.href}
        className="flex items-center justify-between rounded-lg border border-teal-400/30 bg-teal-400/5 px-4 py-3 transition-colors hover:border-teal-400/50 hover:bg-teal-400/10"
      >
        <div>
          <p className="text-xs text-zinc-500">Read the full guide</p>
          <p className="text-sm font-medium text-teal-300">
            {result.articleLink.label}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-teal-400" />
      </Link>

      {/* Related links */}
      {result.relatedLinks && result.relatedLinks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-500">Also relevant</p>
          {result.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <span className="min-w-0 flex-1 text-sm text-zinc-400">
                {link.label}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
        <CopyButton
          getText={() => formatResultAsMarkdown(result)}
          label="Copy workflow"
          accentColor="teal"
        />
      </div>
    </motion.div>
  );
}

function HelpMeChoose() {
  const [path, setPath] = useState<string[]>([]);

  const { node, result, breadcrumbs } = resolveTreePath(path);

  const handleAnswer = (optionId: string) => {
    setPath((prev) => [...prev, optionId]);
  };

  const handleBack = () => {
    if (path.length === 0) return;
    setPath((prev) => prev.slice(0, -1));
  };

  const handleRestart = () => {
    setPath([]);
  };

  const handleNavigate = (index: number) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="border-b border-zinc-800 px-3 py-2.5 sm:px-5">
          <Breadcrumbs crumbs={breadcrumbs} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Content */}
      <div className="px-3 py-5 sm:px-5">
        <AnimatePresence mode="wait">
          {result ? (
            <ResultCard
              key="result"
              result={result}
              onRestart={handleRestart}
            />
          ) : node ? (
            <QuestionStep
              key={node.id}
              node={node}
              onAnswer={handleAnswer}
            />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Back / footer */}
      {!result && path.length > 0 && (
        <div className="border-t border-zinc-800 px-3 py-3 sm:px-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      )}
    </>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function WorkflowRecipe({ initialMode = "browse" }: { initialMode?: RecipeMode }) {
  const [mode, setMode] = useState<RecipeMode>(initialMode);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-emerald-400/30 bg-zinc-950">
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
            Copy-pasteable flows and guided workflow finder
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} options={RECIPE_MODE_OPTIONS} accent="emerald" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {mode === "browse" ? <BrowseRecipes /> : <HelpMeChoose />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
