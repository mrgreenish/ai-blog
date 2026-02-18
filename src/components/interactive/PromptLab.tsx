import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Beaker } from "lucide-react";

function Preview() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {["Rewrite this", "Extract JSON", "Critique", "Plan"].map((task, i) => (
          <span
            key={task}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              i === 0
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-zinc-700 text-zinc-500"
            }`}
          >
            {task}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { model: "Claude Sonnet", output: "Refactored with clear separation of concerns. Added error boundary. Removed redundant state." },
          { model: "GPT-4o", output: "Rewrote using functional patterns. Extracted custom hook. Added JSDoc comments throughout." },
        ].map((col) => (
          <div key={col.model} className="rounded-lg border border-zinc-800 p-3">
            <p className="mb-2 font-mono text-xs font-semibold text-zinc-400">
              {col.model}
            </p>
            <p className="text-xs leading-relaxed text-zinc-500">{col.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PromptLab() {
  return (
    <InteractivePlaceholder
      icon={Beaker}
      title="Prompt Lab"
      tagline="Side-by-side model comparisons on real developer tasks"
      description="Small sandbox experiments: pick a task card (Rewrite, Extract JSON, Critique, Plan), see how Model A vs Model B handles it. Starts with cached real outputs, evolves into live runs. Shows differences in behavior, not just benchmark scores."
      preview={<Preview />}
      accentColor="text-amber-400"
      borderColor="border-amber-400/30"
    />
  );
}
