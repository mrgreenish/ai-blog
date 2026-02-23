"use client";

import { useState, useRef } from "react";
import { Shuffle, ChevronDown, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import { getMixerModels } from "@/lib/modelSpecs";
import type { Tier } from "@/lib/modelSpecs";

// --- Types ---

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

// --- Data ---

const MODELS: Model[] = getMixerModels();

const MODEL_BY_ID = Object.fromEntries(MODELS.map((m) => [m.id, m]));

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
      { id: "reproduce", label: "Reproduce", description: "Isolate the failing case, minimal repro", defaultTier: "fast", defaultModelId: "gpt4o-mini", recommendedModelId: "gpt4o-mini", inputTokens: 1000, outputTokens: 1000 },
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
      { id: "pr-desc", label: "PR description", description: "Write PR description from spec + diff", defaultTier: "balanced", defaultModelId: "composer-1", recommendedModelId: "composer-1", inputTokens: 2000, outputTokens: 1000 },
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
  className,
}: {
  step: PipelineStep;
  modelId: string;
  onModelChange: (stepId: string, modelId: string) => void;
  index: number;
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
        <p className="font-mono text-xs font-semibold text-zinc-200">{step.label}</p>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {modelId === step.recommendedModelId && (
            <span className="rounded px-1 py-0.5 font-mono text-[10px] font-medium leading-none text-pink-400 bg-pink-400/10">
              my pick
            </span>
          )}
          <TierBadge tier={tier} />
        </div>
      </div>
      <p className="mb-2 text-[11px] leading-relaxed text-zinc-500 line-clamp-2">{step.description}</p>
      <ModelSelect stepId={step.id} value={modelId} onChange={onModelChange} />
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
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
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-20 shrink-0 text-right font-mono text-[11px] text-zinc-400 sm:w-28 sm:text-xs">{label}</div>
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

  function handleTemplateChange(id: string) {
    setTemplateId(id);
  }

  const [retries, setRetries] = useState(1);

  const mixedCostBase = calcTotalCost(currentAssignments, template.steps);
  const sonnetCostBase = calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "sonnet-4.6"])),
    template.steps
  );
  const opusCostBase = calcTotalCost(
    Object.fromEntries(template.steps.map((s) => [s.id, "opus-4.6"])),
    template.steps
  );

  const mixedCost = mixedCostBase;
  const sonnetCost = sonnetCostBase * retries;
  const opusCost = opusCostBase * retries;

  const savingsVsSonnet = sonnetCost > 0 ? Math.round(((sonnetCost - mixedCost) / sonnetCost) * 100) : 0;
  const savingsVsOpus = opusCost > 0 ? Math.round(((opusCost - mixedCost) / opusCost) * 100) : 0;
  const maxCost = Math.max(mixedCost, sonnetCost, opusCost);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-violet-400">
          <Shuffle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-violet-400">Model Mixer</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Combine models across a single task for cost and quality
          </p>
        </div>
      </div>

      {/* Template selector */}
      <div className="border-b border-zinc-800 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTemplateChange(t.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
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
                    index={i}
                    className="step-card"
                  />
                  {i < template.steps.length - 1 && (
                    <div className="mt-6 shrink-0 text-zinc-700">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Medium: 2x2 grid */}
            <div className="hidden grid-cols-2 gap-2 md:grid lg:hidden">
              {template.steps.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  modelId={currentAssignments[step.id]}
                  onModelChange={handleModelChange}
                  index={i}
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
                    index={i}
                    className="step-card"
                  />
                  {i < template.steps.length - 1 && (
                    <div className="flex justify-center text-zinc-700">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-3 py-3 sm:px-5 sm:py-4">
        <p className="mb-3 font-mono text-xs font-semibold text-zinc-400">Real-world cost</p>
        <div className="space-y-2">
          <CostBar
            label={retries === 1 ? "Mixed pipeline" : "Right model, first try"}
            cost={mixedCost}
            maxCost={maxCost}
            colorClass="bg-violet-400"
            isMixed
          />
          <CostBar
            label={retries === 1 ? "All Sonnet 4.6" : `All Sonnet (${retries} attempts)`}
            cost={sonnetCost}
            maxCost={maxCost}
            colorClass="bg-blue-400"
          />
          <CostBar
            label={retries === 1 ? "All Opus 4.6" : `All Opus (${retries} attempts)`}
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

        {/* Retry simulator */}
        <div className="mt-4 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="retry-slider" className="text-[11px] font-medium text-zinc-300">
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
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-violet-400 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-600">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            {retries === 1
              ? "Slide to simulate back-and-forth. Using one model for everything often means re-prompting the steps it's not great at."
              : `Using one model for every step? The planning or review step might need ${retries} attempts before the output is good enough. The mixed pipeline uses the right model per step — so it nails each one first time.`}
          </p>
        </div>
      </div>
    </div>
  );
}
