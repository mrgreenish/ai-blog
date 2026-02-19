"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { getCostCalculatorModels, PRICING_META } from "@/lib/modelSpecs";

const MODELS = getCostCalculatorModels();

// ---------------------------------------------------------------------------
// Scenarios — realistic token estimates per developer task
// ---------------------------------------------------------------------------

interface Scenario {
  id: string;
  label: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: "explain-error",
    label: "Explain an error",
    description: "Paste a stack trace and get a plain-English explanation with a fix.",
    inputTokens: 800,
    outputTokens: 500,
  },
  {
    id: "code-review",
    label: "Code review",
    description: "Review a medium-sized file and get structured feedback on issues and improvements.",
    inputTokens: 4000,
    outputTokens: 1500,
  },
  {
    id: "generate-tests",
    label: "Generate unit tests",
    description: "Send a module and get a full test suite back covering edge cases.",
    inputTokens: 3000,
    outputTokens: 4000,
  },
  {
    id: "refactor",
    label: "Refactor a component",
    description: "Send a full component and get a cleaned-up, restructured version.",
    inputTokens: 5000,
    outputTokens: 6000,
  },
  {
    id: "build-feature",
    label: "Build a feature",
    description: "Provide a spec and existing context; get multi-file implementation back.",
    inputTokens: 8000,
    outputTokens: 12000,
  },
];

// ---------------------------------------------------------------------------
// Frequency presets
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcPerRun(perM_in: number, perM_out: number, inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1_000_000) * perM_in + (outputTokens / 1_000_000) * perM_out;
}

function formatCost(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.0001) return "<$0.0001";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CostCalculator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[1].id); // default: code review
  const [frequencyId, setFrequencyId] = useState(FREQUENCIES[2].id); // default: 20x/day

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const frequency = FREQUENCIES.find((f) => f.id === frequencyId) ?? FREQUENCIES[2];

  const rows = MODELS.map((m) => {
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
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-emerald-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-emerald-400">
          <Calculator className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-emerald-400">Cost Calculator</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            What does AI actually cost for real developer tasks?
          </p>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-zinc-500">Pick a task</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                s.id === scenarioId
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {/* Scenario description */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] text-zinc-400">{scenario.description}</p>
          <span className="shrink-0 font-mono text-[10px] text-zinc-600">
            ~{formatTokens(scenario.inputTokens)} in / ~{formatTokens(scenario.outputTokens)} out
          </span>
        </div>
      </div>

      {/* Frequency selector */}
      <div className="border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="font-mono text-[11px] font-medium text-zinc-500">How often?</p>
          <div className="flex flex-wrap gap-1.5">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                onClick={() => setFrequencyId(f.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  f.id === frequencyId
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
                }`}
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
                <div className="relative h-6 flex-1 overflow-hidden rounded bg-zinc-800">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded bg-emerald-400/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-zinc-300">
                    {formatCost(m.monthly)}/mo
                  </span>
                </div>
                <div className="w-16 shrink-0 text-right font-mono text-[11px] text-zinc-600 sm:w-20">
                  {formatCost(m.perRun)}/run
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cheapest vs most expensive callout */}
        {savingsPct > 0 && (
          <div className="mt-4 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-zinc-400">
              <span className={`font-medium ${cheapest.color}`}>{cheapest.name}</span>
              {" is "}
              <span className="font-medium text-emerald-400">{savingsPct}% cheaper</span>
              {" than "}
              <span className={`font-medium ${mostExpensive.color}`}>{mostExpensive.name}</span>
              {" for this task — "}
              <span className="text-zinc-500">
                {formatCost(cheapest.monthly)} vs {formatCost(mostExpensive.monthly)}/mo
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Footer — data source attribution */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-3 py-3 sm:px-5">
        <p className="text-[11px] text-zinc-600">
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
    </div>
  );
}
