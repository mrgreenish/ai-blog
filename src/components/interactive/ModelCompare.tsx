"use client";

import { useState } from "react";
import { BarChart3, Maximize2, ClipboardCheck } from "lucide-react";
import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { getContextWindowModels, BENCHMARK_CHECKS, getDevBenchmarkColumns } from "@/lib/modelSpecs";

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

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.tokens, 0);

function formatK(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}k`;
}

// =============================================================================
// Benchmark preview data
// =============================================================================

const COLUMNS = getDevBenchmarkColumns();

function Pass({ val }: { val: boolean }) {
  return (
    <span className={`font-mono text-xs ${val ? "text-red-400" : "text-emerald-400"}`}>
      {val ? "✗ fail" : "✓ pass"}
    </span>
  );
}

// =============================================================================
// Tab toggle (inside preview)
// =============================================================================

type CompareTab = "context" | "benchmarks";

function TabToggle({ tab, onChange }: { tab: CompareTab; onChange: (t: CompareTab) => void }) {
  return (
    <div className="mb-4 inline-flex rounded-lg border border-zinc-700/50 bg-zinc-800/60 p-0.5">
      {([
        { id: "context" as const, label: "Context Windows", icon: Maximize2 },
        { id: "benchmarks" as const, label: "Benchmarks", icon: ClipboardCheck },
      ]).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
            tab === id
              ? "bg-cyan-400/15 text-cyan-300 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Combined preview
// =============================================================================

function CombinedPreview() {
  const [tab, setTab] = useState<CompareTab>("context");

  return (
    <div>
      <TabToggle tab={tab} onChange={setTab} />

      {tab === "context" ? (
        <div>
          <div className="mb-3 flex flex-wrap gap-3 text-xs">
            {SEGMENTS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-sm ${s.color}`} />
                <span className="text-zinc-400">
                  {s.label}{" "}
                  <span className="font-mono text-zinc-500">({formatK(s.tokens)})</span>
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {CONTEXT_MODELS.map((m) => {
              const pct = Math.min((TOTAL / m.limit) * 100, 100);
              return (
                <div key={m.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300">{m.name}</span>
                    <span className="text-zinc-500">
                      {formatK(TOTAL)} / {formatK(m.limit)} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded bg-zinc-800">
                    <div className="flex h-full" style={{ width: `${pct}%` }}>
                      {SEGMENTS.map((s) => (
                        <div
                          key={s.label}
                          className={`h-full ${s.color}`}
                          style={{ width: `${(s.tokens / TOTAL) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Answers &quot;will this fit?&quot; before you hit the limit mid-task.
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="pb-2 text-left font-mono text-zinc-500 pr-4">Check</th>
                  {COLUMNS.map((col) => (
                    <th key={col.id} className={`pb-2 text-center font-mono ${col.color} px-3`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {BENCHMARK_CHECKS.map((c) => (
                  <tr key={c.check} className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4 text-zinc-400 leading-tight">{c.check}</td>
                    {COLUMNS.map((col) => (
                      <td key={col.id} className="py-2 text-center px-3">
                        <Pass val={col.benchmark[c.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Not leaderboard scores — checks that matter when shipping.
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function ModelCompare() {
  return (
    <InteractivePlaceholder
      icon={BarChart3}
      title="Model Compare"
      tagline="Context windows and developer benchmarks side by side"
      description="Compare model context limits and real-world developer checks — not abstract leaderboard scores, but tests that matter when shipping production code."
      preview={<CombinedPreview />}
      accentColor="text-cyan-400"
      borderColor="border-cyan-400/30"
    />
  );
}
