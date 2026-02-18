import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Compass } from "lucide-react";

const MOCK_QUESTIONS = [
  { label: "Task type", options: ["Coding", "Analysis", "Writing", "Vision"] },
  { label: "Stakes", options: ["Low (prototype)", "High (production)"] },
  { label: "Speed vs accuracy", options: ["Need it fast", "Need it right"] },
];

function Preview() {
  return (
    <div className="space-y-3">
      {MOCK_QUESTIONS.map((q) => (
        <div key={q.label}>
          <p className="mb-1.5 text-xs font-medium text-zinc-400">{q.label}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt, i) => (
              <span
                key={opt}
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  i === 0
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                    : "border-zinc-700 text-zinc-500"
                }`}
              >
                {opt}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
        <p className="text-xs font-semibold text-blue-400">
          Recommendation: Claude Sonnet 4
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Best balance for production coding tasks. When I was wrong: o3 for
          architecture decisions with deep tradeoffs.
        </p>
      </div>
    </div>
  );
}

export function ModelPicker() {
  return (
    <InteractivePlaceholder
      icon={Compass}
      title="Model Picker"
      tagline="A decision wizard based on my real usage patterns"
      description="Answer a few practical questions — task type, stakes, speed vs accuracy, context size — and get a recommendation with 'when I was wrong' notes. Not a benchmark, but opinionated guidance from shipping real things."
      preview={<Preview />}
      accentColor="text-blue-400"
      borderColor="border-blue-400/30"
    />
  );
}
