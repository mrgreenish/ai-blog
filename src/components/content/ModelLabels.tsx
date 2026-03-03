interface ModelLabelsProps {
  provider: string;
  tier: string;
  bestFor: string;
}

const TIER_COLORS: Record<string, string> = {
  fast: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  balanced: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  reasoning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  conservative: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  proactive: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  deep: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  focused: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  agentic: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",
};

export function ModelLabels({ provider, tier, bestFor }: ModelLabelsProps) {
  const tierColor = TIER_COLORS[tier.toLowerCase()] ?? "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";

  return (
    <div className="not-prose mt-3 mb-5 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/60 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
        {provider}
      </span>
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${tierColor}`}>
        {tier}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700/50 bg-zinc-800/60 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
        <span className="text-zinc-600">best for:</span>
        <span className="text-zinc-300">{bestFor}</span>
      </span>
    </div>
  );
}
