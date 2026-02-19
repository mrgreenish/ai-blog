"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react";
import { getPickerModels } from "@/lib/modelSpecs";
import {
  QUESTIONS,
  getRecommendation,
  type Question,
  type Confidence,
  type Answers,
  type Recommendation,
} from "@/lib/modelPickerScoring";

interface Model {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  why: Record<string, string>;
  whenWrong: string;
}

const MODELS: Model[] = getPickerModels();

function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
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

const CONFIDENCE_STYLES: Record<
  Confidence,
  { label: string; classes: string }
> = {
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

function ResultScreen({
  recommendation,
  onRestart,
}: {
  recommendation: Recommendation<Model>;
  onRestart: () => void;
}) {
  const { model, runnerUp, reason, confidence } = recommendation;
  const badge = CONFIDENCE_STYLES[confidence];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      {/* Winner card */}
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
        <div
          className={`flex h-28 items-center justify-center bg-linear-to-br ${model.gradientFrom} ${model.gradientTo}`}
        >
          <span className="text-6xl">{model.emoji}</span>
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-white">{model.name}</h3>
            <span className={`text-xs font-medium ${model.accentColor}`}>
              {model.tagline}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.classes}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{reason}</p>

          <div className="mt-3 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3 py-2.5">
            <p className="mb-1 text-xs font-semibold text-zinc-500">
              When I was wrong
            </p>
            <p className="text-xs leading-relaxed text-zinc-400">
              {model.whenWrong}
            </p>
          </div>
        </div>
      </div>

      {/* Runner-up */}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <span className="text-2xl">{runnerUp.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500">Also consider</p>
          <p className="text-sm font-medium text-zinc-300">{runnerUp.name}</p>
          <p className={`text-xs ${runnerUp.accentColor}`}>{runnerUp.tagline}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
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

export function ModelPicker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isDone = step >= QUESTIONS.length;
  const recommendation = isDone ? getRecommendation(MODELS, answers) : null;

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
              Opinionated guidance from real usage
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
          {isDone && recommendation ? (
            <ResultScreen
              key="result"
              recommendation={recommendation}
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
