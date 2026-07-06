// ---------------------------------------------------------------------------
// Central model registry — single source of truth for all model-specific data
// used across interactive components and blog content.
//
// To update a model's pricing, name, or personality: edit here only.
// ---------------------------------------------------------------------------

export type Tier = "fast" | "balanced" | "reasoning";
export type Provider = "Anthropic" | "OpenAI" | "Google" | "DeepSeek" | "Cursor";
/** Rough latency band for a typical developer task */
export type LatencyBand = "instant" | "fast" | "moderate" | "slow";
/** How aggressively the model expands scope beyond what was asked */
export type InitiativeStyle = "minimal" | "measured" | "proactive" | "autonomous";
/** How well the model respects explicit scope constraints */
export type ScopeDiscipline = "strict" | "good" | "drifts" | "unpredictable";

export interface PromotionalPricing {
  inputPer1M: number;
  outputPer1M: number;
  /** Inclusive ISO date on which the promotion starts. */
  startsAt: string;
  /** Inclusive ISO date on which the promotion ends. */
  endsAt: string;
  label: string;
}

export interface ModelSpec {
  // Core identity
  id: string;
  name: string;
  provider: Provider;

  // Pricing (per 1M tokens, USD)
  inputPer1M: number;
  outputPer1M: number;
  /** Temporary pricing layered over the standard rates above. */
  promotionalPricing?: PromotionalPricing;

  // Tier classification for ModelMixer
  tier: Tier;

  // Context window (tokens)
  contextWindowTokens: number;

  // Presentation — used by ModelPicker, ModelTinder, DevBenchmark header
  tagline: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  /** Tailwind bg-* color for context window bar */
  contextBarColor: string;
  /** Tailwind text-* color for cost calculator row */
  costColor: string;

  // Personality — used by ModelPicker
  why: Record<string, string>;
  whenWrong: string;

  // Personality — used by ModelTinder
  traits: string[];
  bestFor: string;
  worstFor: string;

  // Qualitative signals — used by ModelPicker 2.0 and ScenarioLab
  /** Typical response latency for a developer-sized task */
  latencyBand: LatencyBand;
  /** How much initiative the model takes beyond the literal request */
  initiativeStyle: InitiativeStyle;
  /** How reliably the model stays inside explicit scope constraints */
  scopeDiscipline: ScopeDiscipline;
  /** One-line "reach for this when…" guidance */
  pickWhen: string;
  /** One-line "avoid this when…" guidance */
  avoidWhen: string;

  // DevBenchmark — pass/fail per check key
  benchmark: {
    correctServerAction: boolean;
    followedConstraints: boolean;
    madeUpDocs: boolean;
    hiddenBugsInRefactor: boolean;
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const MODEL_REGISTRY: ModelSpec[] = [
  // ── Fast tier ──────────────────────────────────────────────────────────────
  {
    id: "gemini-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    inputPer1M: 0.50,
    outputPer1M: 3.00,
    tier: "fast",
    contextWindowTokens: 1_048_576,
    tagline: "The Careful One",
    emoji: "💎",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    accentColor: "text-cyan-600",
    contextBarColor: "bg-yellow-500",
    costColor: "text-yellow-400",
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
    traits: [
      "Literal-minded — does exactly what you say",
      "Risk-averse — picks the safest approach",
      "Consistent in long sessions",
    ],
    bestFor: "Production refactors where surprises are costly",
    worstFor: "Open-ended exploration or design decisions",
    latencyBand: "fast",
    initiativeStyle: "minimal",
    scopeDiscipline: "strict",
    pickWhen: "You need predictable, constraint-respecting output with no surprises",
    avoidWhen: "You want the model to push back, suggest alternatives, or notice problems you didn't mention",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    inputPer1M: 2.00,
    outputPer1M: 12.00,
    tier: "balanced",
    contextWindowTokens: 1_048_576,
    tagline: "The Capable Gemini",
    emoji: "💎",
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-500",
    accentColor: "text-indigo-600",
    contextBarColor: "bg-indigo-500",
    costColor: "text-indigo-400",
    why: {},
    whenWrong:
      "When you need the cheapest option or maximum predictability — Flash-tier models are often enough for mechanical work.",
    traits: [
      "Stronger reasoning than Flash with large context",
      "Good for competent coding without the heaviest frontier models",
    ],
    bestFor: "Medium-complexity tasks needing context and judgment without Opus-level cost",
    worstFor: "Simple mechanical edits where Flash is sufficient",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You need competence and context but not the absolute heaviest model",
    avoidWhen: "The task is clearly defined and low-risk — use Gemini 3 Flash instead",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek-V4-Flash",
    provider: "DeepSeek",
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    tier: "fast",
    contextWindowTokens: 1_000_000,
    tagline: "The Open One",
    emoji: "🔓",
    gradientFrom: "from-slate-600",
    gradientTo: "to-slate-500",
    accentColor: "text-slate-600",
    contextBarColor: "bg-slate-500",
    costColor: "text-slate-300",
    why: {},
    whenWrong: "When you need tight data privacy guarantees or enterprise support.",
    traits: [
      "Open-source weights — fully inspectable",
      "Strong reasoning at low cost",
      "Self-hosted option available",
    ],
    bestFor: "Cost-sensitive pipelines where open weights matter",
    worstFor: "Tasks requiring the latest frontier capabilities",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "Cost is a primary constraint and you want inspectable, self-hostable weights",
    avoidWhen: "You need the latest frontier capabilities or enterprise-grade support",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    inputPer1M: 1.00,
    outputPer1M: 5.00,
    tier: "fast",
    contextWindowTokens: 200_000,
    tagline: "The Fast Claude",
    emoji: "🌸",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-emerald-600",
    why: {},
    whenWrong: "When the task needs deep reasoning or architectural judgment.",
    traits: [
      "Fastest Anthropic model",
      "Retains Claude's instruction-following quality",
      "Cost-effective for high-volume pipelines",
    ],
    bestFor: "High-volume pipelines and quick structured tasks",
    worstFor: "Complex reasoning or architecture decisions",
    latencyBand: "instant",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You're running many quick structured tasks and latency or cost compounds",
    avoidWhen: "The task requires architectural judgment, deep reasoning, or multi-step planning",
    benchmark: {
      correctServerAction: false,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: true,
    },
  },

  // ── Balanced tier ──────────────────────────────────────────────────────────
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    inputPer1M: 2.50,
    outputPer1M: 15.00,
    tier: "balanced",
    contextWindowTokens: 1_050_000,
    tagline: "The Affordable Frontier",
    emoji: "🚀",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-green-500",
    accentColor: "text-emerald-600",
    contextBarColor: "bg-emerald-500",
    costColor: "text-emerald-300",
    why: {
      coding:
        "GPT-5.4 remains the cheaper GPT-5.x frontier option — strong reasoning and tool use at half the per-token price of GPT-5.5.",
      autonomous:
        "Built-in computer-use and native tool support still make GPT-5.4 useful for agentic workflows that need to operate UIs, run code, and verify results end-to-end.",
      architecture:
        "The 1M token context window lets GPT-5.4 hold an entire large codebase in context while reasoning about architectural decisions — without chunking or summarization.",
      hard:
        "Reasoning effort levels (low → xhigh) let you dial in exactly how much thinking the model does. For genuinely hard problems, xhigh effort catches what other models miss.",
      multifile:
        "With a 1M context window and strong tool use, GPT-5.4 can coordinate changes across a large codebase in a single pass.",
    },
    whenWrong:
      "When you need predictable, scope-respecting output. GPT-5.4's agentic instincts mean it can go deep on a problem — sometimes deeper than you wanted. Set explicit constraints or use a lighter model for simple tasks.",
    traits: [
      "1M token context — holds entire large codebases",
      "Reasoning effort levels: none → low → medium → high → xhigh",
      "Native computer-use and tool search built in",
    ],
    bestFor: "Complex agentic tasks, hard reasoning, and large-context work",
    worstFor: "Simple tasks where the cost and latency aren't justified",
    latencyBand: "moderate",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You need frontier reasoning with large context or native computer-use for agentic workflows",
    avoidWhen: "The task is simple — use a fast model like Gemini Flash or Haiku instead",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    promotionalPricing: {
      inputPer1M: 2.00,
      outputPer1M: 10.00,
      startsAt: "2026-06-30",
      endsAt: "2026-08-31",
      label: "Introductory pricing through August 31, 2026",
    },
    tier: "balanced",
    contextWindowTokens: 1_000_000,
    tagline: "The Proactive One",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-600",
    contextBarColor: "bg-blue-500",
    costColor: "text-blue-400",
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
    traits: [
      "Genuinely creative — suggests better APIs",
      "Notices things you didn't ask about",
      "Best at explaining complex concepts",
    ],
    bestFor: "Feature design and architecture exploration",
    worstFor: "Tight-scope tasks where drift is expensive",
    latencyBand: "moderate",
    initiativeStyle: "proactive",
    scopeDiscipline: "drifts",
    pickWhen: "You want a thought partner that notices things, suggests better approaches, and handles multi-file work",
    avoidWhen: "Scope drift is expensive — add explicit constraints or use a more focused model",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },

  // ── Reasoning tier ─────────────────────────────────────────────────────────
  {
    id: "opus-4.8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    inputPer1M: 5.00,
    outputPer1M: 25.00,
    tier: "reasoning",
    contextWindowTokens: 1_000_000,
    tagline: "The Deep Thinker",
    emoji: "🧠",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-amber-600",
    contextBarColor: "bg-orange-500",
    costColor: "text-zinc-300",
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
      reasoning:
        "Opus doesn't pattern-match — it actually reasons. Multi-step logic, constraint satisfaction, debugging subtle interactions — this is the task type where the gap between Opus and everything else is widest.",
      hard:
        "Where other models pattern-match, Opus reasons through the problem. It catches bugs that require understanding three levels of indirection.",
      accuracy:
        "Opus's thoroughness means it considers more options and explores more edge cases. When you need to be right, not just fast, it's the right choice.",
    },
    whenWrong:
      "For routine tasks. Opus is expensive and slow, and the depth it provides isn't proportional to the value for scaffolding, simple refactors, or boilerplate. You're paying for a level of reasoning the task doesn't need.",
    traits: [
      "Traces actual logic, not just patterns",
      "Thinks in systems and abstractions",
      "Proactive with high-signal observations",
    ],
    bestFor: "Hard problems, architecture reviews, subtle bugs",
    worstFor: "Routine tasks — cost and latency don't justify it",
    latencyBand: "slow",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "Correctness is non-negotiable — hard bugs, architecture decisions, or critical system design",
    avoidWhen: "The task is routine — scaffolding, boilerplate, or simple refactors don't justify the cost",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "OpenAI",
    inputPer1M: 5.00,
    outputPer1M: 30.00,
    tier: "reasoning",
    contextWindowTokens: 1_050_000,
    tagline: "The Autonomous Loop",
    emoji: "🔁",
    gradientFrom: "from-teal-600",
    gradientTo: "to-emerald-500",
    accentColor: "text-teal-600",
    contextBarColor: "bg-teal-500",
    costColor: "text-teal-300",
    why: {
      autonomous:
        "GPT-5.5 is the strongest model released so far for long-running tool-use loops. 82.7% on Terminal-Bench 2.0 (vs Opus 4.8's 69.4%), plus leads on BrowseComp and CyberGym — it keeps going until the task is actually finished instead of handing back a plan.",
      coding:
        "First fully retrained base model since GPT-4.5. Developers describe it as needing much less hand-holding: you state the goal, it picks the right files, edits them, runs them, and corrects itself without a dozen follow-up prompts.",
      multifile:
        "1M token context plus strong tool-use means GPT-5.5 can coordinate changes across a large codebase while actually executing and verifying them, not just producing a diff.",
      hard:
        "Closer to 'agent that can run a shell for an hour' than 'model that returns an answer.' For tasks where the answer is a working artifact, not a block of text, 5.5 is the default pick.",
      architecture:
        "GPT-5.5 matches earlier GPT-5.x latency despite the capability jump, so you can put it behind agentic workflows without the usual speed tax.",
    },
    whenWrong:
      "For review-grade reasoning, long-document Q&A, or anything close to HLE territory. Opus 4.8 still wins on SWE-bench Pro (64.3% vs 58.6%), HLE (46.9% vs 41.4%), and MCP-Atlas — if the task is 'reason deeply once' rather than 'run a loop,' pick Opus.",
    traits: [
      "1M token context with earlier GPT-5.x latency",
      "State-of-the-art on autonomous tool-use and terminal benchmarks",
      "First fully retrained base model since GPT-4.5",
    ],
    bestFor: "Agentic coding, browser automation, and long tool-use loops",
    worstFor: "Review-grade reasoning and long-document Q&A — Opus 4.8 still edges it there",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "The task is a multi-step loop — run commands, read output, edit files, verify — and you want it finished, not planned",
    avoidWhen: "You're paying for output tokens at volume and the task doesn't need the extra agentic range — a cheaper GPT-5.x model may be enough",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  // ── Cursor agentic ─────────────────────────────────────────────────────────
  {
    id: "composer-2.5",
    name: "Composer 2.5",
    provider: "Cursor",
    inputPer1M: 0.50,
    outputPer1M: 2.50,
    tier: "balanced",
    contextWindowTokens: 200_000,
    tagline: "The Agentic One",
    emoji: "🤖",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-pink-500",
    accentColor: "text-fuchsia-600",
    contextBarColor: "bg-fuchsia-500",
    costColor: "text-fuchsia-600",
    why: {
      autonomous:
        "Composer 2.5 runs terminal commands, reads the output, makes more edits, and loops until the task is done. It now sustains long horizons more reliably than Composer 2 did — the May 2026 retrain was specifically tuned for multi-step coherence.",
      multifile:
        "It navigates the project, finds the relevant files, and makes coordinated changes across many of them — without you having to specify each one. Trained on 25× more synthetic refactor and feature-deletion tasks than Composer 2.",
      selfcorrect:
        "It sees the TypeScript error, understands it in context, and fixes it — without you having to copy-paste the error back into a prompt. Targeted RL with Textual Feedback localized the corrections during training instead of relying on final reward only.",
      hardproblems:
        "Composer 2.5 is Cursor's own model — same Kimi K2.5 base as Composer 2, retrained to land in the same room as Opus 4.8 and GPT-5.5 on SWE-Bench Multilingual (79.8%) and CursorBench v3.1 (63.2%) at roughly one tenth the per-token cost.",
    },
    whenWrong:
      "When you need a really hard reasoning result. On Terminal-Bench 2.0 it ties Opus 4.8 (~69%) but trails GPT-5.5's 82.7% on long autonomous loops. Some users also report it sometimes hedges with lightweight answers until you nudge it to think harder.",
    traits: [
      "Frontier-competitive on SWE-Bench Multilingual (79.8%) and CursorBench v3.1 (63.2%) — within ~1 point of Opus 4.8 at ~10× cheaper per token",
      "Tuned for tool use, terminal, and file edits inside Cursor",
      "Built on Moonshot's Kimi K2.5; trained with Targeted RL with Textual Feedback and 25× more synthetic tasks than Composer 2",
      "Standard $0.50/$2.50 per M tokens; Fast variant at $3/$15 for low-latency runs",
    ],
    bestFor: "Multi-step features, refactors, and autonomous bug fixes at frontier quality without frontier pricing",
    worstFor: "Quick one-liner changes where the overhead isn't worth it, or long autonomous browser-agent loops where GPT-5.5 still leads",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You want frontier-grade agentic coding at one-tenth the cost of Opus 4.8 or GPT-5.5",
    avoidWhen: "You need the absolute best on long autonomous loops (GPT-5.5) or maximum-rigor reasoning (Opus 4.8)",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "composer-2.5-fast",
    name: "Composer 2.5 Fast",
    provider: "Cursor",
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    tier: "balanced",
    contextWindowTokens: 200_000,
    tagline: "The Fast Agent",
    emoji: "⚡",
    gradientFrom: "from-fuchsia-700",
    gradientTo: "to-rose-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-rose-400",
    why: {},
    whenWrong:
      "When the task is not urgent — standard Composer 2.5 is usually the better tradeoff if you can do other work while it runs.",
    traits: [
      "Low-latency Composer variant",
      "Higher per-token cost than standard Composer 2.5",
    ],
    bestFor: "Urgent agentic runs where latency matters more than token price",
    worstFor: "Default daily coding — avoid Fast mode unless you need the speed",
    latencyBand: "fast",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You need Composer's agentic loop and cannot wait for standard mode",
    avoidWhen: "Cost-sensitive or non-urgent work — standard Composer 2.5 is cheaper",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "opus-fast",
    name: "Claude Opus Fast",
    provider: "Anthropic",
    inputPer1M: 10.00,
    outputPer1M: 50.00,
    tier: "reasoning",
    contextWindowTokens: 1_000_000,
    tagline: "Opus at Speed",
    emoji: "⚡",
    gradientFrom: "from-orange-700",
    gradientTo: "to-red-500",
    accentColor: "text-red-600",
    contextBarColor: "bg-red-500",
    costColor: "text-red-400",
    why: {},
    whenWrong:
      "For almost all routine tasks — standard Opus 4.8 or Sonnet is enough without Fast-tier pricing.",
    traits: [
      "Low-latency Opus variant",
      "Roughly 2× standard Opus input pricing in Cursor",
    ],
    bestFor: "Rare cases where you need Opus-quality reasoning with minimum latency",
    worstFor: "Default choice — prohibitively expensive for everyday coding",
    latencyBand: "fast",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "Latency is critical and you have budget for premium Opus Fast rates",
    avoidWhen: "Any normal task — use Opus 4.8 standard or a lighter model",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const MODEL_BY_ID: Record<string, ModelSpec> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m])
);

export interface EffectiveModelPricing {
  inputPer1M: number;
  outputPer1M: number;
  isPromotional: boolean;
  label?: string;
  endsAt?: string;
}

function toIsoDate(asOf: Date | string): string {
  if (typeof asOf === "string") return asOf.slice(0, 10);
  return asOf.toISOString().slice(0, 10);
}

/** Resolve the rate in effect on a given date while preserving standard pricing in the registry. */
export function getEffectiveModelPricing(
  model: ModelSpec,
  asOf: Date | string = new Date()
): EffectiveModelPricing {
  const date = toIsoDate(asOf);
  const promotion = model.promotionalPricing;

  if (promotion && date >= promotion.startsAt && date <= promotion.endsAt) {
    return {
      inputPer1M: promotion.inputPer1M,
      outputPer1M: promotion.outputPer1M,
      isPromotional: true,
      label: promotion.label,
      endsAt: promotion.endsAt,
    };
  }

  return {
    inputPer1M: model.inputPer1M,
    outputPer1M: model.outputPer1M,
    isPromotional: false,
  };
}

// ---------------------------------------------------------------------------
// Component-specific selectors
// These return exactly the shape each component expects so component internals
// change minimally and the data contract stays stable.
// ---------------------------------------------------------------------------

/** Models shown in ModelMixer — all models with pricing + tier */
export function getMixerModels(asOf: Date | string = new Date()) {
  return MODEL_REGISTRY.map((m) => {
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
      pricingLabel: pricing.label,
    };
  });
}

// ---------------------------------------------------------------------------
// Pricing metadata — single source of truth for data attribution
// Prices verified against official API pricing pages on 2026-07-01
// ---------------------------------------------------------------------------

export const PRICING_META = {
  verifiedDate: "2026-07-06", // Full registry cross-check against cursor.com/docs/models-and-pricing and provider API pages
  source: "Official API pricing pages",
  notes: [
    "Claude Sonnet 5 is $2/$10 per million input/output tokens through August 31, 2026, then $3/$15.",
  ],
  urls: {
    Anthropic: "https://platform.claude.com/docs/en/about-claude/pricing",
    OpenAI: "https://openai.com/api/pricing",
    Google: "https://ai.google.dev/gemini-api/docs/pricing",
    DeepSeek: "https://api-docs.deepseek.com/quick_start/pricing",
    Cursor: "https://cursor.com/docs/models-and-pricing",
  },
} as const;

/** Models shown in CostCalculator */
export function getCostCalculatorModels(asOf: Date | string = new Date()) {
  // Only include models that are meaningful for cost comparison in the blog
  const ids = [
    "gemini-flash",
    "deepseek-v4-flash",
    "haiku-4.5",
    "sonnet-5",
    "composer-2.5",
    "opus-4.8",
    "gpt-5.5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      perM_in: pricing.inputPer1M,
      perM_out: pricing.outputPer1M,
      color: m.costColor,
      pricingLabel: pricing.label,
    };
  });
}

/** Models shown in ContextWindowViz */
export function getContextWindowModels() {
  const ids = [
    "gpt-5.5",
    "gemini-flash",
    "sonnet-5",
    "composer-2.5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      name: m.name,
      limit: m.contextWindowTokens,
      color: m.contextBarColor,
    };
  });
}

/** Models shown in ModelPicker — personality-focused subset */
export function getPickerModels() {
  const ids = [
    "gemini-flash",
    "sonnet-5",
    "opus-4.8",
    "composer-2.5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      why: m.why,
      whenWrong: m.whenWrong,
    };
  });
}

/** Full model set for ModelPicker 2.0 — includes all models that can surface as recommendations */
export function getPickerModelsV2(asOf: Date | string = new Date()) {
  // All models are candidates; scoring determines which surface in top-3
  return MODEL_REGISTRY.map((m) => {
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
      latencyBand: m.latencyBand,
      initiativeStyle: m.initiativeStyle,
      scopeDiscipline: m.scopeDiscipline,
      why: m.why,
      whenWrong: m.whenWrong,
      pickWhen: m.pickWhen,
      avoidWhen: m.avoidWhen,
      traits: m.traits,
      bestFor: m.bestFor,
      worstFor: m.worstFor,
    };
  });
}

/** Models available in ScenarioLab comparisons */
export function getScenarioLabModels(asOf: Date | string = new Date()) {
  const ids = [
    "gemini-flash",
    "haiku-4.5",
    "deepseek-v4-flash",
    "sonnet-5",
    "composer-2.5",
    "opus-4.8",
    "gpt-5.5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tagline: m.tagline,
      emoji: m.emoji,
      accentColor: m.accentColor,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
      latencyBand: m.latencyBand,
      initiativeStyle: m.initiativeStyle,
      scopeDiscipline: m.scopeDiscipline,
      pickWhen: m.pickWhen,
      avoidWhen: m.avoidWhen,
    };
  });
}

/** Models shown in FailureGallery — susceptibility indicators */
export function getFailureGalleryModels() {
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    name: m.name,
    emoji: m.emoji,
    accentColor: m.accentColor,
    initiativeStyle: m.initiativeStyle,
    scopeDiscipline: m.scopeDiscipline,
    latencyBand: m.latencyBand,
    tier: m.tier,
  }));
}

/** Models shown in ModelTinder — swipe-card subset */
export function getTinderModels() {
  const ids = [
    "gemini-flash",
    "sonnet-5",
    "opus-4.8",
    "composer-2.5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      traits: m.traits,
      bestFor: m.bestFor,
      worstFor: m.worstFor,
    };
  });
}

/** Benchmark check definitions + per-model results */
export interface BenchmarkCheck {
  check: string;
  /** key into ModelSpec.benchmark */
  key: keyof ModelSpec["benchmark"];
}

export const BENCHMARK_CHECKS: BenchmarkCheck[] = [
  { check: "Correct Next.js server action?", key: "correctServerAction" },
  { check: "Followed constraints without detours?", key: "followedConstraints" },
  { check: "Made up docs or citations?", key: "madeUpDocs" },
  { check: "Introduced hidden bugs in refactor?", key: "hiddenBugsInRefactor" },
];

/** Models shown as columns in DevBenchmark */
export function getDevBenchmarkColumns() {
  const ids = ["sonnet-5", "gemini-flash", "haiku-4.5", "composer-2.5"];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      label: m.name.replace("Claude ", "").replace(" 4.7", "").replace(" 4.6", "").replace(" 4.5", ""),
      color: m.accentColor,
      benchmark: m.benchmark,
    };
  });
}
