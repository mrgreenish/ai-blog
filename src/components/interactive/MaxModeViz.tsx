"use client";

import { useId, useState } from "react";
import { Maximize2 } from "lucide-react";
import { MODEL_REGISTRY, MODEL_BY_ID, estimateModelCost, getEffectiveModelPricing, PRICING_META } from "@/lib/modelSpecs";

const MODELS = MODEL_REGISTRY.filter((model) => !model.retired);

export function MaxModeViz() {
  const prefix = useId();
  const [modelId, setModelId] = useState("sonnet-5");
  const [inputTokens, setInputTokens] = useState(200_000);
  const [outputTokens, setOutputTokens] = useState(20_000);
  const [budget, setBudget] = useState(20);
  const [legacyMax, setLegacyMax] = useState(false);
  const model = MODEL_BY_ID[modelId];
  const pricing = getEffectiveModelPricing(model);
  const totalTokens = inputTokens + outputTokens;
  const exceedsContext = totalTokens > model.contextWindowTokens;
  const rawCost = estimateModelCost(modelId, inputTokens, outputTokens);
  const cost = rawCost * (legacyMax ? 1.2 : 1);
  const sessions = cost > 0 ? Math.floor(budget / cost) : 0;
  const long = model.longContextPricing;
  const hasSurcharge = long && inputTokens > long.thresholdTokens;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-violet-500/25 bg-bg-surface">
      <div className="flex items-center gap-3 border-b border-border-default px-4 py-4 sm:px-6">
        <Maximize2 className="h-5 w-5 text-violet-600" />
        <div>
          <h3 className="font-mono text-sm font-semibold text-violet-600">Context and token cost calculator</h3>
          <p className="mt-1 text-xs text-fg-secondary">Compare provider API capacity and the cost of a large request.</p>
        </div>
      </div>
      <div className="space-y-5 px-4 py-5 sm:px-6">
        <div>
          <label htmlFor={`${prefix}-model`} className="block text-sm text-fg-primary">Model</label>
          <select id={`${prefix}-model`} value={modelId} onChange={(event) => setModelId(event.target.value)} className="mt-2 w-full rounded-md border border-border-default bg-bg-elevated p-2 text-sm text-fg-primary">
            {MODELS.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-xs text-fg-secondary">
            Input tokens
            <input aria-label="Input tokens" type="number" min={0} max={2_000_000} step={1000} value={inputTokens} onChange={(event) => setInputTokens(Math.max(0, Number(event.target.value) || 0))} className="mt-2 w-full rounded-md border border-border-default bg-bg-elevated p-2 text-sm text-fg-primary" />
          </label>
          <label className="text-xs text-fg-secondary">
            Output tokens, including reasoning
            <input aria-label="Output tokens" type="number" min={0} max={384_000} step={1000} value={outputTokens} onChange={(event) => setOutputTokens(Math.max(0, Number(event.target.value) || 0))} className="mt-2 w-full rounded-md border border-border-default bg-bg-elevated p-2 text-sm text-fg-primary" />
          </label>
          <label className="text-xs text-fg-secondary">
            Your token budget (USD)
            <input aria-label="Token budget in USD" type="number" min={0} step={5} value={budget} onChange={(event) => setBudget(Math.max(0, Number(event.target.value) || 0))} className="mt-2 w-full rounded-md border border-border-default bg-bg-elevated p-2 text-sm text-fg-primary" />
          </label>
        </div>
        <div>
          <p className="text-xs text-fg-secondary">{totalTokens.toLocaleString()} requested tokens / {model.contextWindowTokens.toLocaleString()} provider context</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-bg-elevated">
            <div className={`h-full ${exceedsContext ? "bg-red-500" : model.contextBarColor}`} style={{ width: `${Math.min(totalTokens / model.contextWindowTokens * 100, 100)}%` }} />
          </div>
          <p className="mt-2 text-xs text-fg-secondary">Budget includes input and requested output. Tool history also uses context. Provider output limits and your editor&apos;s limits may be lower.</p>
          {exceedsContext && <p role="alert" className="mt-2 text-xs text-red-600">This request exceeds the listed context window. Reduce it before sending; the cost below is hypothetical.</p>}
        </div>
        <label className="flex items-start gap-2 text-xs text-fg-secondary">
          <input type="checkbox" checked={legacyMax} onChange={(event) => setLegacyMax(event.target.checked)} className="mt-0.5" />
          Apply Cursor&apos;s 20% Max Mode surcharge for a supported model on a legacy request-based plan.
        </label>
        <div aria-live="polite" className="rounded-lg border border-border-default bg-bg-elevated p-4">
          <p className="font-mono text-2xl font-bold text-violet-600">${cost.toFixed(3)} <span className="text-xs font-normal text-fg-secondary">per request</span></p>
          <p className="mt-2 text-xs text-fg-secondary">{sessions} such requests fit in your ${budget} token budget at these assumptions.</p>
          {hasSurcharge && <p className="mt-2 text-xs text-fg-secondary">Long-context pricing applies to the full request above {long.thresholdTokens.toLocaleString()} input tokens: {long.inputMultiplier}× input and {long.outputMultiplier}× output.</p>}
          {pricing.label && <p className="mt-2 text-xs text-fg-secondary">{pricing.label}</p>}
          {model.pricingNote && <p className="mt-2 text-xs text-fg-secondary">{model.pricingNote}</p>}
        </div>
        <p className="text-xs text-fg-muted">{PRICING_META.notes[0]} Checked {PRICING_META.verifiedDate}. A token budget is your own assumption, not a subscription allowance. Max Mode applies only to legacy request-based Cursor plans; model availability and context vary by plan. <a href="https://cursor.com/docs/models-and-pricing" className="underline">Check Cursor pricing</a>.</p>
      </div>
    </div>
  );
}
