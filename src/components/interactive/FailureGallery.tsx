"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, ChevronDown, ChevronUp, Skull } from "lucide-react";
import {
  FAILURES,
  CATEGORY_META,
  CATEGORY_ORDER,
  SEVERITY_META,
  DIFFICULTY_META,
  getFailuresByCategory,
  type FailureCase,
  type FailureCategory,
  type RiskFactor,
} from "@/lib/failureGalleryData";
import { getFailureGalleryModels } from "@/lib/modelSpecs";

const GALLERY_MODELS = getFailureGalleryModels();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FailureGalleryModel = ReturnType<typeof getFailureGalleryModels>[number];

function getSusceptibleModels(
  riskFactors: RiskFactor[],
  models: FailureGalleryModel[]
): FailureGalleryModel[] {
  return models.filter((m) =>
    riskFactors.some((rf) => {
      const val = m[rf.trait as keyof FailureGalleryModel] as string;
      return rf.risky.includes(val);
    })
  );
}

function highlightBug(output: string, highlight: string): React.ReactNode {
  const idx = output.indexOf(highlight);
  if (idx === -1) return <span className="text-zinc-300">{output}</span>;

  return (
    <>
      <span className="text-zinc-300">{output.slice(0, idx)}</span>
      <span className="relative">
        <span className="relative z-10 rounded bg-red-500/20 px-0.5 text-red-300 ring-1 ring-red-500/40">
          {highlight}
        </span>
      </span>
      <span className="text-zinc-300">{output.slice(idx + highlight.length)}</span>
    </>
  );
}

// ---------------------------------------------------------------------------
// Susceptibility pills
// ---------------------------------------------------------------------------

function SusceptibilityRow({
  riskFactors,
  revealed,
}: {
  riskFactors: RiskFactor[];
  revealed: boolean;
}) {
  const susceptible = getSusceptibleModels(riskFactors, GALLERY_MODELS);

  if (susceptible.length === 0) return null;

  return (
    <AnimatePresence>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.15 }}
          className="overflow-hidden"
        >
          <div className="border-t border-zinc-800 px-4 pb-3 pt-3">
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              More likely with
            </p>
            <div className="flex flex-wrap gap-1.5">
              {susceptible.map((m) => {
                const matchedFactor = riskFactors.find((rf) => {
                  const val = m[rf.trait as keyof FailureGalleryModel] as string;
                  return rf.risky.includes(val);
                });
                return (
                  <div
                    key={m.id}
                    className="group relative"
                    title={matchedFactor?.explanation}
                  >
                    <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-xs transition-colors hover:border-zinc-600">
                      <span className="text-sm leading-none">{m.emoji}</span>
                      <span className={`font-mono text-[11px] ${m.accentColor}`}>
                        {m.name.replace("Claude ", "").replace(" 4.6", "").replace(" 4.5", "").replace("Cursor ", "")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {riskFactors.map((rf) => {
              const affected = susceptible.filter((m) => {
                const val = m[rf.trait as keyof FailureGalleryModel] as string;
                return rf.risky.includes(val);
              });
              if (affected.length === 0) return null;
              return (
                <p key={rf.trait} className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">
                  {rf.explanation}
                </p>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Failure card
// ---------------------------------------------------------------------------

function FailureCard({ failure }: { failure: FailureCase }) {
  const [revealed, setRevealed] = useState(false);
  const [fixExpanded, setFixExpanded] = useState(false);

  const severityMeta = SEVERITY_META[failure.severity];
  const difficultyMeta = DIFFICULTY_META[failure.spotDifficulty];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700">
      {/* Card header */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 shrink-0">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${severityMeta.textClass} ${severityMeta.bgClass} ${severityMeta.borderClass}`}
          >
            {severityMeta.label}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold leading-snug text-zinc-100">
            {failure.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{failure.scenario}</p>
        </div>
      </div>

      {/* Code block — spot the bug zone */}
      <div className="border-t border-zinc-800 px-4 pb-3 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            What the model produced
          </p>
          {!revealed && (
            <span className={`font-mono text-[10px] ${difficultyMeta.textClass}`}>
              {difficultyMeta.label}
            </span>
          )}
        </div>
        <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed">
            {revealed
              ? highlightBug(failure.badOutput, failure.bugHighlight)
              : <span className="text-zinc-300">{failure.badOutput}</span>
            }
          </pre>
          {/* Reveal overlay — shown before reveal */}
          {!revealed && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent pb-3 pt-8">
              <button
                onClick={() => setRevealed(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-medium text-red-400 transition-all hover:border-red-400/50 hover:bg-red-500/15 active:scale-95"
              >
                <Eye className="h-3.5 w-3.5" />
                Show what&apos;s wrong
              </button>
            </div>
          )}
        </div>

        {/* Explanation — revealed after click */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-start gap-2 rounded-lg border border-red-400/15 bg-red-400/5 px-3 py-2.5">
                <Skull className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <p className="text-xs leading-relaxed text-zinc-300">{failure.whyWrong}</p>
              </div>
              <button
                onClick={() => setRevealed(false)}
                className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 transition-colors hover:text-zinc-400"
              >
                <EyeOff className="h-3 w-3" />
                Hide
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fix section */}
      <div className="border-t border-zinc-800">
        <button
          onClick={() => setFixExpanded((e) => !e)}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/30"
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
            Prevention
          </span>
          {fixExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-600" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {fixExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2">
                <p className="text-xs leading-relaxed text-zinc-400">{failure.fix}</p>
                {failure.fixExample && (
                  <pre className="overflow-x-auto rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-emerald-300/80 whitespace-pre-wrap">
                    {failure.fixExample}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Susceptibility row */}
      <SusceptibilityRow riskFactors={failure.riskFactors} revealed={revealed} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats bar
// ---------------------------------------------------------------------------

function StatsBar() {
  const total = FAILURES.length;
  const critical = FAILURES.filter((f) => f.severity === "critical").length;
  const high = FAILURES.filter((f) => f.severity === "high").length;

  return (
    <div className="flex flex-wrap gap-3 border-b border-zinc-800 px-3 py-2.5 sm:px-5">
      <span className="font-mono text-[11px] text-zinc-600">
        {total} failures catalogued
      </span>
      <span className="font-mono text-[11px] text-red-400">
        {critical} critical
      </span>
      <span className="font-mono text-[11px] text-amber-400">
        {high} high
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export function FailureGallery() {
  const [activeCategory, setActiveCategory] = useState<FailureCategory>(CATEGORY_ORDER[0]);

  const failures = getFailuresByCategory(activeCategory);
  const meta = CATEGORY_META[activeCategory];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-red-400/30 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3 sm:px-5 sm:py-4">
        <div className="rounded-lg bg-zinc-800 p-2 text-red-400">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-red-400">Failure Gallery</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            My bruises, your benefit — real failures with exact fixes
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Category tabs */}
      <div className="border-b border-zinc-800 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                cat === activeCategory
                  ? "border-red-400/50 bg-red-400/10 text-red-300"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>
      </div>

      {/* Category description */}
      <div className="border-b border-zinc-800 bg-zinc-900/40 px-3 py-2.5 sm:px-5">
        <p className="text-xs text-zinc-500">{meta.description}</p>
      </div>

      {/* Failure cards */}
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            {failures.map((failure) => (
              <FailureCard key={failure.id} failure={failure} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-3 py-3 sm:px-5">
        <p className="text-[11px] text-zinc-600">
          Failures are curated from real usage. Susceptibility indicators are derived from model traits in{" "}
          <span className="font-mono text-zinc-500">modelSpecs.ts</span> — not hardcoded.
        </p>
      </div>
    </div>
  );
}
