"use client";

import { Calculator } from "lucide-react";
import { QuickEstimate } from "./ModelMixer";

export function CostCalculator() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-emerald-400/30 bg-zinc-900/60">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-emerald-400">
          <Calculator className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-emerald-400">Cost Calculator</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Compare token costs across models for common tasks
          </p>
        </div>
      </div>
      <QuickEstimate />
    </div>
  );
}
