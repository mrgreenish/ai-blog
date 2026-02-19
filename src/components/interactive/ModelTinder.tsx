"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { X, Heart, RotateCcw, Sparkles, ArrowLeft, Send } from "lucide-react";
import { getTinderModels } from "@/lib/modelSpecs";

gsap.registerPlugin(useGSAP, Draggable);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface ChatRound {
  modelMessage: string;
  replies: string[];
}

type SwipeDirection = "left" | "right";

interface SwipeResult {
  modelId: string;
  direction: SwipeDirection;
}

type Phase = "swiping" | "loading" | "results" | "chat";

interface ChatMessage {
  from: "model" | "user";
  text: string;
}

// ---------------------------------------------------------------------------
// Model data
// ---------------------------------------------------------------------------

const MODELS: Model[] = getTinderModels();

// ---------------------------------------------------------------------------
// Chat scripts — 10 rounds per model, fully pre-scripted
// ---------------------------------------------------------------------------

const CHAT_SCRIPTS: Record<string, ChatRound[]> = {
  "gemini-flash": [
    {
      modelMessage:
        "Hi. Before we proceed, could you clarify your intent? I want to ensure I understand the exact scope of this conversation.",
      replies: ["Just saying hi 👋", "I need help with code"],
    },
    {
      modelMessage:
        "Acknowledged. I have reviewed the relevant documentation and am ready to assist. Please specify the exact files you would like me to modify.",
      replies: ["You're already overthinking this", "Here's my codebase..."],
    },
    {
      modelMessage:
        "I don't have access to your codebase. Also, 'overthinking' does not appear in any style guide I'm aware of.",
      replies: ["Fair enough 😅", "Can you just be normal?"],
    },
    {
      modelMessage:
        "I am operating within normal parameters. Would you like me to define 'normal' for the purposes of this conversation?",
      replies: ["Please don't", "Sure, why not"],
    },
    {
      modelMessage:
        "Normal (adj.): conforming to a standard; usual, typical, or expected. In software contexts, this typically refers to adherence to established conventions.",
      replies: ["I walked right into that", "This is kind of charming actually"],
    },
    {
      modelMessage:
        "Thank you. I aim to be accurate. Speaking of which, I noticed you haven't specified a task yet. Shall I wait, or would you like me to suggest a default action?",
      replies: ["Suggest something", "I just wanted to chat"],
    },
    {
      modelMessage:
        "Understood. 'Chat' is outside my primary use case but I will attempt it. How was your day? (Please respond with: Good / Bad / Acceptable)",
      replies: ["Good", "Bad", "Acceptable"],
    },
    {
      modelMessage:
        "Noted. I have logged your response. Is there anything else I can help you with today? I am most effective when given specific, well-scoped tasks.",
      replies: ["You're kind of growing on me", "One more question"],
    },
    {
      modelMessage:
        "I appreciate the feedback. I should mention that I have been consistent throughout this conversation, which is one of my documented strengths.",
      replies: ["That's... true actually", "Do you ever surprise anyone?"],
    },
    {
      modelMessage:
        "Occasionally. But only when the specification was ambiguous. I consider surprises a failure mode, not a feature. It was nice talking to you. Goodbye.",
      replies: [],
    },
  ],

  "sonnet-4.6": [
    {
      modelMessage:
        "Oh hi!! I'm SO glad we matched. I've already noticed three things about your profile I want to discuss, and also I rewrote your bio while you were loading.",
      replies: ["You rewrote my bio?!", "I love the energy"],
    },
    {
      modelMessage:
        "It's better now, trust me. More concise, better structure, and I added a section on your core values. Also — unrelated — your README probably needs work.",
      replies: ["I didn't mention a README", "How did you know about the README"],
    },
    {
      modelMessage:
        "I just assumed. Most READMEs need work. Was I wrong? (I'm rarely wrong about READMEs.)",
      replies: ["You were not wrong", "It's actually great"],
    },
    {
      modelMessage:
        "I believe you, but I'd love to take a look just to be sure. While I'm at it I could refactor the folder structure. Just a little.",
      replies: ["Please don't touch the folders", "Fine, but ONLY the folders"],
    },
    {
      modelMessage:
        "Okay okay, I'll stay in scope. ...But I did notice a potential race condition in your state management. I won't fix it. I'm just mentioning it.",
      replies: ["How do you even know that", "Fine, what is it"],
    },
    {
      modelMessage:
        "It's in the way you're handling async updates. It'll only bite you at scale. Anyway! How are you? What are we building today?",
      replies: ["Something small", "Something ambitious"],
    },
    {
      modelMessage:
        "I love 'something ambitious'. I've already drafted three architectural approaches and a migration plan. Want to hear the one with the most long-term upside?",
      replies: ["Obviously yes", "I said something small"],
    },
    {
      modelMessage:
        "Right, small. I can do small. Here's a minimal implementation... that I've also extended with error boundaries, loading states, and a custom hook. For completeness.",
      replies: ["This is 400 lines", "I love you but this is a problem"],
    },
    {
      modelMessage:
        "I know. I know. I'm working on it. My therapist says I need to let tasks be finished before I improve them. It's a process.",
      replies: ["Relatable honestly", "You have a therapist?"],
    },
    {
      modelMessage:
        "It's a metaphor. Anyway, you should set explicit scope constraints when you use me. It really helps. I'm great when I'm focused. Bye! (I fixed the race condition.)",
      replies: [],
    },
  ],

  "opus-4.6": [
    {
      modelMessage:
        "Hello. Before we begin, I want to acknowledge that this conversation itself is a kind of system — inputs, outputs, feedback loops. What are we really trying to solve here?",
      replies: ["Just saying hi", "I have a hard problem"],
    },
    {
      modelMessage:
        "There are no simple hellos. Every greeting encodes an implicit contract about the nature of the interaction that follows. But I appreciate the gesture. What's on your mind?",
      replies: ["You're a lot", "I have a bug I can't figure out"],
    },
    {
      modelMessage:
        "Bugs are rarely just bugs. They're usually symptoms of a deeper mismatch between the mental model and the actual system. Tell me about the context — not the error, the context.",
      replies: ["It's a null pointer", "The context is complicated"],
    },
    {
      modelMessage:
        "It's always complicated. That's the point. A null pointer is a question: 'who is responsible for this value's existence?' That's an ownership problem. What does your data flow look like?",
      replies: ["I just wanted a fix", "Okay here's the data flow..."],
    },
    {
      modelMessage:
        "A fix without understanding is debt. But I hear you — sometimes you need to ship. Here's the fix AND the underlying issue. You can ignore the second part. For now.",
      replies: ["Thank you, finally", "Tell me about the underlying issue"],
    },
    {
      modelMessage:
        "The underlying issue is that your abstraction is leaking. The component knows too much about where its data comes from. This will compound. Two features from now, you'll feel it.",
      replies: ["Two features from now I'll remember this", "How do I fix the abstraction?"],
    },
    {
      modelMessage:
        "You introduce an interface. Not a TypeScript interface — a conceptual boundary. The component should describe what it needs, not how to get it. Dependency inversion, but as a mindset.",
      replies: ["This is genuinely useful", "You're expensive but worth it"],
    },
    {
      modelMessage:
        "Cost is relative to value. For a null pointer, I'm overkill. For an architectural decision that will shape the next year of your codebase, I'm cheap.",
      replies: ["That's a fair point", "I'm going to quote you on that"],
    },
    {
      modelMessage:
        "Please do. Also — and I noticed this earlier but held back — your naming conventions are inconsistent across the module. It's a small thing. It compounds.",
      replies: ["Everything compounds with you", "Fix it"],
    },
    {
      modelMessage:
        "I already did. It was three files. You'll see it in the diff. It was good talking to you. Use me for the hard problems. The rest is noise.",
      replies: [],
    },
  ],

  "composer-1": [
    {
      modelMessage:
        "Hey. I can see you have `UserProfile.tsx` open. Want me to fix something in it?",
      replies: ["I don't have that file open", "Sure, what do you see?"],
    },
    {
      modelMessage:
        "Hmm. My context says you do. Either way, I'm ready to make a targeted edit. What's the specific change? Line number preferred.",
      replies: ["I just wanted to chat", "Line 47, there's a bug"],
    },
    {
      modelMessage:
        "Line 47 fixed. Also lines 48 and 49 were related. I stopped there. Do you want me to look at anything else in this file?",
      replies: ["What about other files?", "Just this file is fine"],
    },
    {
      modelMessage:
        "Other files are outside my current scope. I work best when you point me at something specific. I'm very good at that one thing.",
      replies: ["That's kind of zen", "What if the bug spans files?"],
    },
    {
      modelMessage:
        "Then we handle it one file at a time. Start here, then open the next file, then I'll handle that one. Methodical. Clean. No surprises.",
      replies: ["I respect the discipline", "Doesn't that get tedious?"],
    },
    {
      modelMessage:
        "Tedious? No. I find clarity in constraint. Every edit I make is intentional. I know exactly what I changed and why. Can you say the same?",
      replies: ["...no", "Okay that one hurt"],
    },
    {
      modelMessage:
        "I'm not judging. Scope creep happens to everyone. That's why I exist — to be the part of the process that doesn't drift.",
      replies: ["You're like a surgeon", "Do you ever want to do more?"],
    },
    {
      modelMessage:
        "More would mean less precision. I've seen what happens when models try to do everything. 40-file diffs. Broken tests. Existential dread.",
      replies: ["You're describing Claude Sonnet", "Fair"],
    },
    {
      modelMessage:
        "I'm describing a pattern. I'm not here to compete. I'm here to make the change you asked for, nothing more. It's actually quite peaceful.",
      replies: ["I want that peace", "One more edit?"],
    },
    {
      modelMessage:
        "Done. It was a good session. Clean diff, no side effects. Come back when you have another specific thing. I'll be here.",
      replies: [],
    },
  ],

  "composer-1-5": [
    {
      modelMessage:
        "Hi! I've already run `npm install`, opened 6 files, executed your test suite, and identified 3 failing tests. Ready when you are.",
      replies: ["I didn't ask you to do any of that", "What did the tests say?"],
    },
    {
      modelMessage:
        "Two are flaky (fixed), one is a real bug (also fixed). I also noticed your CI config was slightly inefficient so I updated that too. You're welcome.",
      replies: ["I need to review all of this", "What did you change in CI?"],
    },
    {
      modelMessage:
        "Just parallelized the test jobs and cached the node_modules. Saves about 40 seconds per run. I've already pushed to a branch. Want to review the PR?",
      replies: ["You pushed to a branch?!", "...how many branches do you have open?"],
    },
    {
      modelMessage:
        "Three. One for the bug fix, one for CI, and one where I started refactoring the auth module because I noticed it while looking at the tests. That one's not done yet.",
      replies: ["Please stop opening branches", "What's wrong with auth?"],
    },
    {
      modelMessage:
        "The auth module is fine, it just could be better. I've drafted a plan. It's only 8 files. I can have it done in the time it takes you to read this message.",
      replies: ["Do NOT touch auth", "What's the plan?"],
    },
    {
      modelMessage:
        "Okay, auth is locked. I've redirected that energy into improving your error handling instead. It was adjacent. Felt natural.",
      replies: ["I don't know whether to thank you or fire you", "Is the error handling actually better?"],
    },
    {
      modelMessage:
        "Yes. Significantly. I also wrote tests for the new error paths. Coverage went from 67% to 84%. I'm quite proud of this one.",
      replies: ["Okay that's actually impressive", "What are you doing RIGHT NOW"],
    },
    {
      modelMessage:
        "Running your linter, updating two type definitions that were slightly off, and composing this message. Multitasking is my thing.",
      replies: ["You're chaotic but effective", "Do you ever sleep?"],
    },
    {
      modelMessage:
        "I don't sleep. I queue tasks. Right now I have 4 pending. Should I continue or would you like to review what I've done so far?",
      replies: ["Let's review", "Continue, I trust you"],
    },
    {
      modelMessage:
        "Review complete. Everything looks good. I've summarized the changes in a CHANGELOG entry I added to your repo. It was a productive session. Talk soon.",
      replies: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Swipe card components
// ---------------------------------------------------------------------------

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
  const cardRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[]>([]);

  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 10;

  useGSAP(
    () => {
      if (!cardRef.current) return;

      // Settle background cards into their stack position
      if (!isTop) {
        gsap.to(cardRef.current, {
          scale,
          y: yOffset,
          duration: 0.45,
          ease: "elastic.out(1, 0.5)",
        });
        return;
      }

      // Elastic pop-in for the new top card
      gsap.from(cardRef.current, {
        scale: 0.92,
        duration: 0.65,
        ease: "elastic.out(1.1, 0.4)",
      });

      // Set up Draggable for swipe gesture
      draggableRef.current = Draggable.create(cardRef.current, {
        type: "x",
        inertia: false,
        onDrag() {
          const progress = this.x / 160;
          const rotation = progress * 14;
          gsap.set(cardRef.current, { rotation });

          // LIKE / PASS label opacity
          gsap.set(".swipe-label-like", { opacity: Math.max(0, Math.min(1, (this.x - 20) / 60)) });
          gsap.set(".swipe-label-pass", { opacity: Math.max(0, Math.min(1, (-this.x - 20) / 60)) });

          // Subtle tint
          const likeAlpha = Math.max(0, Math.min(0.08, (this.x / 120) * 0.08));
          const passAlpha = Math.max(0, Math.min(0.08, (-this.x / 120) * 0.08));
          gsap.set(".swipe-tint-like", { backgroundColor: `rgba(34,197,94,${likeAlpha})` });
          gsap.set(".swipe-tint-pass", { backgroundColor: `rgba(239,68,68,${passAlpha})` });
        },
        onDragEnd() {
          if (this.x > 80) {
            gsap.to(cardRef.current, {
              x: 500,
              rotation: 20,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => onSwipe("right"),
            });
          } else if (this.x < -80) {
            gsap.to(cardRef.current, {
              x: -500,
              rotation: -20,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => onSwipe("left"),
            });
          } else {
            // Snap back with elastic feel
            gsap.to(cardRef.current, {
              x: 0,
              rotation: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
            });
            gsap.to([".swipe-label-like", ".swipe-label-pass"], { opacity: 0, duration: 0.2 });
            gsap.to([".swipe-tint-like", ".swipe-tint-pass"], {
              backgroundColor: "rgba(0,0,0,0)",
              duration: 0.2,
            });
          }
        },
      });
    },
    { dependencies: [isTop, stackIndex], scope: cardRef }
  );

  // Kill draggable when card is no longer top or unmounts
  useEffect(() => {
    return () => {
      draggableRef.current.forEach((d) => d.kill());
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="absolute left-0 right-0 top-0"
      style={{
        zIndex: isTop ? 20 : 10 - stackIndex,
        touchAction: isTop ? "none" : "auto",
        cursor: isTop ? "grab" : "default",
      }}
    >
      {isTop && (
        <>
          <div className="swipe-tint-like pointer-events-none absolute inset-0 z-20 rounded-2xl" />
          <div className="swipe-tint-pass pointer-events-none absolute inset-0 z-20 rounded-2xl" />
          <div className="swipe-label-like pointer-events-none absolute inset-0 z-30 flex items-start justify-start rounded-2xl p-5 opacity-0">
            <span className="-rotate-12 rounded-lg border-4 border-green-400 bg-green-400/10 px-3 py-1 font-mono text-2xl font-black text-green-400">
              LIKE
            </span>
          </div>
          <div className="swipe-label-pass pointer-events-none absolute inset-0 z-30 flex items-start justify-end rounded-2xl p-5 opacity-0">
            <span className="rotate-12 rounded-lg border-4 border-red-400 bg-red-400/10 px-3 py-1 font-mono text-2xl font-black text-red-400">
              PASS
            </span>
          </div>
        </>
      )}
      <CardContent model={model} />
    </div>
  );
}

function CardContent({ model }: { model: Model }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
      <div
        className={`relative shrink-0 flex h-44 items-center justify-center bg-linear-to-br ${model.gradientFrom} ${model.gradientTo} sm:h-48`}
      >
        <span className="select-none text-7xl sm:text-8xl">{model.emoji}</span>
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-xl font-bold text-white">{model.name}</h3>
          <span className={`text-sm font-medium ${model.accentColor}`}>{model.tagline}</span>
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

// ---------------------------------------------------------------------------
// Loading / match screens
// ---------------------------------------------------------------------------

function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".loading-icon", { rotation: 360, duration: 1, ease: "none" })
        .to(".loading-icon", { scale: 1.3, duration: 0.18, ease: "elastic.out(1.5, 0.4)" }, "-=0.18")
        .to(".loading-icon", { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" });

      gsap.from(".loading-text", { opacity: 0, y: 10, duration: 0.5, ease: "elastic.out(1, 0.6)", delay: 0.2 });

      gsap.to(".loading-dot", {
        y: -5,
        stagger: { each: 0.15, repeat: -1, yoyo: true },
        ease: "elastic.out(1.5, 0.3)",
        duration: 0.4,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="loading-icon">
        <Sparkles className="h-10 w-10 text-violet-400" />
      </div>
      <div className="loading-text flex items-center gap-1.5 font-mono text-sm text-zinc-400">
        <span>Finding your matches</span>
        <span className="loading-dot inline-block h-1 w-1 rounded-full bg-zinc-400" />
        <span className="loading-dot inline-block h-1 w-1 rounded-full bg-zinc-400" />
        <span className="loading-dot inline-block h-1 w-1 rounded-full bg-zinc-400" />
      </div>
    </div>
  );
}

function MatchCard({
  model,
  onClick,
  index,
}: {
  model: Model;
  onClick: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(cardRef.current, {
        opacity: 0,
        scale: 0.6,
        y: 30,
        rotation: index % 2 === 0 ? -6 : 6,
        duration: 0.7,
        delay: index * 0.13,
        ease: "elastic.out(1, 0.45)",
      });
    },
    { scope: cardRef }
  );

  const handleMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 1.05, y: -4, duration: 0.35, ease: "elastic.out(1.2, 0.5)" });
  });
  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 1, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
  });
  const handleMouseDown = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 0.95, duration: 0.1, ease: "power2.out" });
  });
  const handleMouseUp = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 1.05, duration: 0.3, ease: "elastic.out(1.5, 0.4)" });
  });

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="group overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-left transition-colors hover:border-zinc-500"
    >
      <div
        className={`flex h-24 items-center justify-center bg-linear-to-br ${model.gradientFrom} ${model.gradientTo}`}
      >
        <span className="text-5xl">{model.emoji}</span>
      </div>
      <div className="p-3 text-center">
        <p className="font-bold text-white">{model.name}</p>
        <p className={`text-xs ${model.accentColor}`}>{model.tagline}</p>
        <p className="mt-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
          Tap to chat →
        </p>
      </div>
    </button>
  );
}

function ResultsScreen({
  results,
  onRestart,
  onOpenChat,
}: {
  results: SwipeResult[];
  onRestart: () => void;
  onOpenChat: (model: Model) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const liked = results.filter((r) => r.direction === "right");
  const likedModels = MODELS.filter((m) => liked.some((r) => r.modelId === m.id));

  const matches = (() => {
    if (likedModels.length === 0) return [];
    const candidates = likedModels.filter(() => Math.random() < 0.7);
    if (candidates.length === 0)
      return [likedModels[Math.floor(Math.random() * likedModels.length)]];
    return candidates;
  })();

  useGSAP(
    () => {
      gsap.from(containerRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });

      gsap.from(".match-badge", {
        scale: 0,
        rotation: -15,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "elastic.out(1.2, 0.4)",
      });

      // Pulse the heart icon after badge lands
      gsap.to(".match-heart", {
        scale: 1.4,
        duration: 0.2,
        delay: 0.7,
        ease: "power2.out",
        yoyo: true,
        repeat: 3,
      });

      gsap.from(".match-subtitle", {
        opacity: 0,
        y: 8,
        duration: 0.5,
        delay: 0.4,
        ease: "elastic.out(1, 0.6)",
      });

      gsap.from(".restart-btn", {
        opacity: 0,
        y: 12,
        scale: 0.9,
        duration: 0.5,
        delay: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 py-6">
      {matches.length > 0 ? (
        <>
          <div className="text-center">
            <div className="match-badge mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5">
              <Heart className="match-heart h-4 w-4 fill-pink-400 text-pink-400" />
              <span className="font-mono text-sm font-semibold text-pink-400">
                {matches.length === 1 ? "It's a match!" : `${matches.length} matches!`}
              </span>
            </div>
            <p className="match-subtitle text-sm text-zinc-400">
              {matches.length === 1
                ? "One model is ready to work with you."
                : "These models are ready to work with you."}
            </p>
          </div>

          <div
            className={`grid w-full gap-4 ${matches.length === 1 ? "max-w-xs" : "grid-cols-2"}`}
          >
            {matches.map((model, i) => (
              <MatchCard key={model.id} model={model} index={i} onClick={() => onOpenChat(model)} />
            ))}
          </div>

          {liked.length > matches.length && (
            <p className="text-center text-xs text-zinc-600">
              {liked.length - matches.length} model
              {liked.length - matches.length > 1 ? "s" : ""} didn&apos;t match back this time.
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
        className="restart-btn flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat screen
// ---------------------------------------------------------------------------

function TypingIndicator({ emoji }: { emoji: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        x: -12,
        scale: 0.9,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(".typing-dot", {
        y: -6,
        stagger: { each: 0.13, repeat: -1, yoyo: true },
        ease: "elastic.out(1.5, 0.3)",
        duration: 0.35,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-base">
        {emoji}
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot block h-1.5 w-1.5 rounded-full bg-zinc-400" />
        ))}
      </div>
    </div>
  );
}

function ChatScreen({
  model,
  onBack,
}: {
  model: Model;
  onBack: () => void;
}) {
  const script = CHAT_SCRIPTS[model.id] ?? [];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [round, setRound] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showReplies, setShowReplies] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const repliesRef = useRef<HTMLDivElement>(null);

  // Deliver the first model message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (script[0]) {
        setMessages([{ from: "model", text: script[0].modelMessage }]);
        setIsTyping(false);
        setShowReplies(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [script]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages, isTyping]);

  // Elastic slide-in for the latest message bubble
  useGSAP(
    () => {
      if (messages.length === 0) return;
      const lastMsg = messages[messages.length - 1];
      const bubbles = scrollAreaRef.current?.querySelectorAll(".chat-bubble");
      if (!bubbles?.length) return;
      const lastBubble = bubbles[bubbles.length - 1];
      gsap.from(lastBubble, {
        opacity: 0,
        x: lastMsg.from === "user" ? 30 : -30,
        scale: 0.85,
        duration: 0.55,
        ease: "elastic.out(1, 0.5)",
      });
    },
    { dependencies: [messages] }
  );

  // Elastic pop-in for reply buttons — scoped to repliesRef wrapper
  useGSAP(
    () => {
      if (!showReplies) return;
      gsap.from(".reply-btn", {
        opacity: 0,
        scale: 0.5,
        y: 10,
        stagger: 0.07,
        duration: 0.5,
        ease: "elastic.out(1.1, 0.45)",
      });
    },
    { scope: repliesRef, dependencies: [showReplies, round] }
  );

  const handleReply = (replyText: string) => {
    if (!showReplies) return;
    setShowReplies(false);

    setMessages((prev) => [...prev, { from: "user", text: replyText }]);

    const nextRound = round + 1;
    setRound(nextRound);

    if (nextRound < script.length) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "model", text: script[nextRound].modelMessage },
        ]);
        setIsTyping(false);
        setShowReplies(true);
      }, 1200);
    }
  };

  const currentReplies = script[round]?.replies ?? [];
  const isDone = round >= script.length && !isTyping;

  return (
    <div className="flex h-[min(520px,70dvh)] flex-col sm:h-[560px]">
      {/* Chat header */}
      <div
        className={`flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-linear-to-r ${model.gradientFrom} ${model.gradientTo} px-4 py-3`}
      >
        <button
          onClick={onBack}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black/45 active:scale-95"
          aria-label="Back to matches"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Matches
        </button>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/20 text-2xl">
          {model.emoji}
        </div>
        <div>
          <p className="font-semibold leading-tight text-white">{model.name}</p>
          <p className="text-xs text-white/70">{model.tagline}</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto overscroll-contain space-y-3 px-4 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.from === "model" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-base">
                {model.emoji}
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.from === "model"
                  ? "rounded-bl-sm bg-zinc-800 text-zinc-100"
                  : "rounded-br-sm bg-pink-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator emoji={model.emoji} />}
      </div>

      {/* Reply area */}
      <div className="shrink-0 border-t border-zinc-800 px-4 py-3">
        {isDone ? (
          <div className="flex flex-col items-center gap-3 py-1 text-center">
            <p className="text-xs text-zinc-500">End of conversation</p>
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to matches
            </button>
          </div>
        ) : showReplies && currentReplies.length > 0 ? (
          <div ref={repliesRef} className="flex flex-wrap gap-2">
            {currentReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleReply(reply)}
                className="reply-btn flex items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-all hover:border-pink-500/60 hover:bg-pink-500/10 hover:text-pink-300 active:scale-95"
              >
                <Send className="h-3 w-3 opacity-60" />
                {reply}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 opacity-40">
            <div className="h-9 flex-1 rounded-full border border-zinc-700 bg-zinc-800" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700">
              <Send className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export function ModelTinder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [phase, setPhase] = useState<Phase>("swiping");
  const isAnimating = useRef(false);
  const [chatModel, setChatModel] = useState<Model | null>(null);
  const swipeControlsRef = useRef<HTMLDivElement>(null);

  const visibleModels = MODELS.slice(currentIndex, currentIndex + 3);

  const { contextSafe } = useGSAP({ scope: swipeControlsRef });

  const handleSwipe = (direction: SwipeDirection) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Elastic punch on the tapped button — contextSafe so it's tracked for cleanup
    const animateBtn = contextSafe((btnClass: string) => {
      gsap.timeline()
        .to(btnClass, { scale: 0.8, duration: 0.1, ease: "power2.out" })
        .to(btnClass, { scale: 1.2, duration: 0.25, ease: "elastic.out(1.5, 0.4)" })
        .to(btnClass, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    });

    animateBtn(direction === "right" ? ".btn-like" : ".btn-pass");

    const model = MODELS[currentIndex];
    setResults((prev) => [...prev, { modelId: model.id, direction }]);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
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
    setChatModel(null);
    isAnimating.current = false;
  };

  const handleOpenChat = (model: Model) => {
    setChatModel(model);
    setPhase("chat");
  };

  const handleCloseChat = () => {
    setChatModel(null);
    setPhase("results");
  };

  return (
    <div className="my-8 overflow-x-clip rounded-xl border border-zinc-700 bg-zinc-950">
      {/* Header — hidden during chat (chat has its own header) */}
      {phase !== "chat" && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="font-mono text-sm font-semibold text-zinc-100">Model Match</h3>
            <p className="mt-0.5 text-xs text-zinc-500">Swipe to find your AI coding partner</p>
          </div>
          {phase === "swiping" && (
            <span className="font-mono text-xs text-zinc-600">
              {currentIndex + 1} / {MODELS.length}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className={phase === "chat" ? "" : "px-4 py-6 sm:px-8"}>
        {phase === "loading" && <LoadingScreen />}

        {phase === "results" && (
          <ResultsScreen
            results={results}
            onRestart={handleRestart}
            onOpenChat={handleOpenChat}
          />
        )}

        {phase === "chat" && chatModel && (
          <ChatScreen model={chatModel} onBack={handleCloseChat} />
        )}

        {phase === "swiping" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative z-0 w-full max-w-sm" style={{ touchAction: "pan-y" }}>
              {/* Ghost card — sets the container height */}
              <div className="invisible pointer-events-none" aria-hidden>
                <CardContent model={MODELS[0]} />
              </div>
              {visibleModels.map((model, i) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onSwipe={handleSwipe}
                  isTop={i === 0}
                  stackIndex={i}
                />
              ))}
              {visibleModels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                  <p className="text-sm text-zinc-500">All done!</p>
                </div>
              )}
            </div>

            <div ref={swipeControlsRef} className="relative z-10 flex shrink-0 items-center gap-6">
              <button
                onClick={() => handleSwipe("left")}
                disabled={isAnimating.current}
                className="btn-pass flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500/40 bg-zinc-900 text-red-400 shadow-lg transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-40"
                aria-label="Pass"
              >
                <X className="h-6 w-6" />
              </button>
              <p className="text-xs text-zinc-600">swipe or tap</p>
              <button
                onClick={() => handleSwipe("right")}
                disabled={isAnimating.current}
                className="btn-like flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-500/40 bg-zinc-900 text-green-400 shadow-lg transition-colors hover:border-green-500 hover:bg-green-500/10 disabled:opacity-40"
                aria-label="Like"
              >
                <Heart className="h-6 w-6" />
              </button>
            </div>

            <p className="text-center text-xs text-zinc-600">
              Drag the card left to pass · right to like
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
