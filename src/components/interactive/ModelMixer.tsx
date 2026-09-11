"use client";

import { useState, useId, useMemo } from "react";
import { Shuffle, Calculator, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { QuickEstimate } from "./QuickEstimate";
import {
  getMixerModels,
  estimateModelCost,
  PRICING_META,
} from "@/lib/modelSpecs";
import type { Tier } from "@/lib/modelSpecs";
import { ModeToggle, CopyButton } from "@/components/ui/WorkflowPrimitives";

type MixerMode = "estimate" | "pipeline";

const MIXER_MODE_OPTIONS = [
  { id: "estimate" as const, label: "Quick Estimate", icon: Calculator },
  { id: "pipeline" as const, label: "Pipeline Builder", icon: Shuffle },
] as const;

// =============================================================================
// Quick Estimate mode (absorbed from CostCalculator)
// =============================================================================

// =============================================================================
// Pipeline Builder mode (original ModelMixer)
// =============================================================================

interface Model {
  id: string;
  name: string;
  provider: string;
  tier: Tier;
  inputPer1M: number;
  outputPer1M: number;
}

interface PipelineStep {
  id: string;
  label: string;
  description: string;
  defaultTier: Tier;
  defaultModelId: string;
  recommendedModelId: string;
  inputTokens: number;
  outputTokens: number;
}

interface Template {
  id: string;
  label: string;
  steps: PipelineStep[];
}

const MODELS: Model[] = getMixerModels();

const MODEL_BY_ID = Object.fromEntries(MODELS.map((m) => [m.id, m]));

// Pre-compute grouped models for ModelSelect to avoid re-filtering on every render
const MODELS_BY_TIER = Object.groupBy(MODELS, (m) => m.tier) as Record<
  Tier,
  Model[]
>;

const TEMPLATES: Template[] = [
  {
    id: "fullstack",
    label: "Full-stack feature",
    steps: [
      {
        id: "scaffold",
        label: "Scaffold",
        description: "Component structure, boilerplate, file setup",
        defaultTier: "balanced",
        defaultModelId: "gpt-5.6-terra",
        recommendedModelId: "gpt-5.6-terra",
        inputTokens: 1000,
        outputTokens: 2000,
      },
      {
        id: "logic",
        label: "Business logic",
        description: "Core feature logic, edge cases, state",
        defaultTier: "balanced",
        defaultModelId: "gpt-5.6-terra",
        recommendedModelId: "gpt-5.6-terra",
        inputTokens: 2000,
        outputTokens: 3000,
      },
      {
        id: "review",
        label: "Code review",
        description: "Architecture, patterns, security concerns",
        defaultTier: "reasoning",
        defaultModelId: "gpt-5.6-sol",
        recommendedModelId: "gpt-5.6-sol",
        inputTokens: 3000,
        outputTokens: 1000,
      },
      {
        id: "tests",
        label: "Tests",
        description: "Unit tests, edge case coverage",
        defaultTier: "balanced",
        defaultModelId: "gpt-5.6-terra",
        recommendedModelId: "gpt-5.6-terra",
        inputTokens: 1500,
        outputTokens: 2500,
      },
    ],
  },
  {
    id: "bugfix",
    label: "Bug investigation",
    steps: [
      {
        id: "reproduce",
        label: "Reproduce",
        description: "Isolate the failing case, minimal repro",
        defaultTier: "fast",
        defaultModelId: "gpt-5.6-luna",
        recommendedModelId: "gpt-5.6-luna",
        inputTokens: 1000,
        outputTokens: 1000,
      },
      {
        id: "diagnose",
        label: "Diagnose",
        description: "Trace root cause through execution path",
        defaultTier: "reasoning",
        defaultModelId: "gpt-5.6-sol",
        recommendedModelId: "gpt-5.6-sol",
        inputTokens: 2500,
        outputTokens: 2000,
      },
      {
        id: "fix",
        label: "Fix",
        description: "Implement the targeted fix",
        defaultTier: "balanced",
        defaultModelId: "gpt-5.6-terra",
        recommendedModelId: "gpt-5.6-terra",
        inputTokens: 2000,
        outputTokens: 2500,
      },
      {
        id: "verify",
        label: "Verify",
        description: "Confirm fix, check for regressions",
        defaultTier: "fast",
        defaultModelId: "gpt-5.6-luna",
        recommendedModelId: "gpt-5.6-luna",
        inputTokens: 1500,
        outputTokens: 1000,
      },
    ],
  },
  {
    id: "spec-to-pr",
    label: "Spec to PR",
    steps: [
      {
        id: "plan",
        label: "Plan",
        description: "Break spec into files, decisions, approach",
        defaultTier: "reasoning",
        defaultModelId: "claude-fable-5.1",
        recommendedModelId: "claude-fable-5.1",
        inputTokens: 1500,
        outputTokens: 2000,
      },
      {
        id: "implement",
        label: "Implement",
        description: "Write the code against the plan",
        defaultTier: "balanced",
        defaultModelId: "gpt-5.6-terra",
        recommendedModelId: "gpt-5.6-terra",
        inputTokens: 2000,
        outputTokens: 4000,
      },
      {
        id: "review-arch",
        label: "Review",
        description: "Architecture review, catch mistakes",
        defaultTier: "reasoning",
        defaultModelId: "gpt-5.6-sol",
        recommendedModelId: "gpt-5.6-sol",
        inputTokens: 4000,
        outputTokens: 1500,
      },
      {
        id: "pr-desc",
        label: "PR description",
        description: "Write PR description from spec + diff",
        defaultTier: "fast",
        defaultModelId: "gpt-5.6-luna",
        recommendedModelId: "gpt-5.6-luna",
        inputTokens: 2000,
        outputTokens: 1000,
      },
    ],
  },
];

// --- Helpers ---

const TIER_COLORS: Record<
  Tier,
  { text: string; bg: string; border: string; label: string }
> = {
  fast: {
    text: "text-emerald-600",
    bg: "bg-emerald-400/10",
    border: "border-emerald-500/30",
    label: "fast",
  },
  balanced: {
    text: "text-blue-600",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    label: "balanced",
  },
  reasoning: {
    text: "text-violet-600",
    bg: "bg-violet-400/10",
    border: "border-violet-500/30",
    label: "reasoning",
  },
};

function calcStepCost(model: Model, step: PipelineStep): number {
  return estimateModelCost(model.id, step.inputTokens, step.outputTokens);
}

function calcTotalCost(
  assignments: Record<string, string>,
  steps: PipelineStep[],
): number {
  return steps.reduce((sum, step) => {
    const model = MODEL_BY_ID[assignments[step.id]];
    return sum + (model ? calcStepCost(model, step) : 0);
  }, 0);
}

function formatCost(cost: number): string {
  return cost > 0 && cost < 0.0001 ? "<$0.0001" : `$${cost.toFixed(4)}`;
}

// --- Sub-components ---

function TierBadge({ tier }: { tier: Tier }) {
  const c = TIER_COLORS[tier];
  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${c.text} ${c.bg}`}
    >
      {c.label}
    </span>
  );
}

function ModelSelect({
  stepId,
  label,
  value,
  onChange,
}: {
  stepId: string;
  label: string;
  value: string;
  onChange: (stepId: string, modelId: string) => void;
}) {
  const selected = MODEL_BY_ID[value];
  const tier = selected?.tier ?? "fast";
  const colors = TIER_COLORS[tier];

  return (
    <div className="relative">
      <select
        aria-label={`Model for ${label}`}
        name={stepId}
        value={value}
        onChange={(e) => onChange(stepId, e.target.value)}
        className={`w-full appearance-none rounded-md border ${colors.border} ${colors.bg} py-1.5 pl-2.5 pr-7 font-mono text-xs ${colors.text} focus:outline-none focus:ring-1 focus:ring-current cursor-pointer`}
      >
        {(["fast", "balanced", "reasoning"] as Tier[]).map((t) => (
          <optgroup key={t} label={`── ${t} ──`}>
            {(MODELS_BY_TIER[t] ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-fg-secondary" />
    </div>
  );
}

function StepCard({
  step,
  modelId,
  onModelChange,
  className,
}: {
  step: PipelineStep;
  modelId: string;
  onModelChange: (stepId: string, modelId: string) => void;
  className?: string;
}) {
  const model = MODEL_BY_ID[modelId];
  const cost = model ? calcStepCost(model, step) : 0;
  const tier = model?.tier ?? step.defaultTier;
  const colors = TIER_COLORS[tier];

  return (
    <div
      className={`min-w-0 flex-1 rounded-lg border ${colors.border} ${colors.bg} p-2.5 sm:p-3 ${className || ""}`}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <p className="font-mono text-xs font-semibold text-fg-primary">
          {step.label}
        </p>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {modelId === step.recommendedModelId && (
            <span className="rounded px-1 py-0.5 font-mono text-[10px] font-medium leading-none text-violet-600 bg-violet-400/10">
              my pick
            </span>
          )}
          <TierBadge tier={tier} />
        </div>
      </div>
      <p className="mb-2 text-[11px] leading-relaxed line-clamp-2 text-fg-secondary">
        {step.description}
      </p>
      <ModelSelect
        label={step.label}
        stepId={step.id}
        value={modelId}
        onChange={onModelChange}
      />
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-fg-secondary">
        <span>
          {step.inputTokens / 1000}K in / {step.outputTokens / 1000}K out
        </span>
        <span className={`font-mono font-medium ${colors.text}`}>
          {formatCost(cost)}
        </span>
      </div>
    </div>
  );
}

function PipelineCostBar({
  label,
  cost,
  maxCost,
  colorClass,
  isMixed,
}: {
  label: string;
  cost: number;
  maxCost: number;
  colorClass: string;
  isMixed?: boolean;
}) {
  const pct = maxCost > 0 ? (cost / maxCost) * 100 : 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-20 shrink-0 text-right font-mono text-[11px] sm:w-28 sm:text-xs text-fg-secondary">
        {label}
      </div>
      <div className="relative h-5 flex-1 overflow-hidden rounded bg-bg-elevated">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded ${colorClass} ${isMixed ? "opacity-90" : "opacity-40"}`}
          style={{ width: `${pct}%` }}
        />
        <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-fg-primary">
          ${cost.toFixed(4)}/run
        </span>
      </div>
    </div>
  );
}

function PipelineBuilder() {
  const prefix = useId();
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);
  const [assignments, setAssignments] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const init: Record<string, Record<string, string>> = {};
    for (const t of TEMPLATES) {
      init[t.id] = Object.fromEntries(
        t.steps.map((s) => [s.id, s.defaultModelId]),
      );
    }
    return init;
  });

  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const currentAssignments = assignments[templateId];

  function handleModelChange(stepId: string, modelId: string) {
    setAssignments((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], [stepId]: modelId },
    }));
  }

  const [retries, setRetries] = useState(1);
  const [mixedAttempts, setMixedAttempts] = useState(1);

  const mixedCost =
    calcTotalCost(currentAssignments, template.steps) * mixedAttempts;

  // These only depend on the template, not on user model assignments or retries.
  const sonnetCostBase = useMemo(
    () =>
      calcTotalCost(
        Object.fromEntries(template.steps.map((s) => [s.id, "sonnet-5"])),
        template.steps,
      ),
    [template],
  );
  const fableCostBase = useMemo(
    () =>
      calcTotalCost(
        Object.fromEntries(
          template.steps.map((s) => [s.id, "claude-fable-5.1"]),
        ),
        template.steps,
      ),
    [template],
  );

  // Both approaches use explicit attempt assumptions; costs do not predict success.
  const sonnetCost = sonnetCostBase * retries;
  const fableCost = fableCostBase * retries;

  const savingsVsSonnet =
    sonnetCost > 0
      ? Math.round(((sonnetCost - mixedCost) / sonnetCost) * 100)
      : 0;
  const savingsVsFable =
    fableCost > 0 ? Math.round(((fableCost - mixedCost) / fableCost) * 100) : 0;
  const maxCost = Math.max(mixedCost, sonnetCost, fableCost);

  return (
    <>
      {/* Template selector */}
      <div className="px-3 py-2.5 sm:px-5 sm:py-3 border-b border-border-default">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              aria-pressed={t.id === templateId}
              onClick={() => setTemplateId(t.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                t.id === templateId
                  ? "border-violet-500/50 bg-violet-400/10 text-violet-600"
                  : ""
              }`}
              style={
                t.id !== templateId
                  ? {
                      borderColor: "var(--color-border-strong)",
                      color: "var(--color-fg-secondary)",
                    }
                  : undefined
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 sm:px-5">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {template.steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={{ ...step, label: `${index + 1}. ${step.label}` }}
              modelId={currentAssignments[step.id]}
              onModelChange={handleModelChange}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 bg-bg-surface border-t border-border-default">
        <p className="mb-3 font-mono text-xs font-semibold text-fg-secondary">
          Estimated cost per completed workflow
        </p>
        <div className="space-y-2">
          <PipelineCostBar
            label="Mixed pipeline"
            cost={mixedCost}
            maxCost={maxCost}
            colorClass="bg-violet-400"
            isMixed
          />
          <PipelineCostBar
            label={
              retries === 1
                ? "All Sonnet 5"
                : `All Sonnet (${retries} attempts)`
            }
            cost={sonnetCost}
            maxCost={maxCost}
            colorClass="bg-blue-400"
          />
          <PipelineCostBar
            label={
              retries === 1
                ? "All Fable 5.1"
                : `All Fable (${retries} attempts)`
            }
            cost={fableCost}
            maxCost={maxCost}
            colorClass="bg-stone-300"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-fg-secondary">
          {savingsVsSonnet > 0 ? (
            <span>
              <span className="font-medium text-emerald-600">
                {savingsVsSonnet}% cheaper
              </span>{" "}
              than all-Sonnet
            </span>
          ) : savingsVsSonnet < 0 ? (
            <span>
              <span className="font-medium text-red-600">
                {Math.abs(savingsVsSonnet)}% more expensive
              </span>{" "}
              than all-Sonnet
            </span>
          ) : (
            <span className="text-fg-muted">Same cost as all-Sonnet</span>
          )}
          {savingsVsFable > 0 && (
            <span>
              <span className="font-medium text-emerald-600">
                {savingsVsFable}% cheaper
              </span>{" "}
              than all-Fable
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-4 rounded-lg border border-border-default bg-bg-elevated p-4 sm:grid-cols-2">
          {[
            {
              id: "mixed",
              label: "Mixed pipeline attempts",
              value: mixedAttempts,
              set: setMixedAttempts,
            },
            {
              id: "single",
              label: "Single-model attempts",
              value: retries,
              set: setRetries,
            },
          ].map((input) => (
            <div key={input.id}>
              <label
                htmlFor={`${prefix}-${input.id}`}
                className="text-xs font-medium text-fg-primary"
              >
                {input.label}: {input.value}
              </label>
              <input
                id={`${prefix}-${input.id}`}
                aria-label={input.label}
                type="range"
                min={1}
                max={5}
                step={1}
                value={input.value}
                onChange={(event) => input.set(Number(event.target.value))}
                className="mt-3 w-full accent-violet-600"
              />
            </div>
          ))}
          <p className="text-xs leading-relaxed text-fg-secondary sm:col-span-2">
            Each attempt repeats the full token budget. Model choice does not
            guarantee first-attempt success. Adjust both assumptions to reflect
            your experience.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-lg text-xs text-fg-muted">
            Provider API estimates, checked {PRICING_META.verifiedDate}.
            Excludes subscription allowances, caching, and tool fees.
          </p>
          <CopyButton
            label="Copy pipeline"
            accentColor="emerald"
            getText={() =>
              [
                `# ${template.label} model plan`,
                "",
                ...template.steps.map(
                  (step, index) =>
                    `${index + 1}. ${step.label}: ${MODEL_BY_ID[currentAssignments[step.id]].name} — ${step.description} (${step.inputTokens} input / ${step.outputTokens} output tokens)`,
                ),
                "",
                `Mixed pipeline: ${mixedAttempts} attempt(s), ${formatCost(mixedCost)} per workflow.`,
                `Single-model alternatives: ${retries} attempt(s), Sonnet 5 ${formatCost(sonnetCost)}, Fable 5.1 ${formatCost(fableCost)}.`,
                "Estimates assume full-workflow retries, not guaranteed success. API token rates only.",
              ].join("\n")
            }
          />
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function ModelMixer({
  initialMode = "pipeline",
}: {
  initialMode?: MixerMode;
}) {
  const [mode, setMode] = useState<MixerMode>(initialMode);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-500/30 bg-bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-3 sm:px-5 sm:py-4 border-b border-border-default">
        <div className="rounded-lg p-2 text-violet-600 bg-bg-elevated">
          <Shuffle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-violet-600">
            Model Mixer
          </h3>
          <p className="mt-0.5 text-xs text-fg-secondary">
            Assign models to steps and compare workflow cost assumptions
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <ModeToggle
        mode={mode}
        onChange={setMode}
        options={MIXER_MODE_OPTIONS}
        accent="violet"
      />

      <div hidden={mode !== "estimate"}>
        <QuickEstimate />
      </div>
      <div hidden={mode !== "pipeline"}>
        <PipelineBuilder />
      </div>
    </div>
  );
}
