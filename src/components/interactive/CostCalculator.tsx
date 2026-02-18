import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Calculator } from "lucide-react";

const MODELS = [
  { name: "Claude Haiku 3.5", perM_in: 0.80, perM_out: 4.00, color: "text-emerald-400" },
  { name: "Claude Sonnet 4", perM_in: 3.00, perM_out: 15.00, color: "text-blue-400" },
  { name: "GPT-4o mini", perM_in: 0.15, perM_out: 0.60, color: "text-zinc-300" },
  { name: "GPT-4o", perM_in: 2.50, perM_out: 10.00, color: "text-zinc-300" },
  { name: "Gemini Flash 2.0", perM_in: 0.10, perM_out: 0.40, color: "text-yellow-400" },
];

const EXAMPLE_TOKENS = { in: 2000, out: 500, runsPerDay: 50 };

function Preview() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-zinc-500">
        <span>Input: <span className="text-zinc-300 font-mono">2,000 tokens</span></span>
        <span>Output: <span className="text-zinc-300 font-mono">500 tokens</span></span>
        <span>Runs/day: <span className="text-zinc-300 font-mono">50</span></span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="pb-2 text-left font-mono text-zinc-500 pr-4">Model</th>
              <th className="pb-2 text-right font-mono text-zinc-500 px-3">Per run</th>
              <th className="pb-2 text-right font-mono text-zinc-500 pl-3">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {MODELS.map((m) => {
              const perRun =
                (EXAMPLE_TOKENS.in / 1_000_000) * m.perM_in +
                (EXAMPLE_TOKENS.out / 1_000_000) * m.perM_out;
              const monthly = perRun * EXAMPLE_TOKENS.runsPerDay * 30;
              return (
                <tr key={m.name} className="border-b border-zinc-800/50">
                  <td className={`py-2 pr-4 font-mono ${m.color}`}>{m.name}</td>
                  <td className="py-2 text-right px-3 text-zinc-400">
                    ${perRun.toFixed(4)}
                  </td>
                  <td className="py-2 text-right pl-3 text-zinc-300 font-semibold">
                    ${monthly.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CostCalculator() {
  return (
    <InteractivePlaceholder
      icon={Calculator}
      title="Cost Calculator"
      tagline="Real cost comparison across providers — no more manual math"
      description="Input your task parameters (tokens in/out, runs per day, model tier) and see a live cost comparison table across Claude, GPT, and Gemini. Helps you make the cost vs quality tradeoff without spreadsheets."
      preview={<Preview />}
      accentColor="text-emerald-400"
      borderColor="border-emerald-400/30"
    />
  );
}
