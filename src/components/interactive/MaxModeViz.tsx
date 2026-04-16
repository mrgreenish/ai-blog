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

// API usage included with Cursor Pro
const PRO_MONTHLY_CREDITS = 20; // USD

// Cost models (USD per 1M tokens, input/output)
// Auto mode (cursor-small / balanced model)
const AUTO_INPUT_PER_M = 1.25;
const AUTO_OUTPUT_PER_M = 6.0;
// Cursor Max Mode: Claude Sonnet 4.6 API rate ($3/$15 per 1M) + ~20% Cursor margin
// Source: cursor.com/pricing — verify when running validate-model-specs
const MAX_INPUT_PER_M = 3.0 * 1.2;
const MAX_OUTPUT_PER_M = 15.0 * 1.2;

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
        <span className={over ? "text-red-600" : ""} style={!over ? { color: "var(--color-fg-secondary)" } : undefined}>
          {fmtTokens(tokens)} / {fmtTokens(limit)} tokens
          {over && " — exceeds limit"}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${over ? "bg-red-500" : barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Limit marker */}
        <div className="absolute inset-y-0 right-0 w-px bg-border-strong"  />
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
    safe: { label: "Within default limits", icon: CheckCircle2, color: "text-emerald-600" },
    warning: { label: "Approaching 200K limit", icon: AlertTriangle, color: "text-amber-600" },
    overflow: { label: "Exceeds default — needs Max Mode", icon: Maximize2, color: "text-violet-600" },
  };
  const sm = STATUS_META[status];
  const StatusIcon = sm.icon;

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-xl border border-violet-500/25 bg-bg-surface"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-border-default"
        
      >
        <div className="rounded-lg p-2 text-violet-600 bg-bg-elevated">
          <Maximize2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold text-violet-600">Cursor Max Mode Calculator</h3>
          <p className="mt-0.5 text-xs text-fg-secondary">
            See when your task needs the 1M-token window — and what it costs
          </p>
        </div>
      </div>

      {/* Scenario presets */}
      <div className="px-4 py-4 sm:px-6 border-b border-border-default">
        <p className="mb-2.5 font-mono text-[11px] font-medium text-fg-secondary">Quick presets</p>
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
                  ? "border-violet-500/50 bg-violet-400/10 text-violet-600"
                  : ""
              }`}
              style={activeScenario !== s.id ? { borderColor: "var(--color-border-strong)", color: "var(--color-fg-secondary)" } : undefined}
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
              className="mt-2.5 text-[11px] text-fg-secondary"
            >
              {SCENARIOS.find((s) => s.id === activeScenario)?.note}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Slider */}
      <div className="px-4 py-4 sm:px-6 border-b border-border-default">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-mono text-[11px] font-medium text-fg-secondary">Files in context</p>
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-violet-600">{files}</span>
            <span className="ml-1 font-mono text-xs text-fg-muted">files</span>
            <span className="ml-2 font-mono text-xs text-fg-muted">
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
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-fg-muted">
          <span>1</span>
          <span>~77 files = 200K limit</span>
          <span>150</span>
        </div>
      </div>

      {/* Context window visualization */}
      <div className="px-4 py-5 sm:px-6 space-y-4 border-b border-border-default">
        <p className="font-mono text-[11px] font-medium text-fg-secondary">Context window usage</p>

        <ContextBar
          tokens={totalTokens}
          limit={DEFAULT_LIMIT_TOKENS}
          limitLabel="Default mode (200K tokens)"
          barColor="bg-stone-400"
          limitColor="text-stone-500"
        />

        <ContextBar
          tokens={totalTokens}
          limit={MAX_MODE_LIMIT_TOKENS}
          limitLabel="Max Mode (1M tokens)"
          barColor="bg-violet-500"
          limitColor="text-violet-600"
        />

        {/* Status badge */}
        <div className={`flex items-center gap-2 ${sm.color}`}>
          <StatusIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-[11px] font-semibold">{sm.label}</span>
        </div>
      </div>

      {/* Cost comparison */}
      <div className="px-4 py-5 sm:px-6 border-b border-border-default">
        <p className="font-mono text-[11px] font-medium mb-4 text-fg-secondary">Cost per session</p>

        <div className="grid grid-cols-2 gap-3">
          {/* Auto mode */}
          <div
            className={`rounded-lg border px-4 py-3 ${needsMaxMode ? "opacity-50" : ""}`}
            style={needsMaxMode
              ? { borderColor: "var(--color-border-default)", background: "var(--color-bg-surface)" }
              : { borderColor: "var(--color-border-strong)", background: "var(--color-bg-elevated)" }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="h-3 w-3 text-fg-secondary" />
              <span className="font-mono text-[11px] font-semibold text-fg-primary">Auto mode</span>
            </div>
            <p className="font-mono text-2xl font-bold text-fg-primary">{formatCost(autoCost)}</p>
            <p className="mt-1 font-mono text-[10px] text-fg-placeholder">per session</p>
            {needsMaxMode && (
              <p className="mt-1.5 font-mono text-[10px] text-amber-500/80">Context truncated at 200K</p>
            )}
          </div>

          {/* Max mode */}
          <div
            className="rounded-lg border px-4 py-3"
            style={needsMaxMode
              ? { borderColor: "rgba(139, 92, 246, 0.4)", background: "rgba(139, 92, 246, 0.05)" }
              : { borderColor: "var(--color-border-default)", background: "var(--color-bg-surface)" }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Maximize2 className="h-3 w-3 text-violet-600" />
              <span className="font-mono text-[11px] font-semibold text-violet-600">Max Mode</span>
            </div>
            <p className="font-mono text-2xl font-bold text-violet-200">{formatCost(maxCost)}</p>
            <p className="mt-1 font-mono text-[10px] text-fg-placeholder">per session (Sonnet 4.6 API + 20%)</p>
            {needsMaxMode && (
              <p className="mt-1.5 font-mono text-[10px] text-violet-600/80">Full context fits ✓</p>
            )}
          </div>
        </div>

        {/* Monthly budget impact */}
        <div className="mt-3 rounded-lg px-4 py-3 bg-bg-elevated border border-border-default">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-muted" />
            <div className="space-y-0.5">
              <p className="font-mono text-[11px] text-fg-secondary">
                Cursor Pro includes{" "}
                <span className="font-semibold text-fg-primary">$20/month of API usage</span>
                {" "}on the API pool.
              </p>
              <p className="font-mono text-[11px] text-fg-muted">
                At Max Mode rates, that pool covers{" "}
                <span className={sessionsBeforeBudgetExhausted < 10 ? "text-amber-600 font-semibold" : "font-semibold"}
                  style={sessionsBeforeBudgetExhausted >= 10 ? { color: "var(--color-fg-primary)" } : undefined}>
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
          className="px-4 py-4 sm:px-6 bg-bg-surface"
        >
          {status === "safe" && (
            <>
              <p className="font-mono text-xs font-semibold text-emerald-600 mb-1">
                Leave Max Mode off
              </p>
              <p className="text-[11px] leading-relaxed text-fg-muted">
                Your context fits comfortably in the default 200K window. Auto mode handles this at a
                fraction of the cost — no reason to flip the Max Mode switch.
              </p>
            </>
          )}
          {status === "warning" && (
            <>
              <p className="font-mono text-xs font-semibold text-amber-600 mb-1">
                You&apos;re close — consider trimming first
              </p>
              <p className="text-[11px] leading-relaxed text-fg-muted">
                You&apos;re near the default limit. Try removing files that aren&apos;t directly relevant before
                enabling Max Mode. Often you can stay under 200K with a tighter selection.
              </p>
            </>
          )}
          {status === "overflow" && (
            <>
              <p className="font-mono text-xs font-semibold text-violet-600 mb-1">
                Max Mode is the right call here
              </p>
              <p className="text-[11px] leading-relaxed text-fg-muted">
                Your task genuinely needs more than 200K tokens of context. Enable Max Mode for this
                session — just remember to turn it off when you&apos;re back to focused, single-file work.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
