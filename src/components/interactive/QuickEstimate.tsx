"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  getCostCalculatorModels,
  estimateModelCost,
  PRICING_META,
} from "@/lib/modelSpecs";
import { CopyButton } from "@/components/ui/WorkflowPrimitives";

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
    description:
      "Paste a stack trace and get a plain-English explanation with a fix.",
    inputTokens: 800,
    outputTokens: 500,
    complexityNote:
      "A fast model handles this well. The answer is either right or obviously wrong — no back-and-forth needed.",
  },
  {
    id: "code-review",
    label: "Code review",
    description:
      "Review a medium-sized file and get structured feedback on issues and improvements.",
    inputTokens: 4000,
    outputTokens: 1500,
    complexityNote:
      "A fast model catches obvious issues. A stronger model finds subtle logic bugs and gives more actionable feedback — fewer missed problems means less rework later.",
  },
  {
    id: "generate-tests",
    label: "Generate unit tests",
    description:
      "Send a module and get a full test suite back covering edge cases.",
    inputTokens: 3000,
    outputTokens: 4000,
    complexityNote:
      "Fast models produce boilerplate tests quickly. A stronger model reasons about edge cases and failure modes — one good suite beats three mediocre ones you have to fix.",
  },
  {
    id: "refactor",
    label: "Refactor a component",
    description:
      "Send a full component and get a cleaned-up, restructured version.",
    inputTokens: 5000,
    outputTokens: 6000,
    complexityNote:
      "Refactoring requires understanding intent, not just syntax. A stronger model is more likely to get it right first try — saving the time you'd spend correcting a cheaper model's misread.",
  },
  {
    id: "build-feature",
    label: "Build a feature",
    description:
      "Provide a spec and existing context; get multi-file implementation back.",
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

function formatEstimateCost(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.0001) return "<$0.0001";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function formatTokens(n: number): string {
  return n >= 1000 ? `${Number((n / 1000).toFixed(1))}k` : `${n}`;
}

export function QuickEstimate() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[1].id);
  const [frequencyId, setFrequencyId] = useState(FREQUENCIES[2].id);

  const [inputTokens, setInputTokens] = useState(SCENARIOS[1].inputTokens);
  const [outputTokens, setOutputTokens] = useState(SCENARIOS[1].outputTokens);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const frequency =
    FREQUENCIES.find((f) => f.id === frequencyId) ?? FREQUENCIES[2];

  const rows = COST_MODELS.map((m) => {
    const perRun = estimateModelCost(m.id, inputTokens, outputTokens);
    const monthly = perRun * frequency.runsPerDay * 30;
    return { ...m, perRun, monthly };
  }).sort((a, b) => a.monthly - b.monthly);

  const maxMonthly = rows[rows.length - 1]?.monthly ?? 1;
  const cheapest = rows[0];
  const mostExpensive = rows[rows.length - 1];
  const savingsPct =
    mostExpensive.monthly > 0
      ? Math.round(
          ((mostExpensive.monthly - cheapest.monthly) / mostExpensive.monthly) *
            100,
        )
      : 0;

  return (
    <>
      {/* Scenario selector */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-border-default">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-fg-secondary">
          Pick a task
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              aria-pressed={s.id === scenarioId}
              onClick={() => {
                setScenarioId(s.id);
                setInputTokens(s.inputTokens);
                setOutputTokens(s.outputTokens);
              }}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                s.id === scenarioId
                  ? "border-emerald-500/50 bg-emerald-400/10 text-emerald-600"
                  : ""
              }`}
              style={
                s.id !== scenarioId
                  ? {
                      borderColor: "var(--color-border-strong)",
                      color: "var(--color-fg-secondary)",
                    }
                  : undefined
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] text-fg-secondary">
            {scenario.description}
          </p>
          <span className="shrink-0 font-mono text-[10px] text-fg-muted">
            ~{formatTokens(inputTokens)} in / ~{formatTokens(outputTokens)} out
          </span>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border-default px-4 py-4 sm:grid-cols-2 sm:px-5">
        <label className="text-xs text-fg-secondary">
          Input tokens per run
          <input
            aria-label="Input tokens per run"
            type="number"
            min={0}
            max={2_000_000}
            step={100}
            value={inputTokens}
            onChange={(event) =>
              setInputTokens(
                Math.min(
                  2_000_000,
                  Math.max(0, Number(event.target.value) || 0),
                ),
              )
            }
            className="mt-2 w-full rounded-md border border-border-strong bg-bg-page p-2 text-sm text-fg-primary"
          />
        </label>
        <label className="text-xs text-fg-secondary">
          Output tokens per run
          <input
            aria-label="Output tokens per run"
            type="number"
            min={0}
            max={2_000_000}
            step={100}
            value={outputTokens}
            onChange={(event) =>
              setOutputTokens(
                Math.min(
                  2_000_000,
                  Math.max(0, Number(event.target.value) || 0),
                ),
              )
            }
            className="mt-2 w-full rounded-md border border-border-strong bg-bg-page p-2 text-sm text-fg-primary"
          />
        </label>
      </div>
      {/* Frequency selector */}
      <div className="px-3 py-3 sm:px-5 sm:py-3 border-b border-border-default">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="font-mono text-[11px] font-medium text-fg-secondary">
            How often?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                aria-pressed={f.id === frequencyId}
                onClick={() => setFrequencyId(f.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  f.id === frequencyId
                    ? "border-emerald-500/50 bg-emerald-400/10 text-emerald-600"
                    : ""
                }`}
                style={
                  f.id !== frequencyId
                    ? {
                        borderColor: "var(--color-border-strong)",
                        color: "var(--color-fg-secondary)",
                      }
                    : undefined
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <p className="text-xs text-fg-secondary" role="status">
          {frequency.runsPerDay * 30} runs / 30-day month ·{" "}
          {inputTokens.toLocaleString("en-US")} input +{" "}
          {outputTokens.toLocaleString("en-US")} output tokens per run
        </p>
        <CopyButton
          label="Copy estimate"
          accentColor="emerald"
          getText={() =>
            [
              "# API cost estimate",
              `${inputTokens} input and ${outputTokens} output tokens/run; ${frequency.runsPerDay} runs/day; 30 days/month.`,
              "",
              ...rows.map(
                (row) =>
                  `${row.name}: ${formatEstimateCost(row.perRun)}/run; ${formatEstimateCost(row.monthly)}/month`,
              ),
              "",
              "Token-only estimates. Check context and output capacity before sending a request.",
              ...PRICING_META.notes,
            ].join("\n")
          }
        />
      </div>
      {/* Cost bars */}
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <div className="space-y-2">
          {rows.map((m, i) => {
            const pct = maxMonthly > 0 ? (m.monthly / maxMonthly) * 100 : 0;
            return (
              <motion.div
                key={m.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="estimate-row"
              >
                <div className={`estimate-model font-mono text-xs ${m.color}`}>
                  {m.name}
                </div>
                <div className="estimate-bar relative h-7 overflow-hidden rounded bg-bg-elevated">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded bg-emerald-400/20"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-fg-primary">
                    {formatEstimateCost(m.monthly)}/mo
                  </span>
                </div>
                <div className="estimate-run text-right font-mono text-xs text-fg-muted">
                  {formatEstimateCost(m.perRun)}/run
                </div>
              </motion.div>
            );
          })}
        </div>

        {savingsPct > 0 && (
          <div className="mt-4 rounded-lg px-3 py-2.5 space-y-1.5 bg-bg-elevated border border-border-default">
            <p className="text-[11px] leading-relaxed text-fg-secondary">
              <span className={`font-medium ${cheapest.color}`}>
                {cheapest.name}
              </span>
              {" is "}
              <span className="font-medium text-emerald-600">
                {savingsPct}% cheaper
              </span>
              {" than "}
              <span className={`font-medium ${mostExpensive.color}`}>
                {mostExpensive.name}
              </span>
              {" at these token assumptions — "}
              <span className="text-fg-secondary">
                {formatEstimateCost(cheapest.monthly)} vs{" "}
                {formatEstimateCost(mostExpensive.monthly)}/mo
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
          {(Object.entries(PRICING_META.urls) as [string, string][]).map(
            ([provider, url], i, arr) => (
              <span key={provider}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 underline decoration-stone-700 underline-offset-2 hover:text-stone-500"
                >
                  {provider}
                </a>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ),
          )}
        </p>
        <details className="mt-3 text-xs text-fg-muted">
          <summary className="cursor-pointer py-2 font-medium">
            Pricing assumptions and capacity limits
          </summary>
          <p className="mt-2 leading-relaxed">
            {PRICING_META.notes.join(" ")} These are cost estimates, not a
            capacity check. Verify context and output limits for large requests.
          </p>
        </details>
      </div>
    </>
  );
}
