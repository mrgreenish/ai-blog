import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { ClipboardCheck } from "lucide-react";

const CHECKS = [
  { check: "Correct Next.js server action?", sonnet: true, gpt4o: true, haiku: false },
  { check: "Followed constraints without detours?", sonnet: true, gpt4o: false, haiku: true },
  { check: "Made up docs or citations?", sonnet: false, gpt4o: false, haiku: false },
  { check: "Introduced hidden bugs in refactor?", sonnet: false, gpt4o: true, haiku: true },
];

function Pass({ val }: { val: boolean }) {
  return (
    <span className={`font-mono text-xs ${val ? "text-red-400" : "text-emerald-400"}`}>
      {val ? "✗ fail" : "✓ pass"}
    </span>
  );
}

function Preview() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="pb-2 text-left font-mono text-zinc-500 pr-4">Check</th>
              <th className="pb-2 text-center font-mono text-blue-400 px-3">Sonnet</th>
              <th className="pb-2 text-center font-mono text-emerald-400 px-3">GPT-4o</th>
              <th className="pb-2 text-center font-mono text-zinc-400 px-3">Haiku</th>
            </tr>
          </thead>
          <tbody className="space-y-1">
            {CHECKS.map((c) => (
              <tr key={c.check} className="border-b border-zinc-800/50">
                <td className="py-2 pr-4 text-zinc-400 leading-tight">{c.check}</td>
                <td className="py-2 text-center px-3"><Pass val={c.sonnet} /></td>
                <td className="py-2 text-center px-3"><Pass val={c.gpt4o} /></td>
                <td className="py-2 text-center px-3"><Pass val={c.haiku} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        Not leaderboard scores — checks that matter when shipping.
      </p>
    </div>
  );
}

export function DevBenchmark() {
  return (
    <InteractivePlaceholder
      icon={ClipboardCheck}
      title="Dev Benchmark"
      tagline="Developer-flavored checks, not abstract leaderboard scores"
      description="Did it write a correct Next.js server action? Did it follow constraints without 'creative' detours? Did it make up docs? Did it introduce hidden bugs in a refactor? Real checks from real tasks, scored per model."
      preview={<Preview />}
      accentColor="text-cyan-400"
      borderColor="border-cyan-400/30"
    />
  );
}
