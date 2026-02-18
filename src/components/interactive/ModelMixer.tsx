import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Shuffle } from "lucide-react";

const PIPELINE_STEPS = [
  { step: "Scaffold", model: "Haiku", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  { step: "Business logic", model: "Sonnet", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  { step: "Architecture review", model: "Opus", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/30" },
];

function Preview() {
  return (
    <div>
      <p className="mb-3 text-xs text-zinc-500">
        Example: Full-stack feature implementation
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {PIPELINE_STEPS.map((s, i) => (
          <div key={s.step} className="flex items-center gap-2">
            <div className={`rounded-lg border px-3 py-2 ${s.bg}`}>
              <p className="text-xs text-zinc-400">{s.step}</p>
              <p className={`mt-0.5 font-mono text-xs font-semibold ${s.color}`}>
                {s.model}
              </p>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <span className="text-zinc-700">→</span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-600">
        Why: Haiku is 10× cheaper for boilerplate. Sonnet handles nuanced logic.
        Opus catches architectural mistakes before they ship.
      </p>
    </div>
  );
}

export function ModelMixer() {
  return (
    <InteractivePlaceholder
      icon={Shuffle}
      title="Model Mixer"
      tagline="Combine models across a single task for cost and quality"
      description="Different steps in a task have different requirements. This tool shows how to chain models — fast/cheap for scaffolding, capable for logic, best for review — and why mixing beats picking one model for everything."
      preview={<Preview />}
      accentColor="text-violet-400"
      borderColor="border-violet-400/30"
    />
  );
}
