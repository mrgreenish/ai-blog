"use client";

import { Calculator } from "lucide-react";
import { QuickEstimate } from "./ModelMixer";

export function CostCalculator() {
  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-xl border border-emerald-400/30 bg-bg-surface"
    >
      <div
        className="flex items-center gap-3 px-3 py-3 sm:px-5 sm:py-4 border-b border-border-default"
        
      >
        <div className="rounded-lg p-2 text-emerald-400 bg-bg-elevated">
          <Calculator className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-emerald-400">Cost Calculator</h3>
          <p className="mt-0.5 text-xs text-fg-muted">
            Compare token costs across models for common tasks
          </p>
        </div>
      </div>
      <QuickEstimate />
    </div>
  );
}
