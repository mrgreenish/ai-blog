import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { ClipboardCheck } from "lucide-react";
import { BENCHMARK_CHECKS, getDevBenchmarkColumns } from "@/lib/modelSpecs";

const COLUMNS = getDevBenchmarkColumns();

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
