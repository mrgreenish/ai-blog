"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, RotateCcw, ArrowLeft, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { getPickerModelsV2 } from "@/lib/modelSpecs";
import {
  QUESTIONS,
  getRanking,
  type Question,
  type Confidence,
  type Answers,
  type Ranking,
  type RankedModel,
  type DimensionScore,
} from "@/lib/modelPickerScoring";

type PickerModel = ReturnType<typeof getPickerModelsV2>[number];

const MODELS: PickerModel[] = getPickerModelsV2();

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current
              ? "w-4 bg-blue-400"
              : i === current
              ? "w-4 bg-blue-400/60"
              : "w-1.5 bg-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function QuestionStep({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (optionId: string) => void;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <p className="text-base font-semibold text-zinc-100">{question.text}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.id)}
            className="group flex flex-col items-start rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/5 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
              {opt.label}
            </span>
            {opt.description && (
              <span className="mt-0.5 text-xs text-zinc-500 group-hover:text-zinc-400">
                {opt.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const CONFIDENCE_STYLES: Record<Confidence, { label: string; classes: string }> = {
  strong: {
    label: "Strong match",
    classes: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  good: {
    label: "Good match",
    classes: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  close: {
    label: "Close call",
    classes: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
};

function ScoreBar({ dims }: { dims: DimensionScore[] }) {
  const positive = dims.filter((d) => d.points > 0);
  const negative = dims.filter((d) => d.points < 0);
  const maxAbs = Math.max(...dims.map((d) => Math.abs(d.points)), 1);

  if (positive.length === 0 && negative.length === 0) return null;

  return (
    <div className="space-y-1">
      {positive.slice(0, 3).map((d) => (
        <div key={d.dimension} className="flex items-center gap-2">
          <div className="w-16 shrink-0 text-right font-mono text-[10px] text-zinc-500 capitalize">
            {d.dimension}
          </div>
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400/40"
              initial={{ width: 0 }}
              animate={{ width: `${(d.points / maxAbs) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="w-4 shrink-0 font-mono text-[10px] text-emerald-400">
            +{d.points}
          </span>
        </div>
      ))}
      {negative.slice(0, 2).map((d) => (
        <div key={d.dimension} className="flex items-center gap-2">
          <div className="w-16 shrink-0 text-right font-mono text-[10px] text-zinc-500 capitalize">
            {d.dimension}
          </div>
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-red-400/30"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.abs(d.points) / maxAbs) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="w-4 shrink-0 font-mono text-[10px] text-red-400">
            {d.points}
          </span>
        </div>
      ))}
    </div>
  );
}

function RankedCard({
  ranked,
  isWinner,
  defaultExpanded,
}: {
  ranked: RankedModel<PickerModel>;
  isWinner: boolean;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { model, reason, topReasons, cautions, dimensions } = ranked;

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${
        isWinner
          ? "border-blue-500/40 bg-zinc-900"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${model.gradientFrom} ${model.gradientTo}`}
        >
          <span className="text-xl">{model.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-sm font-bold text-white">
              {model.name}
            </span>
            <span className={`text-xs font-medium ${model.accentColor}`}>
              {model.tagline}
            </span>
            {isWinner && (
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 font-mono text-[10px] font-medium text-blue-400">
                #1 pick
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{reason}</p>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 rounded-md p-1 text-zinc-600 transition-colors hover:text-zinc-400"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">
              {/* Score breakdown */}
              <div>
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  Score breakdown
                </p>
                <ScoreBar dims={dimensions} />
              </div>

              {/* Why it wins */}
              {topReasons.length > 0 && (
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    Why it fits
                  </p>
                  <ul className="space-y-1">
                    {topReasons.map((r) => (
                      <li key={r.dimension} className="flex items-start gap-1.5 text-xs text-zinc-400">
                        <span className="mt-0.5 shrink-0 text-emerald-400">▸</span>
                        {r.reason || r.dimension}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cautions */}
              {cautions.length > 0 && (
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    Watch out for
                  </p>
                  <ul className="space-y-1">
                    {cautions.map((c) => (
                      <li key={c.dimension} className="flex items-start gap-1.5 text-xs text-zinc-500">
                        <span className="mt-0.5 shrink-0 text-amber-400">▸</span>
                        {c.reason || c.dimension}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When wrong */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3 py-2.5">
                <p className="mb-1 text-[10px] font-semibold text-zinc-500">
                  When I was wrong
                </p>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {model.whenWrong}
                </p>
              </div>

              {/* Latency + initiative badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  latency: {model.latencyBand}
                </span>
                <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  initiative: {model.initiativeStyle}
                </span>
                <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  scope: {model.scopeDiscipline}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultScreen({
  ranking,
  onRestart,
}: {
  ranking: Ranking<PickerModel>;
  onRestart: () => void;
}) {
  const { top3, confidence, hasCaution, cautionMessage } = ranking;
  const badge = CONFIDENCE_STYLES[confidence];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Confidence badge */}
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium ${badge.classes}`}
        >
          {badge.label}
        </span>
        <span className="text-xs text-zinc-500">
          Top {top3.length} recommendations for your answers
        </span>
      </div>

      {/* Caution banner */}
      {hasCaution && cautionMessage && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-300">{cautionMessage}</p>
        </div>
      )}

      {/* Ranked cards */}
      <div className="space-y-2">
        {top3.map((ranked, i) => (
          <RankedCard
            key={ranked.model.id}
            ranked={ranked}
            isWinner={i === 0}
            defaultExpanded={i === 0}
          />
        ))}
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Start over
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export function ModelPicker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isDone = step >= QUESTIONS.length;
  const ranking = isDone ? getRanking(MODELS, answers) : null;

  const handleAnswer = (optionId: string) => {
    const question = QUESTIONS[step];
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevQuestion = QUESTIONS[step - 1];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[prevQuestion.id];
      return next;
    });
    setStep((s) => s - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2 text-blue-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-blue-400">
              Model Picker
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Top-3 recommendations with score breakdowns
            </p>
          </div>
        </div>
        {!isDone && (
          <ProgressDots total={QUESTIONS.length} current={step} />
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          {isDone && ranking ? (
            <ResultScreen
              key="result"
              ranking={ranking}
              onRestart={handleRestart}
            />
          ) : (
            <QuestionStep
              key={QUESTIONS[step].id}
              question={QUESTIONS[step]}
              onAnswer={handleAnswer}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Back / footer */}
      {!isDone && step > 0 && (
        <div className="border-t border-zinc-800 px-5 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}
