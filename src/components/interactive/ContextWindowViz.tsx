import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Maximize2 } from "lucide-react";

const MODELS = [
  { name: "Claude Sonnet 4", limit: 200_000, color: "bg-blue-500" },
  { name: "GPT-4o", limit: 128_000, color: "bg-zinc-400" },
  { name: "Gemini 2.0 Flash", limit: 1_000_000, color: "bg-yellow-500" },
  { name: "Cursor Composer-1", limit: 128_000, color: "bg-sky-500" },
  { name: "Cursor Composer-1.5", limit: 200_000, color: "bg-fuchsia-500" },
];

const SEGMENTS = [
  { label: "System prompt", tokens: 2_000, color: "bg-violet-500" },
  { label: "Codebase", tokens: 40_000, color: "bg-blue-500" },
  { label: "Docs", tokens: 15_000, color: "bg-emerald-500" },
  { label: "Conversation", tokens: 8_000, color: "bg-amber-500" },
];

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.tokens, 0);

function formatK(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}k`;
}

function Preview() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        {SEGMENTS.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-sm ${s.color}`} />
            <span className="text-zinc-400">
              {s.label}{" "}
              <span className="font-mono text-zinc-500">({formatK(s.tokens)})</span>
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {MODELS.map((m) => {
          const pct = Math.min((TOTAL / m.limit) * 100, 100);
          return (
            <div key={m.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300">{m.name}</span>
                <span className="text-zinc-500">
                  {formatK(TOTAL)} / {formatK(m.limit)} ({Math.round(pct)}%)
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded bg-zinc-800">
                <div className="flex h-full" style={{ width: `${pct}%` }}>
                  {SEGMENTS.map((s) => (
                    <div
                      key={s.label}
                      className={`h-full ${s.color}`}
                      style={{ width: `${(s.tokens / TOTAL) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        Answers &quot;will this fit?&quot; before you hit the limit mid-task.
      </p>
    </div>
  );
}

export function ContextWindowViz() {
  return (
    <InteractivePlaceholder
      icon={Maximize2}
      title="Context Window Visualizer"
      tagline="See how much of each model's context window your task fills"
      description="Describe your content (codebase size, doc pages, conversation history) and see a stacked bar per model showing how full the context window gets. Helps you decide between stuffing context vs RAG before you hit limits mid-task."
      preview={<Preview />}
      accentColor="text-sky-400"
      borderColor="border-sky-400/30"
    />
  );
}
