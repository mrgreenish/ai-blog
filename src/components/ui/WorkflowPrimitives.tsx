"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Shared primitives used by interactive tools.
// All components accept accentColor to differentiate widgets visually.

type AccentColor = "teal" | "emerald";

// Full Tailwind class strings — must be complete so Tailwind includes them in
// the output. Never construct these dynamically from partial strings.
const accent = {
  teal: {
    borderLine: "border-teal-400/20",
    borderDot: "border-teal-400/30",
    textDot: "text-teal-400",
    labelText: "text-teal-400/70",
    dotBg: "bg-teal-400/40",
    btnCopied: "border-teal-400/50 bg-teal-400/10 text-teal-300",
    btnHover: "hover:border-teal-400/50 hover:text-teal-300",
  },
  emerald: {
    borderLine: "border-emerald-400/20",
    borderDot: "border-emerald-400/30",
    textDot: "text-emerald-400",
    labelText: "text-emerald-400/70",
    dotBg: "bg-emerald-400/40",
    btnCopied: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
    btnHover: "hover:border-emerald-400/50 hover:text-emerald-300",
  },
} satisfies Record<AccentColor, Record<string, string>>;

// ---------------------------------------------------------------------------

export function FieldLabel({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: AccentColor;
}) {
  return (
    <p
      className={`mb-2 font-mono text-[11px] font-medium uppercase tracking-wider ${accent[accentColor].labelText}`}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------

export function StepFlow({
  steps,
  accentColor,
}: {
  steps: { label: string; description: string }[];
  accentColor: AccentColor;
}) {
  const c = accent[accentColor];
  return (
    <div className={`relative ml-2.5 border-l pl-5 ${c.borderLine}`}>
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          className={`relative ${i < steps.length - 1 ? "pb-3" : ""}`}
        >
          <div
            className={`absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-zinc-900 font-mono text-[10px] font-medium ${c.borderDot} ${c.textDot}`}
          >
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{step.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function GuardrailList({
  items,
  accentColor,
}: {
  items: string[];
  accentColor: AccentColor;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((g) => (
        <li
          key={g}
          className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400"
        >
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent[accentColor].dotBg}`}
          />
          {g}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Mode toggle — used by ModelMixer, WorkflowRecipe, ModelCompare
// ---------------------------------------------------------------------------

// Full Tailwind class strings for toggle accent colors.
const toggleAccent = {
  violet: { active: "bg-violet-400/15 text-violet-300 shadow-sm" },
  emerald: { active: "bg-emerald-400/15 text-emerald-300 shadow-sm" },
  cyan: { active: "bg-cyan-400/15 text-cyan-300 shadow-sm" },
} as const;

export type ToggleAccent = keyof typeof toggleAccent;

export function ModeToggle<T extends string>({
  mode,
  onChange,
  options,
  accent: color = "violet",
}: {
  mode: T;
  onChange: (m: T) => void;
  options: readonly { readonly id: T; readonly label: string; readonly icon: LucideIcon }[];
  accent?: ToggleAccent;
}) {
  return (
    <div className="border-b border-zinc-800 px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="inline-flex rounded-lg border border-zinc-700/50 bg-zinc-800/40 p-0.5">
        {options.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] transition-all sm:text-xs ${
              mode === id
                ? toggleAccent[color].active
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function CopyButton({
  getText,
  label,
  accentColor,
}: {
  getText: () => string;
  label: string;
  accentColor: AccentColor;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(getText());
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  }

  const c = accent[accentColor];
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
        copied
          ? c.btnCopied
          : `border-zinc-700 bg-zinc-800 text-zinc-300 ${c.btnHover}`
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
