"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  SCENARIOS,
  VERDICT_META,
  calcScenarioCost,
  formatCost,
  type Scenario,
  type ModelResult,
  type Verdict,
} from "@/lib/scenarioLabData";
import { getScenarioLabModels, PRICING_META } from "@/lib/modelSpecs";

const LAB_MODELS = getScenarioLabModels();
const MODEL_BY_ID = Object.fromEntries(LAB_MODELS.map((m) => [m.id, m]));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function verdictIcon(verdict: Verdict) {
  if (verdict === "best") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
  if (verdict === "good") return <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />;
  if (verdict === "caution") return <AlertCircle className="h-3.5 w-3.5 text-amber-400" />;
  return <XCircle className="h-3.5 w-3.5 text-red-400" />;
}

// ---------------------------------------------------------------------------
// Model result card
// ---------------------------------------------------------------------------

function ModelResultCard({
  result,
  scenario,
  isRecommended,
}: {
  result: ModelResult;
  scenario: Scenario;
  isRecommended: boolean;
}) {
  const [expanded, setExpanded] = useState(isRecommended);
  const meta = VERDICT_META[result.verdict];
  const modelSpec = MODEL_BY_ID[result.modelId];
  const cost = modelSpec
    ? calcScenarioCost(modelSpec.inputPer1M, modelSpec.outputPer1M, scenario)
    : null;

  // Derived cost context — all numbers come from modelSpecs.ts, never hardcoded
  const compareSpec = result.costContext?.compareToModelId
    ? MODEL_BY_ID[result.costContext.compareToModelId]
    : null;
  const compareCost = compareSpec
    ? calcScenarioCost(compareSpec.inputPer1M, compareSpec.outputPer1M, scenario)
    : null;
  const ratio =
    cost !== null && compareCost !== null && compareCost > 0
      ? cost / compareCost
      : null;
  const effectiveRuns = result.costContext?.effectiveRuns ?? 1;
  const effectiveCost = cost !== null ? cost * effectiveRuns : null;

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${meta.borderClass} ${
        isRecommended ? "bg-zinc-900" : "bg-zinc-900/50"
      }`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {modelSpec && (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${
              (modelSpec as { gradientFrom?: string }).gradientFrom ?? "from-zinc-700"
            } ${(modelSpec as { gradientTo?: string }).gradientTo ?? "to-zinc-600"}`}
          >
            <span className="text-base">{modelSpec.emoji}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-display text-sm font-semibold text-zinc-100">
              {modelSpec?.name ?? result.modelId}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${meta.textClass} ${meta.bgClass} ${meta.borderClass}`}
            >
              {verdictIcon(result.verdict)}
              {meta.label}
            </span>
            {isRecommended && (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
                recommended
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">{result.summary}</p>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 rounded-md p-1 text-zinc-600 transition-colors hover:text-zinc-400"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">
              {/* Output excerpt */}
              <div>
                <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  What it produced
                </p>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {result.outputExcerpt}
                </div>
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    What went right
                  </p>
                  <ul className="space-y-1">
                    {result.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-xs text-zinc-400">
                        <span className="mt-0.5 shrink-0 text-emerald-400">▸</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses.length > 0 && (
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    What to watch for
                  </p>
                  <ul className="space-y-1">
                    {result.weaknesses.map((w) => (
                      <li key={w} className="flex items-start gap-1.5 text-xs text-zinc-500">
                        <span className="mt-0.5 shrink-0 text-amber-400">▸</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cost note — token cost derived from modelSpecs.ts, commentary from scenario data */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3 py-2.5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-zinc-500">Cost note</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                      {result.costCommentary}
                    </p>
                  </div>
                  {cost !== null && (
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-zinc-600">token cost</p>
                      <p className={`font-mono text-xs font-semibold ${meta.textClass}`}>
                        {formatCost(cost)}/run
                      </p>
                    </div>
                  )}
                </div>
                {/* Derived comparison row */}
                {(ratio !== null || (effectiveRuns > 1 && effectiveCost !== null)) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-700/40 pt-2">
                    {ratio !== null && compareSpec && (
                      <p className="font-mono text-[10px] text-zinc-500">
                        <span className={ratio > 1 ? "text-amber-400" : "text-emerald-400"}>
                          {ratio >= 2
                            ? `${ratio.toFixed(1)}× `
                            : ratio > 1
                            ? `${Math.round((ratio - 1) * 100)}% more `
                            : `${Math.round((1 - ratio) * 100)}% cheaper `}
                        </span>
                        than {compareSpec.name}
                      </p>
                    )}
                    {effectiveRuns > 1 && effectiveCost !== null && (
                      <p className="font-mono text-[10px] text-zinc-500">
                        effective:{" "}
                        <span className="text-amber-400">{formatCost(effectiveCost)}</span>
                        {" "}({effectiveRuns} rounds)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scenario view
// ---------------------------------------------------------------------------

function ScenarioView({ scenario }: { scenario: Scenario }) {
  // Sort: best first, then good, caution, avoid
  const VERDICT_ORDER: Record<Verdict, number> = { best: 0, good: 1, caution: 2, avoid: 3 };
  const sorted = [...scenario.results].sort(
    (a, b) => VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict]
  );

  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Scenario description + insight */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 space-y-2">
        <p className="text-sm leading-relaxed text-zinc-300">{scenario.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          <span className="font-mono">~{scenario.inputTokens / 1000}k in</span>
          <span className="font-mono">~{scenario.outputTokens / 1000}k out</span>
          <span className="capitalize">signal: {scenario.primarySignal}</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-blue-400/15 bg-blue-400/5 px-3 py-2">
          <span className="mt-0.5 shrink-0 text-blue-400 text-xs">→</span>
          <p className="text-xs leading-relaxed text-blue-300">{scenario.insight}</p>
        </div>
      </div>

      {/* Model result cards */}
      <div className="space-y-2">
        {sorted.map((result) => (
          <ModelResultCard
            key={result.modelId}
            result={result}
            scenario={scenario}
            isRecommended={result.modelId === scenario.recommendedModelId}
          />
        ))}
      </div>

      {/* Recommendation callout */}
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
        <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          Bottom line
        </p>
        <p className="text-xs leading-relaxed text-zinc-300">
          {scenario.recommendationReason}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export function ScenarioLab() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const activeScenario = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-amber-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-amber-400">
          <FlaskConical className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-amber-400">Scenario Lab</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Real tasks, real model outputs — see which model wins and why
          </p>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="border-b border-zinc-800 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                s.id === activeId
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active scenario */}
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <AnimatePresence mode="wait">
          <ScenarioView key={activeId} scenario={activeScenario} />
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-3 py-3 sm:px-5">
        <p className="text-[11px] text-zinc-600">
          Outputs are curated from real usage. Prices from official API docs, verified{" "}
          {PRICING_META.verifiedDate}.{" "}
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
    </div>
  );
}
