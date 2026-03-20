// ---------------------------------------------------------------------------
// Pure scoring logic for ModelPicker 2.0 — extracted for testability.
// Returns a top-3 ranked list with per-dimension breakdowns and caution states.
// ---------------------------------------------------------------------------

export interface Question {
  id: string;
  text: string;
  options: { id: string; label: string; description?: string }[];
}

export type Answers = Record<string, string>;
export type Confidence = "strong" | "good" | "close";

export const QUESTIONS: Question[] = [
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

// ---------------------------------------------------------------------------
// Dimension-level scoring — each dimension returns a named score so we can
// show breakdowns in the UI.
// ---------------------------------------------------------------------------

export interface DimensionScore {
  dimension: string;
  points: number;
  reason: string;
}

export interface ModelScore {
  modelId: string;
  total: number;
  dimensions: DimensionScore[];
}

export function scoreDimensions(modelId: string, answers: Answers): ModelScore {
  const dims: DimensionScore[] = [];

  const task = answers.task;
  const scope = answers.scope;
  const stakes = answers.stakes;
  const priority = answers.priority;
  const autonomy = answers.autonomy;

  function dim(dimension: string, points: number, reason: string) {
    if (points !== 0) dims.push({ dimension, points, reason });
  }

  if (modelId === "gemini-flash") {
    dim("task", task === "coding" ? 2 : task === "reasoning" ? 1 : task === "vision" ? 3 : 0,
      task === "vision" ? "Literal-minded — describes what's there, not what it thinks should be there"
      : task === "coding" ? "Executes exactly what you ask, no scope creep"
      : "");
    dim("scope", scope === "targeted" ? 3 : 0,
      "Precise with targeted edits — won't wander outside the scope you defined");
    dim("stakes", stakes === "production" ? 3 : stakes === "prototype" ? -1 : 0,
      stakes === "production" ? "Risk-averse defaults shine in production contexts" : "");
    dim("priority", priority === "accuracy" ? 3 : priority === "speed" ? -1 : 0,
      priority === "accuracy" ? "Does exactly what you said and nothing more" : "");
    dim("autonomy", autonomy === "targeted" ? 3 : autonomy === "drive" ? -3 : 0,
      autonomy === "targeted" ? "Won't wander — edits exactly what you point at"
      : autonomy === "drive" ? "Not built for autonomous tasks — needs explicit direction" : "");
  }

  if (modelId === "haiku-4.5") {
    dim("task", task === "coding" ? 2 : 0,
      "Retains Claude's instruction-following quality at high speed");
    dim("scope", scope === "targeted" ? 3 : scope === "autonomous" ? -2 : 0,
      scope === "targeted" ? "Fastest for quick structured tasks" : "");
    dim("stakes", stakes === "prototype" ? 2 : stakes === "internal" ? 2 : stakes === "critical" ? -2 : 0,
      "Cost-effective for high-volume pipelines");
    dim("priority", priority === "speed" ? 4 : priority === "balance" ? 1 : priority === "accuracy" ? -1 : 0,
      priority === "speed" ? "Fastest Anthropic model — latency compounds at scale" : "");
    dim("autonomy", autonomy === "targeted" ? 3 : autonomy === "drive" ? -3 : 0,
      autonomy === "targeted" ? "Best for quick structured tasks in a loop" : "");
  }

  if (modelId === "deepseek-v3") {
    dim("task", task === "coding" ? 2 : task === "reasoning" ? 2 : 0,
      "Strong reasoning at low cost — open-source weights");
    dim("scope", scope === "targeted" ? 1 : scope === "multifile" ? 1 : 0, "");
    dim("stakes", stakes === "prototype" ? 2 : stakes === "internal" ? 2 : stakes === "critical" ? -2 : 0,
      "Best for cost-sensitive pipelines where open weights matter");
    dim("priority", priority === "speed" ? 1 : priority === "balance" ? 2 : 0,
      "Good cost-to-capability ratio for well-defined tasks");
    dim("autonomy", autonomy === "gaps" ? 1 : 0, "");
  }

  if (modelId === "sonnet-4.6") {
    dim("task", task === "coding" ? 2 : task === "reasoning" ? 2 : task === "writing" ? 3 : task === "analysis" ? 3 : 0,
      task === "writing" ? "Clearest, most useful explanations of any model"
      : task === "analysis" ? "Notices connections and implications that weren't in your original question"
      : task === "coding" ? "Genuine thought partner — suggests better APIs, spots issues in your data model"
      : "");
    dim("scope", scope === "multifile" ? 3 : scope === "architecture" ? 3 : 0,
      scope === "multifile" ? "Understands how changes ripple across a codebase"
      : scope === "architecture" ? "Thinks beyond the immediate task — strong for architecture exploration" : "");
    dim("stakes", stakes === "production" ? 2 : stakes === "internal" ? 2 : 0,
      "Reliable for production work when you set explicit constraints");
    dim("priority", priority === "balance" ? 2 : priority === "accuracy" ? 2 : 0,
      "Strong across the middle — good enough and fast enough");
    dim("autonomy", autonomy === "gaps" ? 3 : autonomy === "drive" ? 1 : 0,
      autonomy === "gaps" ? "Fills in reasonable gaps and notices things you didn't ask about" : "");
  }

  if (modelId === "opus-4.6") {
    dim("task", task === "coding" ? 3 : task === "reasoning" ? 4 : task === "analysis" ? 3 : task === "writing" ? 2 : 0,
      task === "reasoning" ? "Doesn't pattern-match — actually reasons through the problem"
      : task === "coding" ? "Traces actual logic, catches bugs three levels of indirection deep"
      : task === "analysis" ? "Thorough analysis — considers more options and explores more edge cases" : "");
    dim("scope", scope === "architecture" ? 4 : scope === "multifile" ? 2 : scope === "autonomous" ? 1 : 0,
      scope === "architecture" ? "Thinks in systems and abstractions — identifies problems two features from now" : "");
    dim("stakes", stakes === "critical" ? 5 : stakes === "production" ? 2 : stakes === "prototype" ? -2 : 0,
      stakes === "critical" ? "For critical systems where a subtle bug has real consequences, this depth is worth the cost" : "");
    dim("priority", priority === "accuracy" ? 4 : priority === "speed" ? -3 : 0,
      priority === "accuracy" ? "Thoroughness means it considers more options and explores more edge cases" : "");
    dim("autonomy", autonomy === "gaps" ? 2 : autonomy === "drive" ? 2 : 0,
      "Proactive with high-signal observations");
  }

  if (modelId === "gpt-5.4") {
    dim("task", task === "coding" ? 3 : task === "reasoning" ? 3 : task === "analysis" ? 2 : task === "vision" ? 2 : 0,
      task === "reasoning" ? "Reasoning effort levels (low → xhigh) let you dial in exactly how much thinking the model does"
      : task === "coding" ? "Token-efficient reasoning — uses fewer tokens than earlier models to reach the same answer on hard problems"
      : "");
    dim("scope", scope === "autonomous" ? 4 : scope === "multifile" ? 3 : scope === "architecture" ? 3 : 0,
      scope === "autonomous" ? "Native computer-use and tool search built in — strongest OpenAI model for agentic workflows"
      : scope === "architecture" ? "1M token context window holds an entire large codebase while reasoning about architectural decisions"
      : scope === "multifile" ? "1M context + strong tool use — can coordinate changes across a large codebase in a single pass" : "");
    dim("stakes", stakes === "production" ? 2 : stakes === "critical" ? 3 : stakes === "prototype" ? -1 : 0,
      stakes === "critical" ? "Frontier reasoning catches subtle bugs and edge cases — worth the cost when correctness matters" : "");
    dim("priority", priority === "accuracy" ? 3 : priority === "balance" ? 2 : priority === "speed" ? -1 : 0,
      priority === "accuracy" ? "Set reasoning effort to high or xhigh for maximum accuracy on hard problems" : "");
    dim("autonomy", autonomy === "drive" ? 3 : autonomy === "gaps" ? 2 : 0,
      autonomy === "drive" ? "Built-in computer-use and tool search make it the strongest OpenAI model for end-to-end agentic tasks" : "");
  }

  if (modelId === "composer-2") {
    dim("task", task === "coding" ? 3 : 0,
      "Cursor's agentic model — frontier coding quality with tool use and terminal workflows");
    dim("scope", scope === "autonomous" ? 5 : scope === "targeted" ? 4 : scope === "multifile" ? 3 : 0,
      scope === "autonomous" ? "Runs terminal commands, reads output, loops until done — closest thing to a developer who can execute end-to-end"
      : scope === "targeted" ? "Still handles focused edits well when you keep the scope explicit"
      : scope === "multifile" ? "Navigates the project, finds relevant files, makes coordinated changes" : "");
    dim("stakes", stakes === "production" ? 2 : stakes === "prototype" ? 2 : stakes === "internal" ? 2 : stakes === "critical" ? -3 : 0,
      stakes === "critical" ? "Autonomy has a cost — can go down wrong paths before you notice"
      : stakes === "production" ? "Can self-verify with compiler and test runs before you merge" : "");
    dim("priority", priority === "speed" ? 3 : priority === "accuracy" ? -1 : 0,
      "Fast on easy tasks, thorough on hard ones");
    dim("autonomy", autonomy === "drive" ? 5 : autonomy === "targeted" ? 4 : autonomy === "gaps" ? 2 : 0,
      autonomy === "drive" ? "Self-corrects — sees the TypeScript error, understands it, fixes it without copy-pasting back"
      : autonomy === "targeted" ? "Can stay on a pointed task when you give it explicit guardrails" : "");
  }

  // ── Interaction effects ──────────────────────────────────────────────────
  if (scope === "autonomous" && autonomy === "drive") {
    if (modelId === "composer-2") dims.push({ dimension: "interaction", points: -2, reason: "Dampen double-counting: autonomous scope + drive autonomy overlap" });
  }
  if (stakes === "critical" && scope === "autonomous") {
    if (modelId === "opus-4.6") dims.push({ dimension: "interaction", points: 2, reason: "Critical stakes + autonomous scope: frontier reasoning earns its cost" });
  }
  if (stakes === "critical" && priority === "accuracy") {
    if (modelId === "opus-4.6") dims.push({ dimension: "interaction", points: 2, reason: "Critical + accuracy: strongest quality signal — Opus is the right choice" });
    if (modelId === "composer-2") dims.push({ dimension: "interaction", points: -1, reason: "Critical + accuracy: autonomy risk outweighs speed benefit" });
  }

  const total = dims.reduce((s, d) => s + d.points, 0);
  return { modelId, total, dimensions: dims };
}

/** Backward-compatible single score function used by existing tests */
export function score(modelId: string, answers: Answers): number {
  return scoreDimensions(modelId, answers).total;
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

export interface RankedModel<T> {
  model: T;
  total: number;
  dimensions: DimensionScore[];
  /** Positive dimensions only, sorted by impact */
  topReasons: DimensionScore[];
  /** Negative dimensions only, sorted by impact */
  cautions: DimensionScore[];
  /** Primary reason text derived from model.why or dimension reason */
  reason: string;
  rank: 1 | 2 | 3;
}

export interface Ranking<T> {
  top3: RankedModel<T>[];
  /** Overall confidence based on gap between #1 and #2 */
  confidence: Confidence;
  /** True when the winning combination has known risk patterns */
  hasCaution: boolean;
  /** Caution message when hasCaution is true */
  cautionMessage?: string;
}

export function getRanking<
  T extends { id: string; name: string; why: Record<string, string> },
>(models: T[], answers: Answers): Ranking<T> {
  const scored = models
    .map((m) => ({ model: m, ...scoreDimensions(m.id, answers) }))
    .sort((a, b) => b.total - a.total);

  const top3 = scored.slice(0, 3).map((s, i) => {
    const positiveDims = s.dimensions.filter((d) => d.points > 0).sort((a, b) => b.points - a.points);
    const negativeDims = s.dimensions.filter((d) => d.points < 0).sort((a, b) => a.points - b.points);

    // Build reason: prefer model.why key match, fall back to top dimension reason
    const reasonKey = [answers.scope, answers.task, answers.stakes, answers.priority, answers.autonomy]
      .find((key) => key && s.model.why[key]);
    const reason = reasonKey
      ? s.model.why[reasonKey]
      : positiveDims[0]?.reason || `${s.model.name} is the right fit for this combination.`;

    return {
      model: s.model,
      total: s.total,
      dimensions: s.dimensions,
      topReasons: positiveDims.slice(0, 3),
      cautions: negativeDims,
      reason,
      rank: (i + 1) as 1 | 2 | 3,
    };
  });

  const margin = top3.length >= 2 ? top3[0].total - top3[1].total : 10;
  const confidence: Confidence = margin >= 6 ? "strong" : margin >= 3 ? "good" : "close";

  // Caution patterns
  let hasCaution = false;
  let cautionMessage: string | undefined;

  const winner = top3[0];
  if (winner) {
    if (answers.stakes === "critical" && winner.model.id === "composer-2") {
      hasCaution = true;
      cautionMessage =
        "Composer 2 can go deep down wrong paths before you notice. For critical systems, add explicit checkpoints and review every diff before merging.";
    }
    if (answers.stakes === "critical" && winner.model.id === "sonnet-4.6") {
      hasCaution = true;
      cautionMessage =
        "Sonnet's scope drift is risky in critical systems. Set explicit constraints: 'do not modify files outside X' and review the full diff carefully.";
    }
    if (confidence === "close") {
      hasCaution = true;
      cautionMessage =
        cautionMessage ||
        "This is a close call — the top models score similarly. Read the tradeoffs for #1 and #2 before deciding.";
    }
  }

  return { top3, confidence, hasCaution, cautionMessage };
}

// ---------------------------------------------------------------------------
// Legacy compat — used by existing tests and old ModelPicker component
// ---------------------------------------------------------------------------

export interface Recommendation<T> {
  model: T;
  runnerUp: T;
  reason: string;
  confidence: Confidence;
}

export function getRecommendation<
  T extends { id: string; name: string; why: Record<string, string> },
>(models: T[], answers: Answers): Recommendation<T> {
  const ranking = getRanking(models, answers);
  const [first, second] = ranking.top3;
  return {
    model: first.model,
    runnerUp: second.model,
    reason: first.reason,
    confidence: ranking.confidence,
  };
}
