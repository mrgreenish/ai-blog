"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react";

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

const MODELS: Model[] = [
  {
    id: "gemini",
    name: "Gemini",
    tagline: "The Careful One",
    emoji: "💎",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    accentColor: "text-cyan-400",
    why: {
      coding:
        "Gemini executes exactly what you ask — no surprises, no scope creep. For production code where predictability matters, that's a feature.",
      analysis:
        "Gemini stays close to the source material and doesn't over-interpret. Good for structured analysis where you want the facts, not editorializing.",
      writing:
        "Gemini follows your format and constraints reliably. It won't rewrite your voice or restructure what you didn't ask it to touch.",
      vision:
        "Gemini's literal-mindedness works well for vision tasks — it describes what's there, not what it thinks should be there.",
      production:
        "Gemini's risk-averse defaults shine in production contexts. It picks the safest approach and rarely introduces unexpected changes.",
      accuracy:
        "When you need the model to do exactly what you said and nothing more, Gemini's conservative interpretation is the right fit.",
      targeted:
        "Gemini is precise with targeted edits. It won't wander outside the scope you defined.",
    },
    whenWrong:
      "When you need the model to push back, suggest a better approach, or notice that you're solving the wrong problem. Gemini won't do that — you have to ask explicitly.",
  },
  {
    id: "gpt",
    name: "GPT / Codex",
    tagline: "The Balanced One",
    emoji: "⚡",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-500",
    accentColor: "text-emerald-400",
    why: {
      coding:
        "GPT produces the kind of code that feels like the accepted Stack Overflow answer — sensible, readable, and something your team will understand.",
      everyday:
        "GPT's pragmatic defaults make it ideal for the steady stream of everyday shipping tasks. It fills in reasonable gaps without overstepping.",
      internal:
        "For internal tools where 'good enough' is genuinely good enough, GPT's balanced approach keeps you moving without overthinking.",
      format:
        "GPT is the most consistent at following output format instructions. If you have structured output requirements, it delivers.",
      balance:
        "GPT sits in the sweet spot between speed and accuracy. It's rarely the best at either extreme, but it's reliably solid across the middle.",
    },
    whenWrong:
      "When you need genuine insight or creative problem-solving. GPT optimizes for giving you what you asked for, not what you actually need. It won't surprise you with a better approach.",
  },
  {
    id: "sonnet",
    name: "Claude Sonnet",
    tagline: "The Proactive One",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-400",
    why: {
      feature:
        "Sonnet is a genuine thought partner for feature design. It'll suggest a better API surface, spot issues in your data model, and notice things you didn't ask about.",
      multifile:
        "Sonnet handles multi-file work well — it understands how changes ripple across a codebase and coordinates them coherently.",
      architecture:
        "Sonnet's creativity and proactiveness make it strong for architecture exploration. It thinks beyond the immediate task.",
      writing:
        "Sonnet gives the clearest, most useful explanations. It connects your specific situation to the general principle in a way other models don't.",
      analysis:
        "Sonnet notices things. While analyzing, it'll surface connections and implications that weren't in your original question.",
    },
    whenWrong:
      "When scope matters. Sonnet's instinct to be helpful means it expands tasks — fixing naming conventions you didn't ask about, restructuring code to match its taste. Set explicit constraints or you'll review a 40-file diff when you asked for 3.",
  },
  {
    id: "opus",
    name: "Claude Opus",
    tagline: "The Deep Thinker",
    emoji: "🧠",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-amber-400",
    why: {
      coding:
        "Opus traces actual logic, not just patterns. It catches bugs that require understanding three levels of indirection, identifies race conditions by simulating concurrent execution, and spots type issues TypeScript itself misses. For production code where correctness is non-negotiable, this depth is the difference.",
      production:
        "Opus's deep accuracy shines in production contexts. It doesn't pattern-match — it reasons through the actual logic, catches subtle bugs, and flags the edge cases other models miss.",
      multifile:
        "Opus thinks in systems, not just in code. Across a multi-file change, it tracks how abstractions interact and will tell you when a design decision will cause problems two features from now.",
      critical:
        "Opus traces actual logic, not just patterns. For critical systems where a subtle bug has real consequences, this depth is worth the cost.",
      architecture:
        "Opus thinks in systems and abstractions. It'll identify that your current abstraction will cause problems two features from now — and explain why.",
      hard:
        "Where other models pattern-match, Opus reasons through the problem. It catches bugs that require understanding three levels of indirection.",
      accuracy:
        "Opus's thoroughness means it considers more options and explores more edge cases. When you need to be right, not just fast, it's the right choice.",
    },
    whenWrong:
      "For routine tasks. Opus is expensive and slow, and the depth it provides isn't proportional to the value for scaffolding, simple refactors, or boilerplate. You're paying for a level of reasoning the task doesn't need.",
  },
  {
    id: "composer-1",
    name: "Cursor Composer-1",
    tagline: "The Focused One",
    emoji: "🎯",
    gradientFrom: "from-sky-600",
    gradientTo: "to-blue-500",
    accentColor: "text-sky-400",
    why: {
      targeted:
        "Composer-1 is built for this. It reads your open files and diffs, executes the targeted change cleanly, and doesn't touch anything you didn't point at.",
      speed:
        "The round-trip from prompt to applied diff is fast. You see the change inline, accept or reject, and move on. Tight feedback loop.",
      ide:
        "You don't have to paste code into a chat window — Composer-1 already has your context from the open tabs and recent edits.",
    },
    whenWrong:
      "When the task requires multiple steps, tool use, or verification. Composer-1 is a precise instrument, not an autonomous agent. It won't run tests, read the output, and fix the failures.",
  },
  {
    id: "composer-1-5",
    name: "Cursor Composer-1.5",
    tagline: "The Agentic One",
    emoji: "🤖",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-pink-500",
    accentColor: "text-fuchsia-400",
    why: {
      autonomous:
        "Composer-1.5 can run terminal commands, read the output, make more edits, and loop until the task is done. It's the closest thing to a developer who can actually execute end-to-end.",
      multifile:
        "It navigates the project, finds the relevant files, and makes coordinated changes across many of them — without you having to specify each one.",
      selfcorrect:
        "It sees the TypeScript error, understands it in context, and fixes it — without you having to copy-paste the error back into a prompt.",
    },
    whenWrong:
      "When you need tight control. Composer-1.5 can go down wrong paths and make a lot of changes before you realize it's off track. Short task scopes and frequent checkpoints are essential.",
  },
];

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

interface Recommendation {
  model: Model;
  runnerUp: Model;
  reason: string;
}

function score(modelId: string, answers: Answers): number {
  let points = 0;

  const task = answers.task;
  const scope = answers.scope;
  const stakes = answers.stakes;
  const priority = answers.priority;
  const autonomy = answers.autonomy;

  if (modelId === "gemini") {
    if (task === "coding") points += 2;
    if (task === "vision") points += 3;
    if (scope === "targeted") points += 3;
    if (stakes === "production") points += 3;
    if (stakes === "prototype") points -= 1;
    if (priority === "accuracy") points += 3;
    if (priority === "speed") points -= 1;
    if (autonomy === "targeted") points += 3;
    if (autonomy === "drive") points -= 3;
  }

  if (modelId === "gpt") {
    if (task === "coding") points += 3;
    if (scope === "multifile") points += 2;
    if (stakes === "internal") points += 3;
    if (stakes === "prototype") points += 2;
    if (priority === "balance") points += 4;
    if (priority === "speed") points += 2;
    if (autonomy === "gaps") points += 3;
    if (autonomy === "targeted") points += 1;
  }

  if (modelId === "sonnet") {
    if (task === "coding") points += 2;
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

  if (modelId === "opus") {
    if (task === "coding") points += 3;
    if (task === "analysis") points += 3;
    if (task === "writing") points += 2;
    if (scope === "architecture") points += 4;
    if (scope === "multifile") points += 2;
    if (stakes === "critical") points += 5;
    if (stakes === "production") points += 2;
    if (stakes === "prototype") points -= 2;
    if (priority === "accuracy") points += 4;
    if (priority === "speed") points -= 3;
    if (autonomy === "gaps") points += 2;
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
    if (priority === "speed") points += 2;
    if (autonomy === "drive") points += 5;
    if (autonomy === "gaps") points += 2;
    if (autonomy === "targeted") points -= 3;
  }

  return points;
}

function getRecommendation(answers: Answers): Recommendation {
  const scores = MODELS.map((m) => ({ model: m, points: score(m.id, answers) }));
  scores.sort((a, b) => b.points - a.points);

  const winner = scores[0].model;
  const runnerUp = scores[1].model;

  const reasonKey = [answers.scope, answers.task, answers.stakes, answers.priority, answers.autonomy].find(
    (key) => key && winner.why[key]
  );
  const reason = reasonKey
    ? winner.why[reasonKey]
    : `${winner.name} is the right fit for this combination of task type, stakes, and scope.`;

  return { model: winner, runnerUp, reason };
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

function ResultScreen({
  recommendation,
  onRestart,
}: {
  recommendation: Recommendation;
  onRestart: () => void;
}) {
  const { model, runnerUp, reason } = recommendation;

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
