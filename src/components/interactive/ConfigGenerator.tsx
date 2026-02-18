import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { Settings2 } from "lucide-react";

const MOCK_OUTPUT = `# CLAUDE.md
You are working in a Next.js 15 App Router project.

## Conventions
- Use server components by default
- Client components only when needed (interactivity, hooks)
- Co-locate tests with components
- Use Tailwind for all styling

## Guardrails
- Never delete files without confirmation
- Stay in scope — don't refactor adjacent code
- Ask before changing shared utilities`;

function Preview() {
  return (
    <div>
      <div className="mb-3 space-y-2">
        {[
          { label: "Framework", value: "Next.js 15 (App Router)" },
          { label: "AI tools", value: "Cursor + Claude Code" },
          { label: "Output", value: "CLAUDE.md" },
        ].map((q) => (
          <div key={q.label} className="flex items-center gap-3 text-xs">
            <span className="w-20 shrink-0 text-zinc-500">{q.label}</span>
            <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-zinc-300">
              {q.value}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap">
          {MOCK_OUTPUT}
        </pre>
      </div>
    </div>
  );
}

export function ConfigGenerator() {
  return (
    <InteractivePlaceholder
      icon={Settings2}
      title="Config Generator"
      tagline="Generate .cursorrules, CLAUDE.md, or AGENTS.md for your project"
      description="Answer a few questions about your project (framework, team size, AI tools, coding conventions) and get a generated config file ready to copy into your repo. Encodes your conventions so agents follow them automatically — no more repeating yourself in every prompt."
      preview={<Preview />}
      accentColor="text-orange-400"
      borderColor="border-orange-400/30"
    />
  );
}
