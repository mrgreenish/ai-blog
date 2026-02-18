import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { AlertTriangle } from "lucide-react";

const FAILURES = [
  {
    type: "Hallucinated API",
    severity: "high",
    example: "Called next/router.prefetch() with args that don't exist in v13+",
    fix: "Always pin docs version in system prompt",
  },
  {
    type: "Confident nonsense",
    severity: "medium",
    example: "Explained why a race condition 'can't happen' — it happened in prod",
    fix: "Ask model to steelman the failure case before concluding",
  },
  {
    type: "Subtle logic bug",
    severity: "high",
    example: "Off-by-one in pagination — last item always missing",
    fix: "Add boundary condition tests to the prompt",
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  high: "border-red-500/40 text-red-400 bg-red-500/10",
  medium: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  low: "border-zinc-600 text-zinc-400 bg-zinc-800",
};

function Preview() {
  return (
    <div className="space-y-2">
      {FAILURES.map((f) => (
        <div
          key={f.type}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-xs ${SEVERITY_COLORS[f.severity]}`}
            >
              {f.severity}
            </span>
            <span className="text-xs font-semibold text-zinc-300">{f.type}</span>
          </div>
          <p className="text-xs text-zinc-500 mb-1">{f.example}</p>
          <p className="text-xs text-emerald-500">Fix: {f.fix}</p>
        </div>
      ))}
    </div>
  );
}

export function FailureGallery() {
  return (
    <InteractivePlaceholder
      icon={AlertTriangle}
      title="Failure Gallery"
      tagline="My bruises, your benefit — real failure modes and exact fixes"
      description="Categorized examples of model and tool failures I actually hit: hallucinated APIs, confident nonsense, broken JSON, subtle logic bugs, messy refactors. Each entry includes the exact fix or pattern that prevented repeats."
      preview={<Preview />}
      accentColor="text-red-400"
      borderColor="border-red-400/30"
    />
  );
}
