import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { ChefHat } from "lucide-react";

const RECIPE_STEPS = [
  { label: "Prompt", value: "Describe the task with constraints and context" },
  { label: "Steps", value: "Plan → Code → Review → Tests → PR description" },
  { label: "Tools", value: "Cursor + Claude Code + GitHub Actions" },
  { label: "Guardrails", value: "No file deletions, stay in scope, ask before refactoring" },
  { label: "Expected output", value: "Working PR with passing CI and a clear description" },
];

function Preview() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-xs font-semibold text-zinc-300">
          Spec → PR
        </p>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-500">
          copy
        </span>
      </div>
      <div className="space-y-2">
        {RECIPE_STEPS.map((s) => (
          <div key={s.label} className="flex gap-3 text-xs">
            <span className="w-20 shrink-0 font-mono text-emerald-400">
              {s.label}
            </span>
            <span className="text-zinc-400">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkflowRecipe() {
  return (
    <InteractivePlaceholder
      icon={ChefHat}
      title="Workflow Recipe"
      tagline="Copy-pasteable flows I actually run as a developer"
      description="Each recipe covers: Prompt → Steps → Tools → Guardrails → Expected output. Toggle between model/tool variants to see how the same job changes depending on what you're using. Battle-tested, not theoretical."
      preview={<Preview />}
      accentColor="text-emerald-400"
      borderColor="border-emerald-400/30"
    />
  );
}
