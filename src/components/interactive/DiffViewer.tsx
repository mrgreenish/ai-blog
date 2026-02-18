import { InteractivePlaceholder } from "./InteractivePlaceholder";
import { GitCompare } from "lucide-react";

const BEFORE_LINES = [
  { text: "async function getUser(id) {", type: "context" },
  { text: "  const user = await db.users.find(id)", type: "removed" },
  { text: "  return user", type: "removed" },
  { text: "}", type: "context" },
];

const AFTER_LINES = [
  { text: "async function getUser(id: string) {", type: "context" },
  { text: "  const user = await db.users.findUnique({ where: { id } })", type: "added" },
  { text: "  if (!user) throw new NotFoundError(`User ${id} not found`)", type: "added" },
  { text: "  return user", type: "added" },
  { text: "}", type: "context" },
];

const LINE_COLORS: Record<string, string> = {
  added: "bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500",
  removed: "bg-red-500/10 text-red-300 border-l-2 border-red-500",
  context: "text-zinc-500",
};

const LINE_PREFIX: Record<string, string> = {
  added: "+ ",
  removed: "- ",
  context: "  ",
};

function CodePanel({ title, lines }: { title: string; lines: typeof BEFORE_LINES }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="mb-2 font-mono text-xs text-zinc-500">{title}</p>
      <div className="rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-xs">
        {lines.map((l, i) => (
          <div key={i} className={`px-2 py-0.5 ${LINE_COLORS[l.type]}`}>
            <span className="opacity-50">{LINE_PREFIX[l.type]}</span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Preview() {
  return (
    <div>
      <div className="flex gap-3 mb-3">
        <CodePanel title="Before (original)" lines={BEFORE_LINES} />
        <CodePanel title="After (AI output)" lines={AFTER_LINES} />
      </div>
      <div className="rounded border border-zinc-800 bg-zinc-900 p-2">
        <p className="font-mono text-xs text-amber-400 mb-1">Annotation</p>
        <p className="text-xs text-zinc-400">
          Added TypeScript types, switched to Prisma&apos;s <code>findUnique</code>, and added
          explicit not-found error. The original would return <code>undefined</code> silently.
        </p>
      </div>
    </div>
  );
}

export function DiffViewer() {
  return (
    <InteractivePlaceholder
      icon={GitCompare}
      title="Before / After Diff Viewer"
      tagline="Annotated diffs showing what the AI changed and why it matters"
      description="Side-by-side code diffs with inline annotations explaining what went right, what went wrong, and why. Used throughout the Failure Gallery and benchmark entries to make examples concrete rather than abstract."
      preview={<Preview />}
      accentColor="text-pink-400"
      borderColor="border-pink-400/30"
    />
  );
}
