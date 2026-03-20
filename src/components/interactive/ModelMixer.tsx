"use client";

import { useState, useRef, useMemo } from "react";
import { Shuffle, Calculator, ChevronDown, ArrowRight, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import { getMixerModels, getCostCalculatorModels, PRICING_META } from "@/lib/modelSpecs";
import type { Tier } from "@/lib/modelSpecs";
import { ModeToggle } from "@/components/ui/WorkflowPrimitives";

type MixerMode = "estimate" | "pipeline";

const MIXER_MODE_OPTIONS = [
  { id: "estimate" as const, label: "Quick Estimate", icon: Calculator },
  { id: "pipeline" as const, label: "Pipeline Builder", icon: Shuffle },
] as const;

// =============================================================================
// Quick Estimate mode (absorbed from CostCalculator)
// =============================================================================

const COST_MODELS = getCostCalculatorModels();

interface Scenario {
  id: string;
  label: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
  complexityNote: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "explain-error",
    label: "Explain an error",
    description: "Paste a stack trace and get a plain-English explanation with a fix.",
    inputTokens: 800,
    outputTokens: 500,
    complexityNote:
      "A fast model handles this well. The answer is either right or obviously wrong — no back-and-forth needed.",
  },
  {
    id: "code-review",
    label: "Code review",
    description: "Review a medium-sized file and get structured feedback on issues and improvements.",
    inputTokens: 4000,
    outputTokens: 1500,
    complexityNote:
      "A fast model catches obvious issues. A stronger model finds subtle logic bugs and gives more actionable feedback — fewer missed problems means less rework later.",
  },
  {
    id: "generate-tests",
    label: "Generate unit tests",
    description: "Send a module and get a full test suite back covering edge cases.",
    inputTokens: 3000,
    outputTokens: 4000,
    complexityNote:
      "Fast models produce boilerplate tests quickly. A stronger model reasons about edge cases and failure modes — one good suite beats three mediocre ones you have to fix.",
  },
  {
    id: "refactor",
    label: "Refactor a component",
    description: "Send a full component and get a cleaned-up, restructured version.",
    inputTokens: 5000,
    outputTokens: 6000,
    complexityNote:
      "Refactoring requires understanding intent, not just syntax. A stronger model is more likely to get it right first try — saving the time you'd spend correcting a cheaper model's misread.",
  },
  {
    id: "build-feature",
    label: "Build a feature",
    description: "Provide a spec and existing context; get multi-file implementation back.",
    inputTokens: 8000,
    outputTokens: 12000,
    complexityNote:
      "This is where raw cost comparisons mislead. A stronger model that ships working code in one shot is often cheaper in practice than a cheap model that needs five rounds of corrections.",
  },
];

interface Frequency {
  id: string;
  label: string;
  runsPerDay: number;
}

const FREQUENCIES: Frequency[] = [
  { id: "once", label: "Once/day", runsPerDay: 1 },
  { id: "5x", label: "5×/day", runsPerDay: 5 },
  { id: "20x", label: "20×/day", runsPerDay: 20 },
  { id: "50x", label: "50×/day", runsPerDay: 50 },
];

function calcPerRun(perM_in: number, perM_out: number, inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1_000_000) * perM_in + (outputTokens / 1_000_000) * perM_out;
}

function formatEstimateCost(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.0001) return "<$0.0001";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
}

export function QuickEstimate() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[1].id);
  const [frequencyId, setFrequencyId] = useState(FREQUENCIES[2].id);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const frequency = FREQUENCIES.find((f) => f.id === frequencyId) ?? FREQUENCIES[2];

  const rows = COST_MODELS.map((m) => {
    const perRun = calcPerRun(m.perM_in, m.perM_out, scenario.inputTokens, scenario.outputTokens);
    const monthly = perRun * frequency.runsPerDay * 30;
    return { ...m, perRun, monthly };
  }).sort((a, b) => a.monthly - b.monthly);

  const maxMonthly = rows[rows.length - 1]?.monthly ?? 1;
  const cheapest = rows[0];
  const mostExpensive = rows[rows.length - 1];
  const savingsPct =
    mostExpensive.monthly > 0
      ? Math.round(((mostExpensive.monthly - cheapest.monthly) / mostExpensive.monthly) * 100)
      : 0;

  return (
    <>
      {/* Scenario selector */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-border-default">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-fg-secondary">Pick a task</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                s.id === scenarioId
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : ""
              }`}
              style={s.id !== scenarioId ? { borderColor: "var(--color-border-strong)", color: "var(--color-fg-secondary)" } : undefined}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] text-fg-secondary">{scenario.description}</p>
          <span className="shrink-0 font-mono text-[10px] text-fg-muted">
            ~{formatTokens(scenario.inputTokens)} in / ~{formatTokens(scenario.outputTokens)} out
          </span>
        </div>
      </div>

      {/* Frequency selector */}
      <div className="px-3 py-3 sm:px-5 sm:py-3 border-b border-border-default">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="font-mono text-[11px] font-medium text-fg-secondary">How often?</p>
          <div className="flex flex-wrap gap-1.5">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                onClick={() => setFrequencyId(f.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  f.id === frequencyId
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : ""
                }`}
                style={f.id !== frequencyId ? { borderColor: "var(--color-border-strong)", color: "var(--color-fg-secondary)" } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost bars */}
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <div className="space-y-2">
          {rows.map((m, i) => {
            const pct = maxMonthly > 0 ? (m.monthly / maxMonthly) * 100 : 0;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className={`w-32 shrink-0 font-mono text-[11px] sm:w-40 sm:text-xs ${m.color}`}>
                  {m.name}
                </div>
                <div className="relative h-6 flex-1 overflow-hidden rounded bg-bg-elevated">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded bg-emerald-400/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-fg-primary">
                    {formatEstimateCost(m.monthly)}/mo
                  </span>
                </div>
                <div className="w-16 shrink-0 text-right font-mono text-[11px] sm:w-20 text-fg-muted">
                  {formatEstimateCost(m.perRun)}/run
                </div>
              </motion.div>
            );
          })}
        </div>

        {savingsPct > 0 && (
          <div className="mt-4 rounded-lg px-3 py-2.5 space-y-1.5 bg-bg-elevated border border-border-default">
            <p className="text-[11px] leading-relaxed text-fg-secondary">
              <span className={`font-medium ${cheapest.color}`}>{cheapest.name}</span>
              {" is "}
              <span className="font-medium text-emerald-400">{savingsPct}% cheaper</span>
              {" than "}
              <span className={`font-medium ${mostExpensive.color}`}>{mostExpensive.name}</span>
              {" for this task — "}
              <span className="text-fg-secondary">
                {formatEstimateCost(cheapest.monthly)} vs {formatEstimateCost(mostExpensive.monthly)}/mo
              </span>
            </p>
            <p className="text-[11px] leading-relaxed text-fg-secondary">
              {scenario.complexityNote}
            </p>
          </div>
        )}
      </div>

      {/* Footer — data source attribution */}
      <div className="px-3 py-3 sm:px-5 bg-bg-surface border-t border-border-default">
        <p className="text-[11px] text-fg-muted">
          Prices from official API docs, verified {PRICING_META.verifiedDate}.{" "}
          {(Object.entries(PRICING_META.urls) as [string, string][]).map(([provider, url], i, arr) => (
            <span key={provider}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-400"
              >
                {provider}
              </a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}

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
const MODELS_BY_TIER = Object.groupBy(MODELS, (m) => m.tier) as Record<Tier, Model[]>;

const TEMPLATES: Template[] = [
  {
    id: "fullstack",
    label: "Full-stack feature",
    steps: [
      { id: "scaffold", label: "Scaffold", description: "Component structure, boilerplate, file setup", defaultTier: "reasoning", defaultModelId: "opus-4.6", recommendedModelId: "opus-4.6", inputTokens: 1000, outputTokens: 2000 },
      { id: "logic", label: "Business logic", description: "Core feature logic, edge cases, state", defaultTier: "balanced", defaultModelId: "sonnet-4.6", recommendedModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 3000 },
      { id: "review", label: "Code review", description: "Architecture, patterns, security concerns", defaultTier: "reasoning", defaultModelId: "opus-4.6", recommendedModelId: "opus-4.6", inputTokens: 3000, outputTokens: 1000 },
      { id: "tests", label: "Tests", description: "Unit tests, edge case coverage", defaultTier: "balanced", defaultModelId: "sonnet-4.6", recommendedModelId: "sonnet-4.6", inputTokens: 1500, outputTokens: 2500 },
    ],
  },
  {
    id: "bugfix",
    label: "Bug investigation",
    steps: [
      { id: "reproduce", label: "Reproduce", description: "Isolate the failing case, minimal repro", defaultTier: "fast", defaultModelId: "gpt-5.4", recommendedModelId: "gpt-5.4", inputTokens: 1000, outputTokens: 1000 },
      { id: "diagnose", label: "Diagnose", description: "Trace root cause through execution path", defaultTier: "reasoning", defaultModelId: "opus-4.6", recommendedModelId: "opus-4.6", inputTokens: 2500, outputTokens: 2000 },
      { id: "fix", label: "Fix", description: "Implement the targeted fix", defaultTier: "balanced", defaultModelId: "sonnet-4.6", recommendedModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 2500 },
      { id: "verify", label: "Verify", description: "Confirm fix, check for regressions", defaultTier: "fast", defaultModelId: "haiku-4.5", recommendedModelId: "haiku-4.5", inputTokens: 1500, outputTokens: 1000 },
    ],
  },
  {
    id: "spec-to-pr",
    label: "Spec to PR",
    steps: [
      { id: "plan", label: "Plan", description: "Break spec into files, decisions, approach", defaultTier: "reasoning", defaultModelId: "opus-4.6", recommendedModelId: "opus-4.6", inputTokens: 1500, outputTokens: 2000 },
      { id: "implement", label: "Implement", description: "Write the code against the plan", defaultTier: "balanced", defaultModelId: "sonnet-4.6", recommendedModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 4000 },
      { id: "review-arch", label: "Review", description: "Architecture review, catch mistakes", defaultTier: "balanced", defaultModelId: "sonnet-4.6", recommendedModelId: "sonnet-4.6", inputTokens: 4000, outputTokens: 1500 },
      { id: "pr-desc", label: "PR description", description: "Write PR description from spec + diff", defaultTier: "balanced", defaultModelId: "composer-2", recommendedModelId: "composer-2", inputTokens: 2000, outputTokens: 1000 },
    ],
  },
];

// --- Helpers ---

const TIER_COLORS: Record<Tier, { text: string; bg: string; border: string; label: string }> = {
  fast: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", label: "fast" },
  balanced: { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", label: "balanced" },
  reasoning: { text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30", label: "reasoning" },
};

function calcStepCost(model: Model, step: PipelineStep): number {
  return (step.inputTokens / 1_000_000) * model.inputPer1M + (step.outputTokens / 1_000_000) * model.outputPer1M;
}

function calcTotalCost(assignments: Record<string, string>, steps: PipelineStep[]): number {
  return steps.reduce((sum, step) => {
    const model = MODEL_BY_ID[assignments[step.id]];
    return sum + (model ? calcStepCost(model, step) : 0);
  }, 0);
}

function formatCost(cost: number): string {
  if (cost < 0.001) return `$${(cost * 1000).toFixed(3)}m`;
  return `$${cost.toFixed(4)}`;
}

// --- Sub-components ---

function TierBadge({ tier }: { tier: Tier }) {
  const c = TIER_COLORS[tier];
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${c.text} ${c.bg}`}>
      {c.label}
    </span>
  );
}

function ModelSelect({
  stepId,
  value,
  onChange,
}: {
  stepId: string;
  value: string;
  onChange: (stepId: string, modelId: string) => void;
}) {
  const selected = MODEL_BY_ID[value];
  const tier = selected?.tier ?? "fast";
  const colors = TIER_COLORS[tier];

  return (
    <div className="relative">
      <select
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
        <p className="font-mono text-xs font-semibold text-fg-primary">{step.label}</p>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {modelId === step.recommendedModelId && (
            <span className="rounded px-1 py-0.5 font-mono text-[10px] font-medium leading-none text-pink-400 bg-pink-400/10">
              my pick
            </span>
          )}
          <TierBadge tier={tier} />
        </div>
      </div>
      <p className="mb-2 text-[11px] leading-relaxed line-clamp-2 text-fg-secondary">{step.description}</p>
      <ModelSelect stepId={step.id} value={modelId} onChange={onModelChange} />
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-fg-secondary">
        <span>{step.inputTokens / 1000}K in / {step.outputTokens / 1000}K out</span>
        <span className={`font-mono font-medium ${colors.text}`}>{formatCost(cost)}</span>
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
      <div className="w-20 shrink-0 text-right font-mono text-[11px] sm:w-28 sm:text-xs text-fg-secondary">{label}</div>
      <div className="relative h-5 flex-1 overflow-hidden rounded bg-bg-elevated">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded ${colorClass} ${isMixed ? "opacity-90" : "opacity-40"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-fg-primary">
          ${cost.toFixed(4)}/run
        </span>
      </div>
    </div>
  );
}

function PipelineBuilder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);
  const [assignments, setAssignments] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    for (const t of TEMPLATES) {
      init[t.id] = Object.fromEntries(t.steps.map((s) => [s.id, s.defaultModelId]));
    }
    return init;
  });

  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const currentAssignments = assignments[templateId];

  useGSAP(
    () => {
      gsap.fromTo(
        ".step-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    },
    { scope: containerRef, dependencies: [templateId] }
  );

  function handleModelChange(stepId: string, modelId: string) {
    setAssignments((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], [stepId]: modelId },
    }));
  }

  const [retries, setRetries] = useState(1);

  const mixedCost = calcTotalCost(currentAssignments, template.steps);

  // These only depend on the template, not on user model assignments or retries.
  const sonnetCostBase = useMemo(() => calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "sonnet-4.6"])),
    template.steps
  ), [template]);
  const opusCostBase = useMemo(() => calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "opus-4.6"])),
    template.steps
  ), [template]);

  // Mixed pipeline cost is NOT multiplied by retries — the premise is that
  // using the right model per step gets it right on the first attempt.
  const sonnetCost = sonnetCostBase * retries;
  const opusCost = opusCostBase * retries;

  const savingsVsSonnet = sonnetCost > 0 ? Math.round(((sonnetCost - mixedCost) / sonnetCost) * 100) : 0;
  const savingsVsOpus = opusCost > 0 ? Math.round(((opusCost - mixedCost) / opusCost) * 100) : 0;
  const maxCost = Math.max(mixedCost, sonnetCost, opusCost);

  return (
    <>
      {/* Template selector */}
      <div className="px-3 py-2.5 sm:px-5 sm:py-3 border-b border-border-default">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                t.id === templateId
                  ? "border-violet-400/50 bg-violet-400/10 text-violet-300"
                  : ""
              }`}
              style={t.id !== templateId ? { borderColor: "var(--color-border-strong)", color: "var(--color-fg-secondary)" } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="px-3 py-4 sm:px-5 sm:py-5" ref={containerRef}>
        <div key={templateId}>
            {/* Large: horizontal row */}
            <div className="hidden items-start gap-2 lg:flex">
              {template.steps.map((step, i) => (
                <div key={step.id} className="flex flex-1 items-start gap-2">
                  <StepCard
                    step={step}
                    modelId={currentAssignments[step.id]}
                    onModelChange={handleModelChange}
                    className="step-card"
                  />
                  {i < template.steps.length - 1 && (
                    <div className="mt-6 shrink-0 text-border-strong">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Medium: 2x2 grid */}
            <div className="hidden grid-cols-2 gap-2 md:grid lg:hidden">
              {template.steps.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  modelId={currentAssignments[step.id]}
                  onModelChange={handleModelChange}
                  className="step-card"
                />
              ))}
            </div>

            {/* Mobile: vertical stack */}
            <div className="flex flex-col gap-2 md:hidden">
              {template.steps.map((step, i) => (
                <div key={step.id} className="flex flex-col gap-2">
                  <StepCard
                    step={step}
                    modelId={currentAssignments[step.id]}
                    onModelChange={handleModelChange}
                    className="step-card"
                  />
                  {i < template.steps.length - 1 && (
                    <div className="flex justify-center text-border-strong">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 bg-bg-surface border-t border-border-default">
        <p className="mb-3 font-mono text-xs font-semibold text-fg-secondary">Real-world cost</p>
        <div className="space-y-2">
          <PipelineCostBar
            label={retries === 1 ? "Mixed pipeline" : "Right model, first try"}
            cost={mixedCost}
            maxCost={maxCost}
            colorClass="bg-violet-400"
            isMixed
          />
          <PipelineCostBar
            label={retries === 1 ? "All Sonnet 4.6" : `All Sonnet (${retries} attempts)`}
            cost={sonnetCost}
            maxCost={maxCost}
            colorClass="bg-blue-400"
          />
          <PipelineCostBar
            label={retries === 1 ? "All Opus 4.6" : `All Opus (${retries} attempts)`}
            cost={opusCost}
            maxCost={maxCost}
            colorClass="bg-zinc-400"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-fg-secondary">
          {savingsVsSonnet > 0 ? (
            <span>
              <span className="font-medium text-emerald-400">{savingsVsSonnet}% cheaper</span> than all-Sonnet
            </span>
          ) : savingsVsSonnet < 0 ? (
            <span>
              <span className="font-medium text-red-400">{Math.abs(savingsVsSonnet)}% more expensive</span> than all-Sonnet
            </span>
          ) : (
            <span className="text-fg-muted">Same cost as all-Sonnet</span>
          )}
          {savingsVsOpus > 0 && (
            <span>
              <span className="font-medium text-emerald-400">{savingsVsOpus}% cheaper</span> than all-Opus
            </span>
          )}
        </div>

        {/* Retry simulator */}
        <div className="mt-4 rounded-lg px-3 py-3 bg-bg-elevated border border-border-default">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="retry-slider" className="text-[11px] font-medium text-fg-primary">
              How many attempts does one-model-for-everything need?
            </label>
            <span className="font-mono text-[11px] text-violet-400">
              {retries === 1 ? "1 attempt" : `${retries} attempts`}
            </span>
          </div>
          <input
            id="retry-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={retries}
            onChange={(e) => setRetries(Number(e.target.value))}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-strong accent-violet-400 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-muted">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-fg-secondary">
            {retries === 1
              ? "Slide to simulate back-and-forth. Using one model for everything often means re-prompting the steps it's not great at."
              : `Using one model for every step? The planning or review step might need ${retries} attempts before the output is good enough. The mixed pipeline uses the right model per step — so it nails each one first time.`}
          </p>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function ModelMixer({ initialMode = "estimate" }: { initialMode?: MixerMode }) {
  const [mode, setMode] = useState<MixerMode>(initialMode);

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-xl border border-violet-400/30 bg-bg-surface"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-3 sm:px-5 sm:py-4 border-b border-border-default"
        
      >
        <div className="rounded-lg p-2 text-violet-400 bg-bg-elevated">
          <Shuffle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-violet-400">Model Mixer</h3>
          <p className="mt-0.5 text-xs text-fg-secondary">
            Compare costs and build optimized model pipelines
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} options={MIXER_MODE_OPTIONS} accent="violet" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {mode === "estimate" ? <QuickEstimate /> : <PipelineBuilder />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
