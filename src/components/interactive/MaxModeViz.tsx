"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Tier definitions
// ---------------------------------------------------------------------------

interface Tier {
  id: string;
  name: string;
  monthlyUSD: number;
  dailyCapacity: number; // relative scale (Pro = 100)
  color: string;
  accentBg: string;
  borderColor: string;
  description: string;
}

const TIERS: Tier[] = [
  {
    id: "pro",
    name: "Claude Pro",
    monthlyUSD: 20,
    dailyCapacity: 45,
    color: "text-zinc-300",
    accentBg: "bg-zinc-500",
    borderColor: "border-zinc-700",
    description: "Standard tier for regular use",
  },
  {
    id: "max5x",
    name: "Max 5×",
    monthlyUSD: 100,
    dailyCapacity: 225,
    color: "text-violet-300",
    accentBg: "bg-violet-500",
    borderColor: "border-violet-700/50",
    description: "5× more usage than Pro",
  },
  {
    id: "max20x",
    name: "Max 20×",
    monthlyUSD: 200,
    dailyCapacity: 900,
    color: "text-blue-300",
    accentBg: "bg-blue-500",
    borderColor: "border-blue-700/50",
    description: "20× more usage than Pro",
  },
];

// API cost estimate: avg conversation ~2k input + 800 output tokens via Sonnet 4.6
// $3/M input + $15/M output → ~$0.018 per conversation
const API_COST_PER_CONVO = 0.018;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type TierStatus = "good" | "near" | "over" | "overkill";

function getTierStatus(usage: number, capacity: number): TierStatus {
  const ratio = usage / capacity;
  if (ratio > 1) return "over";
  if (ratio > 0.75) return "near";
  if (ratio < 0.20) return "overkill";
  return "good";
}

const STATUS_META: Record<TierStatus, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  good: { label: "Good fit", icon: CheckCircle2, classes: "text-emerald-400" },
  near: { label: "Near limit", icon: AlertTriangle, classes: "text-amber-400" },
  over: { label: "Over limit", icon: XCircle, classes: "text-red-400" },
  overkill: { label: "Overkill", icon: TrendingUp, classes: "text-zinc-500" },
};

function formatCost(n: number) {
  if (n < 1) return `<$1`;
  return `$${Math.round(n)}`;
}

function getBestTier(usage: number): string {
  // Find cheapest tier that can handle the usage
  const apiMonthlyCost = API_COST_PER_CONVO * usage * 30;

  // Build candidates: subscription tiers where usage <= capacity
  const candidates: { id: string; cost: number }[] = TIERS.filter(
    (t) => usage <= t.dailyCapacity
  ).map((t) => ({ id: t.id, cost: t.monthlyUSD }));

  // Also consider API
  candidates.push({ id: "api", cost: apiMonthlyCost });

  if (candidates.length === 0) return "api";

  return candidates.reduce((best, c) => (c.cost < best.cost ? c : best)).id;
}

const RECOMMENDATIONS: Record<string, { headline: string; detail: string }> = {
  pro: {
    headline: "Claude Pro handles you fine",
    detail:
      "You're well within Pro limits. At $20/month it's probably your best value — unless you're hitting the daily ceiling regularly.",
  },
  max5x: {
    headline: "Max 5× is your sweet spot",
    detail:
      "You're exceeding what Pro can sustain, but Max 20× would be excessive at your volume. Max 5× gives you room to grow without overpaying.",
  },
  max20x: {
    headline: "Max 20× matches your scale",
    detail:
      "Heavy daily usage like yours pushes past Max 5×. Max 20× keeps you in a flat monthly cost instead of throttling mid-day.",
  },
  api: {
    headline: "Direct API beats subscriptions here",
    detail:
      "At this volume a subscription makes sense, but the API is cheaper if you're accessing Claude programmatically or running automated workflows.",
  },
};

// Sliding tick labels
const SLIDER_LABELS = [
  { value: 5, label: "5" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 150, label: "150" },
  { value: 200, label: "200" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MaxModeViz() {
  const [usage, setUsage] = useState(30); // daily conversations

  const apiMonthly = useMemo(() => API_COST_PER_CONVO * usage * 30, [usage]);
  const bestTierId = useMemo(() => getBestTier(usage), [usage]);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-400/25 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="rounded-lg bg-zinc-800 p-2 text-violet-400">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold text-violet-400">Max Mode Calculator</h3>
          <p className="mt-0.5 text-xs text-zinc-500">Find the tier that fits your actual usage</p>
        </div>
      </div>

      {/* Slider */}
      <div className="border-b border-zinc-800 px-4 py-5 sm:px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-mono text-[11px] font-medium text-zinc-500">Daily AI conversations</p>
          <span className="font-mono text-lg font-bold text-violet-300">{usage}<span className="text-xs text-zinc-600 ml-1">/day</span></span>
        </div>

        {/* Custom slider */}
        <input
          type="range"
          min={1}
          max={200}
          step={1}
          value={usage}
          onChange={(e) => setUsage(Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
          style={{ height: "4px" }}
        />

        {/* Tick labels */}
        <div className="mt-1.5 flex justify-between">
          {SLIDER_LABELS.map(({ value, label }) => (
            <span
              key={value}
              className={`font-mono text-[10px] transition-colors ${
                Math.abs(usage - value) < 8 ? "text-violet-400" : "text-zinc-700"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Tier rows */}
      <div className="px-4 py-5 sm:px-6 space-y-3">
        <p className="font-mono text-[11px] font-medium text-zinc-500 mb-4">Subscription tiers</p>

        {TIERS.map((tier) => {
          const status = getTierStatus(usage, tier.dailyCapacity);
          const statusMeta = STATUS_META[status];
          const StatusIcon = statusMeta.icon;
          const isBest = bestTierId === tier.id;
          const usagePct = Math.min((usage / tier.dailyCapacity) * 100, 100);

          return (
            <motion.div
              key={tier.id}
              layout
              className={`relative overflow-hidden rounded-lg border px-4 py-3 transition-colors ${
                isBest
                  ? "border-violet-500/40 bg-violet-500/5"
                  : `${tier.borderColor} bg-zinc-900/40`
              }`}
            >
              {isBest && (
                <span className="absolute right-2 top-2 rounded font-mono text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-400/10 px-1.5 py-0.5">
                  Best fit
                </span>
              )}

              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-semibold ${tier.color}`}>
                    {tier.name}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-600">{tier.description}</span>
                </div>
                <span className={`font-mono text-[11px] font-bold ${tier.color}`}>
                  ${tier.monthlyUSD}/mo
                </span>
              </div>

              {/* Capacity bar */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    status === "over"
                      ? "bg-red-500"
                      : status === "near"
                      ? "bg-amber-500"
                      : tier.accentBg
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePct}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600">
                  {Math.round(usagePct)}% of {tier.dailyCapacity} conv/day capacity
                </span>
                <div className={`flex items-center gap-1 ${statusMeta.classes}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="font-mono text-[10px]">{statusMeta.label}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* API row */}
        <div
          className={`rounded-lg border px-4 py-3 transition-colors ${
            bestTierId === "api"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-zinc-700/50 bg-zinc-900/40"
          }`}
        >
          {bestTierId === "api" && (
            <span className="float-right rounded font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5">
              Best fit
            </span>
          )}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-emerald-300">API (pay-per-token)</span>
              <span className="font-mono text-[11px] text-zinc-600">No limits, billed by usage</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-300">
              ~{formatCost(apiMonthly)}/mo
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono">
            Based on ~{usage} conv/day × avg Sonnet 4.6 pricing · scales linearly
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bestTierId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-4 sm:px-6"
        >
          <p className="font-mono text-xs font-semibold text-zinc-200 mb-1">
            {RECOMMENDATIONS[bestTierId]?.headline ?? ""}
          </p>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            {RECOMMENDATIONS[bestTierId]?.detail ?? ""}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
