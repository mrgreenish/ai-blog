"use client";

import { useState } from "react";
import { Shuffle, ChevronDown, ArrowRight, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

type Tier = "fast" | "balanced" | "reasoning";

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
  inputTokens: number;
  outputTokens: number;
}

interface Template {
  id: string;
  label: string;
  steps: PipelineStep[];
}

// --- Data ---

const MODELS: Model[] = [
  // Fast tier
  { id: "gemini-flash", name: "Gemini 2.0 Flash", provider: "Google", tier: "fast", inputPer1M: 0.10, outputPer1M: 0.40 },
  { id: "gpt4o-mini", name: "GPT-4o mini", provider: "OpenAI", tier: "fast", inputPer1M: 0.15, outputPer1M: 0.60 },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", tier: "fast", inputPer1M: 0.55, outputPer1M: 2.19 },
  { id: "haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", tier: "fast", inputPer1M: 1.00, outputPer1M: 5.00 },
  // Balanced tier
  { id: "o3", name: "o3", provider: "OpenAI", tier: "balanced", inputPer1M: 2.00, outputPer1M: 8.00 },
  { id: "gpt4o", name: "GPT-4o", provider: "OpenAI", tier: "balanced", inputPer1M: 2.50, outputPer1M: 10.00 },
  { id: "sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic", tier: "balanced", inputPer1M: 3.00, outputPer1M: 15.00 },
  // Reasoning tier
  { id: "opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic", tier: "reasoning", inputPer1M: 5.00, outputPer1M: 25.00 },
  { id: "o3-pro", name: "o3-pro", provider: "OpenAI", tier: "reasoning", inputPer1M: 20.00, outputPer1M: 80.00 },
];

const MODEL_BY_ID = Object.fromEntries(MODELS.map((m) => [m.id, m]));

const TEMPLATES: Template[] = [
  {
    id: "fullstack",
    label: "Full-stack feature",
    steps: [
      { id: "scaffold", label: "Scaffold", description: "Component structure, boilerplate, file setup", defaultTier: "fast", defaultModelId: "haiku-4.5", inputTokens: 1000, outputTokens: 2000 },
      { id: "logic", label: "Business logic", description: "Core feature logic, edge cases, state", defaultTier: "balanced", defaultModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 3000 },
      { id: "review", label: "Code review", description: "Architecture, patterns, security concerns", defaultTier: "reasoning", defaultModelId: "opus-4.6", inputTokens: 3000, outputTokens: 1000 },
      { id: "tests", label: "Tests", description: "Unit tests, edge case coverage", defaultTier: "fast", defaultModelId: "haiku-4.5", inputTokens: 1500, outputTokens: 2500 },
    ],
  },
  {
    id: "bugfix",
    label: "Bug investigation",
    steps: [
      { id: "reproduce", label: "Reproduce", description: "Isolate the failing case, minimal repro", defaultTier: "fast", defaultModelId: "gpt4o-mini", inputTokens: 1000, outputTokens: 1000 },
      { id: "diagnose", label: "Diagnose", description: "Trace root cause through execution path", defaultTier: "reasoning", defaultModelId: "o3", inputTokens: 2500, outputTokens: 2000 },
      { id: "fix", label: "Fix", description: "Implement the targeted fix", defaultTier: "balanced", defaultModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 2500 },
      { id: "verify", label: "Verify", description: "Confirm fix, check for regressions", defaultTier: "fast", defaultModelId: "haiku-4.5", inputTokens: 1500, outputTokens: 1000 },
    ],
  },
  {
    id: "spec-to-pr",
    label: "Spec to PR",
    steps: [
      { id: "plan", label: "Plan", description: "Break spec into files, decisions, approach", defaultTier: "reasoning", defaultModelId: "o3", inputTokens: 1500, outputTokens: 2000 },
      { id: "implement", label: "Implement", description: "Write the code against the plan", defaultTier: "balanced", defaultModelId: "sonnet-4.6", inputTokens: 2000, outputTokens: 4000 },
      { id: "review-arch", label: "Review", description: "Architecture review, catch mistakes", defaultTier: "reasoning", defaultModelId: "opus-4.6", inputTokens: 4000, outputTokens: 1500 },
      { id: "pr-desc", label: "PR description", description: "Write PR description from spec + diff", defaultTier: "fast", defaultModelId: "gpt4o-mini", inputTokens: 2000, outputTokens: 1000 },
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

function formatCostShort(cost: number): string {
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
        {(["fast", "balanced", "reasoning"] as Tier[]).map((tier) => (
          <optgroup key={tier} label={`── ${tier} ──`}>
            {MODELS.filter((m) => m.tier === tier).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}

function StepCard({
  step,
  modelId,
  onModelChange,
  index,
}: {
  step: PipelineStep;
  modelId: string;
  onModelChange: (stepId: string, modelId: string) => void;
  index: number;
}) {
  const model = MODEL_BY_ID[modelId];
  const cost = model ? calcStepCost(model, step) : 0;
  const tier = model?.tier ?? step.defaultTier;
  const colors = TIER_COLORS[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className={`flex-1 min-w-0 rounded-lg border ${colors.border} ${colors.bg} p-3`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="truncate font-mono text-xs font-semibold text-zinc-200">{step.label}</p>
        <TierBadge tier={tier} />
      </div>
      <p className="mb-2.5 text-[11px] leading-relaxed text-zinc-500">{step.description}</p>
      <ModelSelect stepId={step.id} value={modelId} onChange={onModelChange} />
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span>{step.inputTokens / 1000}K in / {step.outputTokens / 1000}K out</span>
        <span className={`font-mono font-medium ${colors.text}`}>{formatCost(cost)}</span>
      </div>
    </motion.div>
  );
}

function CostBar({
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
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-400">{label}</div>
      <div className="relative h-5 flex-1 overflow-hidden rounded bg-zinc-800">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded ${colorClass} ${isMixed ? "opacity-90" : "opacity-40"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-zinc-300">
          {formatCostShort(cost)}/run
        </span>
      </div>
    </div>
  );
}

// --- Main component ---

export function ModelMixer() {
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

  function handleModelChange(stepId: string, modelId: string) {
    setAssignments((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], [stepId]: modelId },
    }));
  }

  function handleTemplateChange(id: string) {
    setTemplateId(id);
  }

  const mixedCost = calcTotalCost(currentAssignments, template.steps);
  const sonnetCost = calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "sonnet-4.6"])),
    template.steps
  );
  const opusCost = calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "opus-4.6"])),
    template.steps
  );

  const savingsVsSonnet = sonnetCost > 0 ? Math.round(((sonnetCost - mixedCost) / sonnetCost) * 100) : 0;
  const savingsVsOpus = opusCost > 0 ? Math.round(((opusCost - mixedCost) / opusCost) * 100) : 0;
  const maxCost = Math.max(mixedCost, sonnetCost, opusCost);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-violet-400">
          <Shuffle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold text-violet-400">Model Mixer</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Combine models across a single task for cost and quality
          </p>
        </div>
      </div>

      {/* Template selector */}
      <div className="border-b border-zinc-800 px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTemplateChange(t.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                t.id === templateId
                  ? "border-violet-400/50 bg-violet-400/10 text-violet-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={templateId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Desktop: horizontal row */}
            <div className="hidden items-start gap-2 md:flex">
              {template.steps.map((step, i) => (
                <div key={step.id} className="flex flex-1 items-start gap-2">
                  <StepCard
                    step={step}
                    modelId={currentAssignments[step.id]}
                    onModelChange={handleModelChange}
                    index={i}
                  />
                  {i < template.steps.length - 1 && (
                    <div className="mt-6 shrink-0 text-zinc-700">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
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
                    index={i}
                  />
                  {i < template.steps.length - 1 && (
                    <div className="flex justify-center text-zinc-700">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-5 py-4">
        <p className="mb-3 font-mono text-xs font-semibold text-zinc-400">Cost per run</p>
        <div className="space-y-2">
          <CostBar
            label="Mixed pipeline"
            cost={mixedCost}
            maxCost={maxCost}
            colorClass="bg-violet-400"
            isMixed
          />
          <CostBar
            label="All Sonnet 4.6"
            cost={sonnetCost}
            maxCost={maxCost}
            colorClass="bg-blue-400"
          />
          <CostBar
            label="All Opus 4.6"
            cost={opusCost}
            maxCost={maxCost}
            colorClass="bg-zinc-400"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
          {savingsVsSonnet > 0 ? (
            <span>
              <span className="font-medium text-emerald-400">{savingsVsSonnet}% cheaper</span> than all-Sonnet
            </span>
          ) : savingsVsSonnet < 0 ? (
            <span>
              <span className="font-medium text-red-400">{Math.abs(savingsVsSonnet)}% more expensive</span> than all-Sonnet
            </span>
          ) : (
            <span className="text-zinc-600">Same cost as all-Sonnet</span>
          )}
          {savingsVsOpus > 0 && (
            <span>
              <span className="font-medium text-emerald-400">{savingsVsOpus}% cheaper</span> than all-Opus
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
