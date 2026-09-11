"use client";

import { useId, useState } from "react";
import { Settings2 } from "lucide-react";
import { CopyButton } from "@/components/ui/WorkflowPrimitives";

const STACKS = {
  next: {
    label: "Next.js (App Router)",
    test: "pnpm test:ci",
    build: "pnpm build",
    rules:
      "Use Server Components by default. Add client boundaries only for interactive UI.\nFollow the installed Next.js version and existing routing conventions.",
  },
  react: {
    label: "React",
    test: "npm test",
    build: "npm run build",
    rules:
      "Follow existing component and state patterns.\nUse semantic HTML and accessible labels for interactive controls.",
  },
  node: {
    label: "Node.js / TypeScript",
    test: "npm test",
    build: "npm run build",
    rules:
      "Validate input at application boundaries.\nFollow existing error handling and TypeScript conventions.",
  },
  python: {
    label: "Python",
    test: "pytest",
    build: "",
    rules:
      "Follow the project's Python version, dependency manager, and formatting conventions.\nKeep types and public interfaces consistent with the surrounding code.",
  },
} as const;
const FORMATS = {
  agents: "AGENTS.md",
  claude: "CLAUDE.md",
  cursor: ".cursor/rules/project.mdc",
} as const;

export function ConfigGenerator() {
  const id = useId();
  const [format, setFormat] = useState<keyof typeof FORMATS>("agents");
  const [stack, setStack] = useState<keyof typeof STACKS>("next");
  const [test, setTest] = useState<string>(STACKS.next.test);
  const [build, setBuild] = useState<string>(STACKS.next.build);
  const [conventions, setConventions] = useState("");
  const output = [
    ...(format === "cursor"
      ? [
          "---",
          "description: Project conventions and verification",
          "alwaysApply: true",
          "---",
          "",
        ]
      : []),
    "# Project instructions",
    "",
    `Stack: ${STACKS[stack].label}`,
    "",
    "## Working conventions",
    ...STACKS[stack].rules.split("\n").map((rule) => `- ${rule}`),
    ...conventions
      .split("\n")
      .map((line) => line.trim().replace(/^[-*]\s+/, ""))
      .filter(Boolean)
      .map((rule) => `- ${rule}`),
    "",
    "## Scope and safety",
    "- Read the relevant code and project instructions before making changes.",
    "- Keep changes focused on the requested task and preserve unrelated work.",
    "- Ask before destructive operations or changes to public interfaces.",
    "- Keep secrets out of code, logs, and generated files.",
    "",
    "## Verification",
    ...(test.trim()
      ? [`- Test command: ${test.trim()}`]
      : ["- Identify and run the relevant test command for the change."]),
    ...(build.trim() ? [`- Build command: ${build.trim()}`] : []),
    "- Verify changed behavior and report what was checked, including any failures or skipped checks.",
    "- Summarize the changes and any remaining limitations.",
  ].join("\n");
  const control =
    "mt-2 w-full rounded-md border border-border-strong bg-bg-page p-3 text-sm text-fg-primary";

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border-strong bg-bg-surface">
      <div className="flex items-center gap-3 border-b border-border-default px-5 py-4">
        <Settings2 aria-hidden="true" className="h-5 w-5 text-orange-700" />
        <div>
          <h3 className="font-mono text-sm font-semibold">Config Generator</h3>
          <p className="mt-1 text-xs text-fg-secondary">
            Project instructions from your choices. Review and copy when ready.
          </p>
        </div>
      </div>
      <div className="config-layout">
        <div className="space-y-5">
          <div>
            <label htmlFor={`${id}-format`} className="text-sm font-medium">
              Instruction file
            </label>
            <select
              id={`${id}-format`}
              name="format"
              className={control}
              value={format}
              onChange={(event) =>
                setFormat(event.target.value as keyof typeof FORMATS)
              }
            >
              {Object.entries(FORMATS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-stack`} className="text-sm font-medium">
              Project stack
            </label>
            <select
              id={`${id}-stack`}
              name="stack"
              className={control}
              value={stack}
              onChange={(event) => {
                const next = event.target.value as keyof typeof STACKS;
                setStack(next);
                setTest(STACKS[next].test);
                setBuild(STACKS[next].build);
              }}
            >
              {Object.entries(STACKS).map(([value, preset]) => (
                <option key={value} value={value}>
                  {preset.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-fg-muted">
              Changing stack resets the suggested test and build commands. Edit
              them to match your project.
            </p>
          </div>
          <div>
            <label htmlFor={`${id}-test`} className="text-sm font-medium">
              Test command
            </label>
            <input
              id={`${id}-test`}
              name="test-command"
              className={control}
              value={test}
              onChange={(event) => setTest(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div>
            <label htmlFor={`${id}-build`} className="text-sm font-medium">
              Build command <span className="text-fg-muted">(optional)</span>
            </label>
            <input
              id={`${id}-build`}
              name="build-command"
              className={control}
              value={build}
              onChange={(event) => setBuild(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div>
            <label
              htmlFor={`${id}-conventions`}
              className="text-sm font-medium"
            >
              Your conventions{" "}
              <span className="text-fg-muted">(one per line)</span>
            </label>
            <textarea
              id={`${id}-conventions`}
              name="conventions"
              className={control}
              rows={4}
              value={conventions}
              onChange={(event) => setConventions(event.target.value)}
              placeholder="Use the existing design tokens…"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label
              htmlFor={`${id}-output`}
              className="font-mono text-sm font-semibold break-all"
            >
              {FORMATS[format]}
            </label>
            <CopyButton
              getText={() => output}
              label="Copy instructions"
              accentColor="emerald"
            />
          </div>
          <textarea
            id={`${id}-output`}
            aria-label="Generated instructions"
            className="config-output"
            value={output}
            readOnly
            spellCheck={false}
          />
          <p className="mt-3 text-xs leading-relaxed text-fg-secondary">
            Save as <code>{FORMATS[format]}</code> in your project root. Merge
            with existing instructions if the file already exists. These
            instructions guide an agent; they do not enforce permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
