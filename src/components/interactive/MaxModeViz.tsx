"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, CheckCircle2, AlertTriangle, Zap, Info } from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// ~13 tokens per line of code (average across mixed languages)
const TOKENS_PER_LINE = 13;
// Default Cursor context limit
const DEFAULT_LIMIT_TOKENS = 200_000;
// Max Mode context limit (largest supported model)
const MAX_MODE_LIMIT_TOKENS = 1_000_000;
// Average lines per file (typical source file)
const LINES_PER_FILE = 200;

// Credit pool included with Cursor Pro
const PRO_MONTHLY_CREDITS = 20; // USD

// Cost models (USD per 1M tokens, input/output)
// Auto mode (cursor-small / balanced model)
const AUTO_INPUT_PER_M = 1.25;
const AUTO_OUTPUT_PER_M = 6.0;
// Max Mode (frontier model, e.g. claude-opus + 20% margin)
const MAX_INPUT_PER_M = 3.0 * 1.2; // $3 + 20% margin
const MAX_OUTPUT_PER_M = 15.0 * 1.2; // $15 + 20% margin

// Output tokens ≈ 15% of input for refactor/analysis tasks
const OUTPUT_RATIO = 0.15;

// ---------------------------------------------------------------------------
// Scenario presets
// ---------------------------------------------------------------------------

interface Scenario {
  id: string;
  label: string;
  files: number;
  note: string;
}

const SCENARIOS: Scenario[] = [
  { id: "single", label: "Single file fix", files: 3, note: "A focused bug fix or component edit — well within default limits." },
  { id: "feature", label: "Feature across 10 files", files: 10, note: "A medium feature touching shared types, routes, and UI components." },
  { id: "refactor", label: "Large refactor (30 files)", files: 30, note: "A cross-cutting change like renaming an abstraction or migrating an API." },
  { id: "codebase", label: "Codebase audit (80+ files)", files: 80, note: "Initial exploration of a large unfamiliar codebase or a full-module migration." },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcCost(inputTokens: number, inputPerM: number, outputPerM: number): number {
  const outputTokens = inputTokens * OUTPUT_RATIO;
  return (inputTokens / 1_000_000) * inputPerM + (outputTokens / 1_000_000) * outputPerM;
}

function formatCost(n: number): string {
  if (n < 0.01) return "<$0.01";
  if (n < 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ContextBar({
  tokens,
  limit,
  limitLabel,
  barColor,
  limitColor,
}: {
  tokens: number;
  limit: number;
  limitLabel: string;
  barColor: string;
  limitColor: string;
}) {
  const pct = Math.min((tokens / limit) * 100, 100);
  const over = tokens > limit;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono text-[10px]">
        <span className={limitColor}>{limitLabel}</span>
        <span className={over ? "text-red-400" : "text-zinc-500"}>
          {fmtTokens(tokens)} / {fmtTokens(limit)} tokens
          {over && " — exceeds limit"}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${over ? "bg-red-500" : barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Limit marker */}
        <div className="absolute inset-y-0 right-0 w-px bg-zinc-600/50" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MaxModeViz() {
  const [files, setFiles] = useState(10);
  const [activeScenario, setActiveScenario] = useState<string | null>("feature");

  const totalLines = files * LINES_PER_FILE;
  const totalTokens = totalLines * TOKENS_PER_LINE;
  const needsMaxMode = totalTokens > DEFAULT_LIMIT_TOKENS;

  const autoCost = calcCost(Math.min(totalTokens, DEFAULT_LIMIT_TOKENS), AUTO_INPUT_PER_M, AUTO_OUTPUT_PER_M);
  const maxCost = calcCost(totalTokens, MAX_INPUT_PER_M, MAX_OUTPUT_PER_M);

  const sessionsBeforeBudgetExhausted = useMemo(
    () => Math.floor(PRO_MONTHLY_CREDITS / maxCost),
    [maxCost]
  );

  // Status
  type Status = "safe" | "warning" | "overflow";
  const status: Status =
    totalTokens <= DEFAULT_LIMIT_TOKENS * 0.7
      ? "safe"
      : totalTokens <= DEFAULT_LIMIT_TOKENS
      ? "warning"
      : "overflow";

  const STATUS_META = {
    safe: { label: "Within default limits", icon: CheckCircle2, color: "text-emerald-400" },
    warning: { label: "Approaching 200K limit", icon: AlertTriangle, color: "text-amber-400" },
    overflow: { label: "Exceeds default — needs Max Mode", icon: Maximize2, color: "text-violet-400" },
  };
  const sm = STATUS_META[status];
  const StatusIcon = sm.icon;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-400/25 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="rounded-lg bg-zinc-800 p-2 text-violet-400">
          <Maximize2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold text-violet-400">Cursor Max Mode Calculator</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            See when your task needs the 1M-token window — and what it costs
          </p>
        </div>
      </div>

      {/* Scenario presets */}
      <div className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-zinc-500">Quick presets</p>
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScenario(s.id);
                setFiles(s.files);
              }}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                activeScenario === s.id
                  ? "border-violet-400/50 bg-violet-400/10 text-violet-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeScenario && (
            <motion.p
              key={activeScenario}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-2.5 text-[11px] text-zinc-500"
            >
              {SCENARIOS.find((s) => s.id === activeScenario)?.note}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Slider */}
      <div className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-mono text-[11px] font-medium text-zinc-500">Files in context</p>
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-violet-300">{files}</span>
            <span className="ml-1 font-mono text-xs text-zinc-600">files</span>
            <span className="ml-2 font-mono text-xs text-zinc-600">
              ≈ {fmtTokens(totalTokens)} tokens
            </span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={150}
          step={1}
          value={files}
          onChange={(e) => {
            setActiveScenario(null);
            setFiles(Number(e.target.value));
          }}
          className="w-full cursor-pointer accent-violet-500"
          style={{ height: "4px" }}
        />
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-zinc-700">
          <span>1</span>
          <span>~77 files = 200K limit</span>
          <span>150</span>
        </div>
      </div>

      {/* Context window visualization */}
      <div className="border-b border-zinc-800 px-4 py-5 sm:px-6 space-y-4">
        <p className="font-mono text-[11px] font-medium text-zinc-500">Context window usage</p>

        <ContextBar
          tokens={totalTokens}
          limit={DEFAULT_LIMIT_TOKENS}
          limitLabel="Default mode (200K tokens)"
          barColor="bg-zinc-500"
          limitColor="text-zinc-400"
        />

        <ContextBar
          tokens={totalTokens}
          limit={MAX_MODE_LIMIT_TOKENS}
          limitLabel="Max Mode (1M tokens)"
          barColor="bg-violet-500"
          limitColor="text-violet-400"
        />

        {/* Status badge */}
        <div className={`flex items-center gap-2 ${sm.color}`}>
          <StatusIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-[11px] font-semibold">{sm.label}</span>
        </div>
      </div>

      {/* Cost comparison */}
      <div className="border-b border-zinc-800 px-4 py-5 sm:px-6">
        <p className="font-mono text-[11px] font-medium text-zinc-500 mb-4">Cost per session</p>

        <div className="grid grid-cols-2 gap-3">
          {/* Auto mode */}
          <div className={`rounded-lg border px-4 py-3 ${needsMaxMode ? "border-zinc-700/40 bg-zinc-900/30 opacity-50" : "border-zinc-600 bg-zinc-800/40"}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="h-3 w-3 text-zinc-400" />
              <span className="font-mono text-[11px] font-semibold text-zinc-300">Auto mode</span>
            </div>
            <p className="font-mono text-2xl font-bold text-zinc-200">{formatCost(autoCost)}</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-600">per session</p>
            {needsMaxMode && (
              <p className="mt-1.5 font-mono text-[10px] text-amber-500/80">Context truncated at 200K</p>
            )}
          </div>

          {/* Max mode */}
          <div className={`rounded-lg border px-4 py-3 ${needsMaxMode ? "border-violet-500/40 bg-violet-500/5" : "border-zinc-700/40 bg-zinc-900/30"}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <Maximize2 className="h-3 w-3 text-violet-400" />
              <span className="font-mono text-[11px] font-semibold text-violet-300">Max Mode</span>
            </div>
            <p className="font-mono text-2xl font-bold text-violet-200">{formatCost(maxCost)}</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-600">per session (API + 20%)</p>
            {needsMaxMode && (
              <p className="mt-1.5 font-mono text-[10px] text-violet-400/80">Full context fits ✓</p>
            )}
          </div>
        </div>

        {/* Monthly budget impact */}
        <div className="mt-3 rounded-lg border border-zinc-700/40 bg-zinc-800/30 px-4 py-3">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
            <div className="space-y-0.5">
              <p className="font-mono text-[11px] text-zinc-400">
                Cursor Pro includes a{" "}
                <span className="text-zinc-200 font-semibold">$20/month credit pool</span>
                {" "}for non-Auto models.
              </p>
              <p className="font-mono text-[11px] text-zinc-500">
                At Max Mode rates, that pool covers{" "}
                <span className={sessionsBeforeBudgetExhausted < 10 ? "text-amber-400 font-semibold" : "text-zinc-300 font-semibold"}>
                  ~{sessionsBeforeBudgetExhausted} sessions
                </span>
                {sessionsBeforeBudgetExhausted < 10 && " before you run out"}.
                {sessionsBeforeBudgetExhausted >= 10 && " — reasonable for selective use."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900/40 px-4 py-4 sm:px-6"
        >
          {status === "safe" && (
            <>
              <p className="font-mono text-xs font-semibold text-emerald-400 mb-1">
                Leave Max Mode off
              </p>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Your context fits comfortably in the default 200K window. Auto mode handles this at a
                fraction of the cost — no reason to flip the Max Mode switch.
              </p>
            </>
          )}
          {status === "warning" && (
            <>
              <p className="font-mono text-xs font-semibold text-amber-400 mb-1">
                You're close — consider trimming first
              </p>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                You're near the default limit. Try removing files that aren't directly relevant before
                enabling Max Mode. Often you can stay under 200K with a tighter selection.
              </p>
            </>
          )}
          {status === "overflow" && (
            <>
              <p className="font-mono text-xs font-semibold text-violet-400 mb-1">
                Max Mode is the right call here
              </p>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Your task genuinely needs more than 200K tokens of context. Enable Max Mode for this
                session — just remember to turn it off when you're back to focused, single-file work.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
