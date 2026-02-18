"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react";
import { getPickerModels } from "@/lib/modelSpecs";

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

interface Question {
  id: string;
  text: string;
  options: { id: string; label: string; description?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "task",
    text: "What are you working on?",
    options: [
      { id: "coding", label: "Coding", description: "Writing or editing code" },
      {
        id: "analysis",
        label: "Analysis",
        description: "Researching or reviewing",
      },
      {
        id: "writing",
        label: "Writing / Docs",
        description: "Documentation or prose",
      },
      {
        id: "reasoning",
        label: "Reasoning",
        description: "Complex logic, debugging, tradeoffs",
      },
      {
        id: "vision",
        label: "Vision",
        description: "Images, screenshots, diagrams",
      },
    ],
  },
  {
    id: "scope",
    text: "What's the scope?",
    options: [
      {
        id: "targeted",
        label: "Quick targeted edit",
        description: "One file, one function",
      },
      {
        id: "multifile",
        label: "Multi-file feature",
        description: "Coordinated changes across files",
      },
      {
        id: "architecture",
        label: "Architecture decision",
        description: "Design, tradeoffs, structure",
      },
      {
        id: "autonomous",
        label: "Full autonomous task",
        description: "Run it, verify it, ship it",
      },
    ],
  },
  {
    id: "stakes",
    text: "How high are the stakes?",
    options: [
      { id: "prototype", label: "Prototype", description: "Exploring an idea" },
      {
        id: "internal",
        label: "Internal tool",
        description: "Low-risk, team-facing",
      },
      {
        id: "production",
        label: "Production code",
        description: "User-facing, needs to be right",
      },
      {
        id: "critical",
        label: "Critical system",
        description: "High consequence if wrong",
      },
    ],
  },
  {
    id: "priority",
    text: "What matters more right now?",
    options: [
      {
        id: "speed",
        label: "Speed",
        description: "Ship it fast, iterate later",
      },
      {
        id: "balance",
        label: "Balance",
        description: "Good enough, reasonably fast",
      },
      {
        id: "accuracy",
        label: "Accuracy",
        description: "Get it right, take the time",
      },
    ],
  },
  {
    id: "autonomy",
    text: "How much should the model drive?",
    options: [
      {
        id: "targeted",
        label: "Edit what I point at",
        description: "Precise, no wandering",
      },
      {
        id: "gaps",
        label: "Fill in reasonable gaps",
        description: "Some initiative is fine",
      },
      {
        id: "drive",
        label: "Drive the whole task",
        description: "Run it end-to-end",
      },
    ],
  },
];

type Answers = Record<string, string>;
type Confidence = "strong" | "good" | "close";

interface Recommendation {
  model: Model;
  runnerUp: Model;
  reason: string;
  confidence: Confidence;
}

function score(modelId: string, answers: Answers): number {
  let points = 0;

  const task = answers.task;
  const scope = answers.scope;
  const stakes = answers.stakes;
  const priority = answers.priority;
  const autonomy = answers.autonomy;

  if (modelId === "gemini-flash") {
    if (task === "coding") points += 2;
    if (task === "reasoning") points += 1;
    if (task === "vision") points += 3;
    if (scope === "targeted") points += 3;
    if (stakes === "production") points += 3;
    if (stakes === "prototype") points -= 1;
    if (priority === "accuracy") points += 3;
    if (priority === "speed") points -= 1;
    if (autonomy === "targeted") points += 3;
    if (autonomy === "drive") points -= 3;
  }

  if (modelId === "sonnet-4.6") {
    if (task === "coding") points += 2;
    if (task === "reasoning") points += 2;
    if (task === "writing") points += 3;
    if (task === "analysis") points += 3;
    if (scope === "multifile") points += 3;
    if (scope === "architecture") points += 3;
    if (stakes === "production") points += 2;
    if (stakes === "internal") points += 2;
    if (priority === "balance") points += 2;
    if (priority === "accuracy") points += 2;
    if (autonomy === "gaps") points += 3;
    if (autonomy === "drive") points += 1;
  }

  if (modelId === "opus-4.6") {
    if (task === "coding") points += 3;
    if (task === "reasoning") points += 4;
    if (task === "analysis") points += 3;
    if (task === "writing") points += 2;
    if (scope === "architecture") points += 4;
    if (scope === "multifile") points += 2;
    if (scope === "autonomous") points += 1;
    if (stakes === "critical") points += 5;
    if (stakes === "production") points += 2;
    if (stakes === "prototype") points -= 2;
    if (priority === "accuracy") points += 4;
    if (priority === "speed") points -= 3;
    if (autonomy === "gaps") points += 2;
    if (autonomy === "drive") points += 2;
  }

  if (modelId === "composer-1") {
    if (task === "coding") points += 3;
    if (scope === "targeted") points += 5;
    if (scope === "multifile") points -= 2;
    if (scope === "autonomous") points -= 4;
    if (stakes === "production") points += 2;
    if (priority === "speed") points += 3;
    if (autonomy === "targeted") points += 5;
    if (autonomy === "drive") points -= 4;
  }

  if (modelId === "composer-1-5") {
    if (task === "coding") points += 3;
    if (scope === "autonomous") points += 5;
    if (scope === "multifile") points += 3;
    if (scope === "targeted") points -= 2;
    if (stakes === "prototype") points += 2;
    if (stakes === "internal") points += 2;
    if (stakes === "critical") points -= 3;
    if (priority === "speed") points += 2;
    if (priority === "accuracy") points -= 1;
    if (autonomy === "drive") points += 5;
    if (autonomy === "gaps") points += 2;
    if (autonomy === "targeted") points -= 3;
  }

  // ── Interaction effects ──────────────────────────────────────────────────
  // Purely additive scoring has blind spots when dimensions interact.
  // These adjustments handle combinations that the per-model blocks can't.

  // "autonomous scope" + "drive autonomy" overlap significantly — dampen
  // the double-counting for models that benefit from both.
  if (scope === "autonomous" && autonomy === "drive") {
    if (modelId === "composer-1-5") points -= 2;
  }

  // Critical stakes + autonomous scope = "I need the best model to handle
  // a hard task end-to-end." Boost frontier, penalize mid-tier agentic.
  if (stakes === "critical" && scope === "autonomous") {
    if (modelId === "opus-4.6") points += 2;
  }

  // Critical + accuracy is the strongest quality signal. Double down on
  // the model that actually reasons through logic.
  if (stakes === "critical" && priority === "accuracy") {
    if (modelId === "opus-4.6") points += 2;
    if (modelId === "composer-1-5") points -= 1;
  }

  return points;
}

function getRecommendation(answers: Answers): Recommendation {
  const scores = MODELS.map((m) => ({ model: m, points: score(m.id, answers) }));
  scores.sort((a, b) => b.points - a.points);

  const winner = scores[0].model;
  const runnerUp = scores[1].model;
  const margin = scores[0].points - scores[1].points;
  const confidence: Confidence =
    margin >= 6 ? "strong" : margin >= 3 ? "good" : "close";

  const reasonKey = [answers.scope, answers.task, answers.stakes, answers.priority, answers.autonomy].find(
    (key) => key && winner.why[key]
  );
  const reason = reasonKey
    ? winner.why[reasonKey]
    : `${winner.name} is the right fit for this combination of task type, stakes, and scope.`;

  return { model: winner, runnerUp, reason, confidence };
}

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
  recommendation: Recommendation;
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
  const recommendation = isDone ? getRecommendation(answers) : null;

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
