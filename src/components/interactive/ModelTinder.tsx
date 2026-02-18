"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { X, Heart, RotateCcw, Sparkles } from "lucide-react";

interface Model {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  traits: string[];
  bestFor: string;
  worstFor: string;
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
    traits: [
      "Literal-minded — does exactly what you say",
      "Risk-averse — picks the safest approach",
      "Consistent in long sessions",
    ],
    bestFor: "Production refactors where surprises are costly",
    worstFor: "Open-ended exploration or design decisions",
  },
  {
    id: "gpt",
    name: "GPT / Codex",
    tagline: "The Balanced One",
    emoji: "⚡",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-500",
    accentColor: "text-emerald-400",
    traits: [
      "Pragmatic defaults — Stack Overflow energy",
      "Measured initiative — fills gaps without overstepping",
      "Best at following output format instructions",
    ],
    bestFor: "Everyday shipping in team codebases",
    worstFor: "Tasks that need genuine creative insight",
  },
  {
    id: "sonnet",
    name: "Claude Sonnet",
    tagline: "The Proactive One",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-400",
    traits: [
      "Genuinely creative — suggests better APIs",
      "Notices things you didn't ask about",
      "Best at explaining complex concepts",
    ],
    bestFor: "Feature design and architecture exploration",
    worstFor: "Tight-scope tasks where drift is expensive",
  },
  {
    id: "opus",
    name: "Claude Opus",
    tagline: "The Deep Thinker",
    emoji: "🧠",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-amber-400",
    traits: [
      "Traces actual logic, not just patterns",
      "Thinks in systems and abstractions",
      "Proactive with high-signal observations",
    ],
    bestFor: "Hard problems, architecture reviews, subtle bugs",
    worstFor: "Routine tasks — cost and latency don't justify it",
  },
  {
    id: "composer-1",
    name: "Cursor Composer-1",
    tagline: "The Focused One",
    emoji: "🎯",
    gradientFrom: "from-sky-600",
    gradientTo: "to-blue-500",
    accentColor: "text-sky-400",
    traits: [
      "IDE-native — reads your open files and diffs",
      "Tight scope — edits exactly what you point at",
      "Fast iteration — optimized for targeted changes",
    ],
    bestFor: "Precise, single-file edits and quick targeted changes",
    worstFor: "Multi-step tasks that span many files or need tool use",
  },
  {
    id: "composer-1-5",
    name: "Cursor Composer-1.5",
    tagline: "The Agentic One",
    emoji: "🤖",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-pink-500",
    accentColor: "text-fuchsia-400",
    traits: [
      "Runs terminal commands and reads test output",
      "Edits across many files in a single task",
      "Self-corrects — reruns and fixes its own mistakes",
    ],
    bestFor: "Multi-step features, refactors, and autonomous bug fixes",
    worstFor: "Quick one-liner changes where the overhead isn't worth it",
  },
];

type SwipeDirection = "left" | "right";

interface SwipeResult {
  modelId: string;
  direction: SwipeDirection;
}

type Phase = "swiping" | "loading" | "results";

function ModelCard({
  model,
  onSwipe,
  isTop,
  stackIndex,
}: {
  model: Model;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  stackIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = () => {
    const xVal = x.get();
    if (xVal > 120) {
      onSwipe("right");
    } else if (xVal < -120) {
      onSwipe("left");
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 10;

  if (!isTop) {
    return (
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale}) translateY(${yOffset}px)`,
          zIndex: 10 - stackIndex,
        }}
      >
        <CardContent model={model} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 600 : -600,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
    >
      {/* LIKE overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 flex items-start justify-start rounded-2xl p-5"
        style={{ opacity: likeOpacity }}
      >
        <span className="-rotate-20 rounded-lg border-4 border-green-400 px-3 py-1 font-mono text-2xl font-black text-green-400">
          LIKE
        </span>
      </motion.div>

      {/* PASS overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 flex items-start justify-end rounded-2xl p-5"
        style={{ opacity: passOpacity }}
      >
        <span className="rotate-20 rounded-lg border-4 border-red-400 px-3 py-1 font-mono text-2xl font-black text-red-400">
          PASS
        </span>
      </motion.div>

      <CardContent model={model} />
    </motion.div>
  );
}

function CardContent({ model }: { model: Model }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
      {/* Image placeholder — fixed height, never scrolls */}
      <div
        className={`relative shrink-0 flex h-44 items-center justify-center bg-linear-to-br ${model.gradientFrom} ${model.gradientTo} sm:h-52`}
      >
        <span className="select-none text-7xl sm:text-8xl">{model.emoji}</span>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Card body — scrollable when content overflows */}
      <div className="overflow-y-auto overscroll-contain p-5">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-xl font-bold text-white">{model.name}</h3>
          <span className={`text-sm font-medium ${model.accentColor}`}>
            {model.tagline}
          </span>
        </div>

        <ul className="mb-4 space-y-1.5">
          {model.traits.map((trait) => (
            <li key={trait} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className={`mt-0.5 shrink-0 ${model.accentColor}`}>▸</span>
              {trait}
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2">
          <p className="text-xs font-semibold text-zinc-400">Best for</p>
          <p className="mt-0.5 text-xs text-zinc-300">{model.bestFor}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-10 w-10 text-violet-400" />
      </motion.div>
      <p className="font-mono text-sm text-zinc-400">Finding your matches...</p>
    </div>
  );
}

function MatchCard({ model }: { model: Model }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900"
    >
      <div
        className={`flex h-24 items-center justify-center bg-linear-to-br ${model.gradientFrom} ${model.gradientTo}`}
      >
        <span className="text-5xl">{model.emoji}</span>
      </div>
      <div className="p-3 text-center">
        <p className="font-bold text-white">{model.name}</p>
        <p className={`text-xs ${model.accentColor}`}>{model.tagline}</p>
      </div>
    </motion.div>
  );
}

function ResultsScreen({
  results,
  onRestart,
}: {
  results: SwipeResult[];
  onRestart: () => void;
}) {
  const liked = results.filter((r) => r.direction === "right");
  const likedModels = MODELS.filter((m) => liked.some((r) => r.modelId === m.id));

  // Simulate matches: ~70% chance, at least 1 if any liked
  const matches = (() => {
    if (likedModels.length === 0) return [];
    const candidates = likedModels.filter(() => Math.random() < 0.7);
    if (candidates.length === 0) return [likedModels[Math.floor(Math.random() * likedModels.length)]];
    return candidates;
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 py-6"
    >
      {matches.length > 0 ? (
        <>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5"
            >
              <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
              <span className="font-mono text-sm font-semibold text-pink-400">
                {matches.length === 1 ? "It's a match!" : `${matches.length} matches!`}
              </span>
            </motion.div>
            <p className="text-sm text-zinc-400">
              {matches.length === 1
                ? "One model is ready to work with you."
                : "These models are ready to work with you."}
            </p>
          </div>

          <div className={`grid w-full gap-4 ${matches.length === 1 ? "max-w-xs" : "grid-cols-2"}`}>
            {matches.map((model) => (
              <MatchCard key={model.id} model={model} />
            ))}
          </div>

          {liked.length > matches.length && (
            <p className="text-center text-xs text-zinc-600">
              {liked.length - matches.length} model
              {liked.length - matches.length > 1 ? "s" : ""} didn't match back this time.
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-5xl">😶</span>
          <p className="font-semibold text-white">No matches this time</p>
          <p className="max-w-xs text-sm text-zinc-400">
            You passed on all the models. Maybe give one a chance?
          </p>
        </div>
      )}

      <button
        onClick={onRestart}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </motion.div>
  );
}

export function ModelTinder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [phase, setPhase] = useState<Phase>("swiping");
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);
  const isAnimating = useRef(false);

  const visibleModels = MODELS.slice(currentIndex, currentIndex + 3);

  const handleSwipe = (direction: SwipeDirection) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const model = MODELS[currentIndex];
    const newResults = [...results, { modelId: model.id, direction }];
    setResults(newResults);
    setExitDirection(direction);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setExitDirection(null);
      isAnimating.current = false;

      if (nextIndex >= MODELS.length) {
        setPhase("loading");
        setTimeout(() => setPhase("results"), 1600);
      }
    }, 350);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults([]);
    setPhase("swiping");
    setExitDirection(null);
    isAnimating.current = false;
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <h3 className="font-mono text-sm font-semibold text-zinc-100">
            Model Match
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Swipe to find your AI coding partner
          </p>
        </div>
        {phase === "swiping" && (
          <span className="font-mono text-xs text-zinc-600">
            {currentIndex + 1} / {MODELS.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-8">
        {phase === "loading" && <LoadingScreen />}

        {phase === "results" && (
          <ResultsScreen results={results} onRestart={handleRestart} />
        )}

        {phase === "swiping" && (
          <div className="flex flex-col items-center gap-6">
            {/* Card stack */}
            <div className="relative h-[460px] w-full max-w-sm sm:h-[480px]">
              <AnimatePresence>
                {visibleModels.map((model, i) => {
                  const isTop = i === 0;
                  return (
                    <ModelCard
                      key={model.id}
                      model={model}
                      onSwipe={handleSwipe}
                      isTop={isTop}
                      stackIndex={i}
                    />
                  );
                })}
              </AnimatePresence>

              {visibleModels.length === 0 && (
                <div className="flex h-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                  <p className="text-sm text-zinc-500">All done!</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleSwipe("left")}
                disabled={isAnimating.current}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500/40 bg-zinc-900 text-red-400 shadow-lg transition-all hover:border-red-500 hover:bg-red-500/10 hover:scale-110 active:scale-95 disabled:opacity-40"
                aria-label="Pass"
              >
                <X className="h-6 w-6" />
              </button>

              <p className="text-xs text-zinc-600">swipe or tap</p>

              <button
                onClick={() => handleSwipe("right")}
                disabled={isAnimating.current}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-500/40 bg-zinc-900 text-green-400 shadow-lg transition-all hover:border-green-500 hover:bg-green-500/10 hover:scale-110 active:scale-95 disabled:opacity-40"
                aria-label="Like"
              >
                <Heart className="h-6 w-6" />
              </button>
            </div>

            {/* Hint */}
            <p className="text-center text-xs text-zinc-600">
              Drag the card left to pass · right to like
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
