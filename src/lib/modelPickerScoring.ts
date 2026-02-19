// ---------------------------------------------------------------------------
// Pure scoring logic for ModelPicker — extracted for testability.
// The component imports from here; tests exercise these functions directly.
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

export function score(modelId: string, answers: Answers): number {
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

export interface Recommendation<T> {
  model: T;
  runnerUp: T;
  reason: string;
  confidence: Confidence;
}

export function getRecommendation<
  T extends { id: string; name: string; why: Record<string, string> },
>(models: T[], answers: Answers): Recommendation<T> {
  const scores = models.map((m) => ({
    model: m,
    points: score(m.id, answers),
  }));
  scores.sort((a, b) => b.points - a.points);

  const winner = scores[0].model;
  const runnerUp = scores[1].model;
  const margin = scores[0].points - scores[1].points;
  const confidence: Confidence =
    margin >= 6 ? "strong" : margin >= 3 ? "good" : "close";

  const reasonKey = [
    answers.scope,
    answers.task,
    answers.stakes,
    answers.priority,
    answers.autonomy,
  ].find((key) => key && winner.why[key]);
  const reason = reasonKey
    ? winner.why[reasonKey]
    : `${winner.name} is the right fit for this combination of task type, stakes, and scope.`;

  return { model: winner, runnerUp, reason, confidence };
}
