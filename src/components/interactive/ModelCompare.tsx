"use client";

import { useState } from "react";
import { BarChart3, Maximize2, ClipboardCheck } from "lucide-react";
import {
  getContextWindowModels,
  BENCHMARK_CHECKS,
  getDevBenchmarkColumns,
} from "@/lib/modelSpecs";
import { ModeToggle, CopyButton } from "@/components/ui/WorkflowPrimitives";

// =============================================================================
// Context Window preview data
// =============================================================================

const CONTEXT_MODELS = getContextWindowModels();

const SEGMENTS = [
  { label: "System prompt", tokens: 2_000, color: "bg-violet-500" },
  { label: "Codebase", tokens: 40_000, color: "bg-blue-500" },
  { label: "Docs", tokens: 15_000, color: "bg-emerald-500" },
  { label: "Conversation", tokens: 8_000, color: "bg-amber-500" },
];

function formatK(n: number) {
  return n >= 1_000_000
    ? `${Number((n / 1_000_000).toFixed(2))}M`
    : `${Math.round(n / 1000)}k`;
}

// =============================================================================
// Benchmark preview data
// =============================================================================

const ALL_COLUMNS = getDevBenchmarkColumns();
const COLUMNS = ALL_COLUMNS.filter((column) =>
  Object.values(column.benchmark).some((value) => value !== null),
);
const REVIEW_CHECKS = [
  "Run the same representative task with each candidate model and record the model version, prompt, and date.",
  "Verify framework APIs against the installed version and run the relevant build and tests.",
  "Check that the changes follow the acceptance criteria and stay within the requested scope.",
  "Open cited documentation and check that sources support the claims.",
  "Inspect edge cases and prove that the result fixes the original problem without a regression.",
  "Record retries, actual token cost, elapsed time, and review effort alongside the output.",
];

function Pass({ val, positive }: { val: boolean | null; positive: boolean }) {
  if (val === null) {
    return (
      <span className="font-mono text-xs text-stone-400">— not tested</span>
    );
  }
  return (
    <span
      className={`font-mono text-xs ${val === positive ? "text-emerald-600" : "text-red-600"}`}
    >
      {val === positive ? "✓ pass" : "✗ fail"}
    </span>
  );
}

// =============================================================================
// Tab toggle (inside preview)
// =============================================================================

type CompareTab = "context" | "benchmarks";

const COMPARE_TAB_OPTIONS = [
  { id: "context" as const, label: "Context Windows", icon: Maximize2 },
  {
    id: "benchmarks" as const,
    label: "Developer checks",
    icon: ClipboardCheck,
  },
] as const;

// =============================================================================
// Combined preview
// =============================================================================

function CombinedPreview() {
  const [tab, setTab] = useState<CompareTab>("context");
  const [tokens, setTokens] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      SEGMENTS.map((segment) => [segment.label, segment.tokens]),
    ),
  );
  const total = Object.values(tokens).reduce((sum, value) => sum + value, 0);

  return (
    <div>
      <ModeToggle
        mode={tab}
        onChange={setTab}
        options={COMPARE_TAB_OPTIONS}
        accent="cyan"
      />

      <div className="p-4 sm:p-5">
        {tab === "context" ? (
          <div>
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              {SEGMENTS.map((segment) => (
                <label
                  key={segment.label}
                  className="text-xs text-fg-secondary"
                >
                  {segment.label} tokens
                  <input
                    aria-label={`${segment.label} tokens`}
                    type="number"
                    min={0}
                    max={2_000_000}
                    step={1000}
                    value={tokens[segment.label]}
                    onChange={(event) =>
                      setTokens((previous) => ({
                        ...previous,
                        [segment.label]: Math.min(
                          2_000_000,
                          Math.max(0, Number(event.target.value) || 0),
                        ),
                      }))
                    }
                    className="mt-2 w-full rounded-md border border-border-strong bg-bg-page p-2 text-sm text-fg-primary"
                  />
                </label>
              ))}
            </div>
            <p className="mb-4 text-sm text-fg-secondary" role="status">
              {total.toLocaleString("en-US")} input tokens ·{" "}
              {CONTEXT_MODELS.filter((model) => model.limit > total).length} of{" "}
              {CONTEXT_MODELS.length} models have room left for output.
            </p>
            <div className="mb-3 flex flex-wrap gap-3 text-xs">
              {SEGMENTS.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-sm ${s.color}`} />
                  <span className="text-stone-500">
                    {s.label}{" "}
                    <span className="font-mono text-stone-500">
                      ({formatK(tokens[s.label])})
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {CONTEXT_MODELS.map((m) => {
                const pct = Math.min((total / m.limit) * 100, 100);
                return (
                  <div key={m.name}>
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-stone-700">{m.name}</span>
                      <span className="text-stone-500">
                        {formatK(total)} / {formatK(m.limit)} (
                        {Math.round((total / m.limit) * 100)}%)
                        {total >= m.limit ? " · No room for output" : ""}
                      </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded bg-stone-200">
                      <div className="flex h-full" style={{ width: `${pct}%` }}>
                        {SEGMENTS.map((s) => (
                          <div
                            key={s.label}
                            className={`h-full ${s.color}`}
                            style={{
                              width: `${total > 0 ? (tokens[s.label] / total) * 100 : 0}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-stone-400">
              Provider API limits. Leave room for the response and tool history;
              editor limits can differ.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5 space-y-3">
              <h4 className="text-base font-semibold">
                Test the models on your own task
              </h4>
              <p className="text-sm text-fg-secondary">
                {ALL_COLUMNS.length - COLUMNS.length} listed models have no
                recorded local checks. Use this checklist to compare candidates
                with evidence from your project.
              </p>
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-fg-secondary">
                {REVIEW_CHECKS.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ol>
              <CopyButton
                label="Copy review checklist"
                accentColor="emerald"
                getText={() =>
                  [
                    "# Model evaluation checklist",
                    "",
                    ...REVIEW_CHECKS.map((check) => `- [ ] ${check}`),
                  ].join("\n")
                }
              />
            </div>
            {COLUMNS.length > 0 && (
              <>
                <div
                  className="overflow-x-auto"
                  role="region"
                  aria-label="Historical developer checks"
                  tabIndex={0}
                >
                  <table className="w-full text-xs">
                    <caption className="mb-3 text-left text-xs text-fg-secondary">
                      Historical project checks. Missing results are marked “not
                      tested”.
                    </caption>
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th
                          scope="col"
                          className="pb-2 text-left font-mono text-stone-500 pr-4"
                        >
                          Check
                        </th>
                        {COLUMNS.map((col) => (
                          <th
                            scope="col"
                            key={col.id}
                            className={`pb-2 text-center font-mono ${col.color} px-3`}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {BENCHMARK_CHECKS.map((c) => (
                        <tr
                          key={c.check}
                          className="border-b border-stone-200/50"
                        >
                          <td className="py-2 pr-4 text-stone-500 leading-tight">
                            {c.check}
                          </td>
                          {COLUMNS.map((col) => (
                            <td key={col.id} className="py-2 text-center px-3">
                              <Pass
                                val={col.benchmark[c.key]}
                                positive={
                                  c.key === "correctServerAction" ||
                                  c.key === "followedConstraints"
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-stone-400">
                  Older project checks are retained without original run logs.
                  “Not tested” means no local result is recorded for that
                  version.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function ModelCompare() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border-strong bg-bg-surface">
      <div className="flex items-center gap-3 border-b border-border-default px-5 py-4">
        <BarChart3 aria-hidden="true" className="h-5 w-5 text-cyan-700" />
        <div>
          <h3 className="font-mono text-sm font-semibold">Model Compare</h3>
          <p className="mt-1 text-xs text-fg-secondary">
            Explore context capacity and build a practical model review
            checklist.
          </p>
        </div>
      </div>
      <CombinedPreview />
    </div>
  );
}
