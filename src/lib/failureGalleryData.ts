// ---------------------------------------------------------------------------
// Failure Gallery data — curated AI coding failure cases.
// Each failure links to model traits from modelSpecs.ts via riskFactors,
// so susceptibility is derived at runtime, not hardcoded.
// ---------------------------------------------------------------------------

export type FailureCategory =
  | "hallucination"
  | "scope-creep"
  | "confident-wrong"
  | "subtle-bug"
  | "stale-pattern";

export type Severity = "critical" | "high" | "medium";

export type SpotDifficulty = "easy" | "medium" | "hard";

export interface RiskFactor {
  /** Which ModelSpec trait to check */
  trait: "initiativeStyle" | "scopeDiscipline" | "latencyBand" | "tier";
  /** Trait values that increase susceptibility to this failure */
  risky: string[];
  /** Why this trait makes the model prone to this failure */
  explanation: string;
}

export interface FailureCase {
  id: string;
  category: FailureCategory;
  title: string;
  severity: Severity;
  /** What the developer asked for */
  scenario: string;
  /** The model's actual (bad) output */
  badOutput: string;
  /** Exact substring within badOutput to highlight after reveal */
  bugHighlight: string;
  /** Plain-English explanation of what's wrong */
  whyWrong: string;
  /** How hard is this to spot before the reveal? */
  spotDifficulty: SpotDifficulty;
  /** Prevention pattern — what to do instead */
  fix: string;
  /** Optional example prompt snippet or guardrail */
  fixExample?: string;
  /** Which model traits make this failure more likely */
  riskFactors: RiskFactor[];
}

export const CATEGORY_META: Record<
  FailureCategory,
  { label: string; description: string }
> = {
  hallucination: {
    label: "Hallucinated APIs",
    description: "Called functions or methods that don't exist in the version you're using.",
  },
  "scope-creep": {
    label: "Scope Creep",
    description: "\"Helpfully\" changed things outside the task boundary.",
  },
  "confident-wrong": {
    label: "Confident & Wrong",
    description: "Explained with authority why something can't happen — it did.",
  },
  "subtle-bug": {
    label: "Subtle Bugs",
    description: "Code that looks correct, passes superficial review, but has a logic error.",
  },
  "stale-pattern": {
    label: "Stale Patterns",
    description: "Used deprecated APIs or patterns from an older version of the framework.",
  },
};

export const SEVERITY_META: Record<
  Severity,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  critical: {
    label: "critical",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/40",
  },
  high: {
    label: "high",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/40",
  },
  medium: {
    label: "medium",
    textClass: "text-zinc-400",
    bgClass: "bg-zinc-800",
    borderClass: "border-zinc-600",
  },
};

export const DIFFICULTY_META: Record<
  SpotDifficulty,
  { label: string; textClass: string }
> = {
  easy: { label: "easy to spot", textClass: "text-emerald-400" },
  medium: { label: "tricky", textClass: "text-amber-400" },
  hard: { label: "sneaky", textClass: "text-red-400" },
};

// ---------------------------------------------------------------------------
// Failure cases
// ---------------------------------------------------------------------------

export const FAILURES: FailureCase[] = [
  // ── Hallucinated APIs ────────────────────────────────────────────────────

  {
    id: "router-prefetch-args",
    category: "hallucination",
    title: "next/router.prefetch() with invented arguments",
    severity: "high",
    scenario:
      "Asked the model to add prefetching to a Next.js navigation component. Specified we're on Next.js 14.",
    badOutput: `import { useRouter } from 'next/router';

function NavLink({ href, children }) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href, { priority: 'high', timeout: 3000 });
  };

  return (
    <a href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  );
}`,
    bugHighlight: "router.prefetch(href, { priority: 'high', timeout: 3000 })",
    whyWrong:
      "router.prefetch() in Next.js 13+ takes only a single argument (the URL). The options object with priority and timeout doesn't exist — the model invented it. The call silently ignores the extra argument, so prefetching still works, but you're shipping dead code that looks authoritative.",
    spotDifficulty: "hard",
    fix: "Pin the docs version in your system prompt. Ask the model to cite the exact API signature before using it.",
    fixExample: `System prompt addition:
"You are working with Next.js 14. Before using any Next.js API, state the exact function signature from the v14 docs. Do not add options that aren't in the signature."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models prioritize fluent output over verification. They pattern-match from training data without checking if the API signature is current.",
      },
    ],
  },

  {
    id: "prisma-findmany-cursor",
    category: "hallucination",
    title: "Prisma cursor pagination with wrong field name",
    severity: "critical",
    scenario:
      "Asked for cursor-based pagination using Prisma. The model had no schema context.",
    badOutput: `async function getNextPage(cursor?: string) {
  const items = await prisma.post.findMany({
    take: 20,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: 'desc' },
    where: { published: true },
  });

  const nextCursor = items.length === 20
    ? items[items.length - 1].id
    : null;

  return { items, nextCursor };
}`,
    bugHighlight: "orderBy: { createdAt: 'desc' }",
    whyWrong:
      "The model assumed a createdAt field exists on the Post model. If the schema uses publishedAt or a different timestamp field, this query throws a Prisma validation error at runtime. The cursor logic itself is correct — the field assumption is the silent killer.",
    spotDifficulty: "hard",
    fix: "Always provide the relevant schema excerpt in the prompt when asking for database queries.",
    fixExample: `Add to prompt:
"Here is the relevant Prisma schema:
model Post {
  id          String   @id @default(cuid())
  title       String
  publishedAt DateTime
  published   Boolean
}"`,
    riskFactors: [
      {
        trait: "initiativeStyle",
        risky: ["minimal", "measured"],
        explanation:
          "Conservative models fill in missing context with plausible assumptions rather than asking. They produce code that looks complete but may be wrong.",
      },
    ],
  },

  {
    id: "react-query-v5-mutation",
    category: "hallucination",
    title: "React Query v5 mutation with v4 API",
    severity: "high",
    scenario:
      "Asked for a mutation hook using React Query. Didn't specify the version.",
    badOutput: `import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation(
    (userData) => updateUserApi(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );
}`,
    bugHighlight: "useMutation(\n    (userData) => updateUserApi(userData),\n    {",
    whyWrong:
      "In React Query v5, useMutation no longer accepts positional arguments. The mutationFn must be passed inside the options object: useMutation({ mutationFn: ... }). The v4 positional API throws a runtime error in v5.",
    spotDifficulty: "medium",
    fix: "Specify the library version in the prompt. For major-version APIs, ask the model to confirm the signature matches the version you're using.",
    fixExample: `Prompt addition:
"We use @tanstack/react-query v5. Use the v5 API — mutationFn must be inside the options object."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models have strong priors toward the most common pattern in training data. React Query v4 was dominant for longer, so v4 patterns surface more readily.",
      },
    ],
  },

  // ── Scope Creep ──────────────────────────────────────────────────────────

  {
    id: "rename-spree",
    category: "scope-creep",
    title: "Renamed variables across the entire file",
    severity: "medium",
    scenario:
      "Asked to add a loading state to a single component function. The component file was 200 lines.",
    badOutput: `// Model added the loading state as requested, then also:
// - Renamed 'data' to 'responseData' throughout the file
// - Renamed 'err' to 'error' throughout the file
// - Converted all var declarations to const
// - Added TypeScript types to 4 unrelated functions
// - Reformatted the JSX to match its preferred style

// The actual requested change was 3 lines.
// The diff was 47 lines across 12 locations.`,
    bugHighlight: "Renamed 'data' to 'responseData' throughout the file",
    whyWrong:
      "The model completed the task but also refactored unrelated code. Each rename is a potential breakage point if there are external references. The diff is now 15x larger than it needs to be, making review harder and the change harder to revert.",
    spotDifficulty: "easy",
    fix: "Explicitly scope the task in the prompt. Name the function or lines you want changed.",
    fixExample: `Add to prompt:
"Only modify the fetchUser function. Do not rename variables, change types, or touch any other function in the file."`,
    riskFactors: [
      {
        trait: "scopeDiscipline",
        risky: ["drifts", "unpredictable"],
        explanation:
          "Models with poor scope discipline treat 'improve while I'm here' as part of the task. They optimize for code quality, not for minimal diffs.",
      },
      {
        trait: "initiativeStyle",
        risky: ["proactive", "autonomous"],
        explanation:
          "Proactive models notice adjacent issues and fix them. This is useful for feature design but harmful for targeted edits.",
      },
    ],
  },

  {
    id: "dependency-added",
    category: "scope-creep",
    title: "Added a new dependency without asking",
    severity: "high",
    scenario:
      "Asked to add date formatting to a component. The codebase already uses date-fns.",
    badOutput: `import { format } from 'dayjs';

// Model used dayjs instead of the existing date-fns,
// adding a new dependency to package.json:
// "dayjs": "^1.11.10"

function formatDate(date: Date) {
  return format(date, 'MMM D, YYYY');
}`,
    bugHighlight: "import { format } from 'dayjs';",
    whyWrong:
      "The codebase already has date-fns installed. The model introduced a second date library, adding bundle weight and inconsistency. It didn't check existing imports or ask about the preferred library.",
    spotDifficulty: "medium",
    fix: "Tell the model which libraries are already in use. Add a guardrail: 'Do not add new dependencies without asking first.'",
    fixExample: `CLAUDE.md / .cursorrules addition:
"Do not add new npm dependencies without explicit confirmation. Check existing imports for the library pattern to use."`,
    riskFactors: [
      {
        trait: "initiativeStyle",
        risky: ["proactive", "autonomous"],
        explanation:
          "Autonomous models make decisions independently. Adding a familiar library feels like a reasonable choice to them — they don't know you're trying to keep the dependency tree clean.",
      },
      {
        trait: "scopeDiscipline",
        risky: ["drifts", "unpredictable"],
        explanation:
          "Models that drift expand the solution space beyond the literal request, including choosing their own tools.",
      },
    ],
  },

  {
    id: "test-file-rewrite",
    category: "scope-creep",
    title: "Rewrote the entire test file while fixing one test",
    severity: "high",
    scenario:
      "Asked to fix a failing test. The test file had 15 tests, one was failing.",
    badOutput: `// Model fixed the failing test, then:
// - Converted all describe() blocks to use arrow functions
// - Replaced all .toBe() with .toEqual() "for consistency"
// - Added beforeEach/afterEach cleanup blocks to every suite
// - Reorganized tests into new describe groupings
// - Added 3 new tests it decided were "missing"

// The original failing test: 1 line change needed.
// The actual diff: 89 lines changed across the entire file.`,
    bugHighlight: "Added 3 new tests it decided were \"missing\"",
    whyWrong:
      "The model added tests that weren't asked for and may not reflect the actual intended behavior. The reorganization makes the git blame history useless. And the 'missing' tests could be wrong — the model doesn't know the business logic.",
    spotDifficulty: "easy",
    fix: "Scope the task to the specific test. 'Fix only the test named X. Do not modify any other test or add new tests.'",
    riskFactors: [
      {
        trait: "scopeDiscipline",
        risky: ["drifts", "unpredictable"],
        explanation:
          "Models that drift interpret 'fix the test' as 'improve the test suite.' They're not wrong that the improvements are improvements — they're wrong about the scope.",
      },
    ],
  },

  // ── Confident & Wrong ────────────────────────────────────────────────────

  {
    id: "race-condition-denial",
    category: "confident-wrong",
    title: "Explained why a race condition \"can't happen\"",
    severity: "critical",
    scenario:
      "Asked whether a race condition was possible in a useEffect that fetched data and set state.",
    badOutput: `The race condition you're worried about can't happen here for two reasons:

1. React's state updates are batched and processed synchronously in the commit phase. By the time the second fetch resolves, React has already committed the first update.

2. The useEffect cleanup function runs before the next effect, so the previous fetch is always cancelled before a new one starts — as long as you have a cleanup function.

Your current implementation is safe.`,
    bugHighlight:
      "React's state updates are batched and processed synchronously in the commit phase. By the time the second fetch resolves, React has already committed the first update.",
    whyWrong:
      "This is confidently wrong. React's batching does not prevent async race conditions — it only batches synchronous state updates. If two fetches fire and the slower one resolves last, it overwrites the faster one's result regardless of batching. The model also assumed a cleanup function exists when the question didn't mention one.",
    spotDifficulty: "hard",
    fix: "When the model says something 'can't happen,' ask it to steelman the failure case. 'Assume this does happen — walk me through how.'",
    fixExample: `Follow-up prompt:
"Assume the race condition does happen. Walk me through the exact sequence of events that would cause it, step by step."`,
    riskFactors: [
      {
        trait: "initiativeStyle",
        risky: ["minimal", "measured"],
        explanation:
          "Conservative models optimize for giving a complete, reassuring answer. They're less likely to hedge or say 'I'm not sure' — which leads to confident wrong answers.",
      },
    ],
  },

  {
    id: "type-safety-false-assurance",
    category: "confident-wrong",
    title: "Declared the code type-safe when it wasn't",
    severity: "high",
    scenario:
      "Asked to review a TypeScript function for type safety issues. The function had a subtle any leak.",
    badOutput: `This function is fully type-safe. Here's why:

- The parameter type is correctly annotated as User
- The return type Promise<void> is explicit
- All property accesses are on known fields

TypeScript will catch any type errors at compile time. You're good to ship this.`,
    bugHighlight: "TypeScript will catch any type errors at compile time. You're good to ship this.",
    whyWrong:
      "The function called a utility that returned any, which infected the result. TypeScript didn't flag it because any is assignable to everything. The model reviewed the annotations but didn't trace the type flow through the utility call — the exact kind of subtle leak that causes runtime errors.",
    spotDifficulty: "hard",
    fix: "Ask the model to trace the type of every external call and imported utility, not just the annotations you wrote.",
    fixExample: `Prompt addition:
"For each function call or import, state its return type. If any return type is 'any' or unknown, flag it explicitly."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models do a surface-level pass. They check what's visible — annotations, explicit types — without tracing the full type flow.",
      },
    ],
  },

  // ── Subtle Bugs ──────────────────────────────────────────────────────────

  {
    id: "off-by-one-pagination",
    category: "subtle-bug",
    title: "Off-by-one in pagination — last item always missing",
    severity: "high",
    scenario:
      "Asked to implement pagination that fetches 10 items per page from an API.",
    badOutput: `async function getPage(page: number) {
  const offset = page * 10;
  const limit = 10;

  const items = await db.item.findMany({
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'asc' },
  });

  const total = await db.item.count();
  const totalPages = Math.floor(total / limit);

  return { items, page, totalPages };
}`,
    bugHighlight: "const totalPages = Math.floor(total / limit);",
    whyWrong:
      "Math.floor(total / limit) rounds down. If there are 21 items and 10 per page, this returns 2 pages — but there are 3. The last item is never shown. Should be Math.ceil(total / limit).",
    spotDifficulty: "medium",
    fix: "Ask the model to walk through boundary cases explicitly: 'What happens when total is exactly divisible by limit? What about total = limit + 1?'",
    fixExample: `Follow-up prompt:
"Walk through these cases: total=10, total=11, total=20, total=21. What does totalPages return for each?"`,
    riskFactors: [
      {
        trait: "initiativeStyle",
        risky: ["minimal"],
        explanation:
          "Minimal-initiative models produce the most common pattern without stress-testing edge cases. Math.floor is the first instinct; Math.ceil requires thinking about the off-by-one.",
      },
    ],
  },

  {
    id: "async-filter",
    category: "subtle-bug",
    title: "Array.filter with an async predicate always returns everything",
    severity: "critical",
    scenario:
      "Asked to filter a list of users to only those with active subscriptions, checking against the database.",
    badOutput: `async function getActiveUsers(userIds: string[]) {
  const activeUsers = userIds.filter(async (id) => {
    const sub = await db.subscription.findFirst({
      where: { userId: id, status: 'active' },
    });
    return sub !== null;
  });

  return activeUsers;
}`,
    bugHighlight: "const activeUsers = userIds.filter(async (id) => {",
    whyWrong:
      "Array.filter is synchronous. When you pass an async callback, it returns a Promise — which is always truthy. Every user passes the filter regardless of their subscription status. The function returns all userIds, not just the active ones.",
    spotDifficulty: "medium",
    fix: "Use Promise.all with map to resolve all async checks, then filter on the resolved results.",
    fixExample: `Correct implementation:
async function getActiveUsers(userIds: string[]) {
  const checks = await Promise.all(
    userIds.map(async (id) => {
      const sub = await db.subscription.findFirst({
        where: { userId: id, status: 'active' },
      });
      return { id, active: sub !== null };
    })
  );
  return checks.filter((c) => c.active).map((c) => c.id);
}`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models pattern-match on 'filter items based on a condition' and reach for .filter(). The async subtlety requires knowing that .filter() ignores Promise return values.",
      },
      {
        trait: "tier",
        risky: ["fast"],
        explanation:
          "Fast-tier models are optimized for throughput, not for catching subtle async semantics that require understanding JavaScript's event loop.",
      },
    ],
  },

  {
    id: "stale-closure",
    category: "subtle-bug",
    title: "Stale closure in event listener — always reads initial value",
    severity: "high",
    scenario:
      "Asked to add a keyboard shortcut that triggers an action using the current component state.",
    badOutput: `function SearchModal({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSearch(query);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps — registered once

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
    bugHighlight: "  }, []); // Empty deps — registered once",
    whyWrong:
      "The event listener captures query from the initial render (empty string). Because the effect has empty deps, it never re-registers — so pressing Enter always calls onSearch('') regardless of what the user typed. The fix is adding query and onSearch to the dependency array.",
    spotDifficulty: "hard",
    fix: "Add all values used inside useEffect to the dependency array. Use the exhaustive-deps ESLint rule to catch this automatically.",
    fixExample: `Fix:
  }, [query, onSearch]);

Or use a ref to avoid re-registering:
  const queryRef = useRef(query);
  useEffect(() => { queryRef.current = query; }, [query]);`,
    riskFactors: [
      {
        trait: "initiativeStyle",
        risky: ["minimal"],
        explanation:
          "Minimal-initiative models produce the simplest working code. Empty dependency arrays are common in examples and avoid the complexity of dependency management.",
      },
    ],
  },

  // ── Stale Patterns ───────────────────────────────────────────────────────

  {
    id: "pages-router-in-app",
    category: "stale-pattern",
    title: "Used Pages Router patterns in an App Router project",
    severity: "critical",
    scenario:
      "Asked to add a dynamic route with data fetching to a Next.js 14 project.",
    badOutput: `// pages/products/[id].tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await fetchProduct(params?.id as string);
  return { props: { product } };
};

export default function ProductPage({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}`,
    bugHighlight: "export const getServerSideProps: GetServerSideProps = async ({ params }) => {",
    whyWrong:
      "This is Pages Router syntax. In Next.js 14 App Router, data fetching happens in async Server Components — no getServerSideProps. The file would also need to be in app/products/[id]/page.tsx, not pages/. This code simply doesn't run in an App Router project.",
    spotDifficulty: "medium",
    fix: "Explicitly state 'App Router' in the prompt. Include your Next.js version and a note that you're not using the Pages Router.",
    fixExample: `Prompt addition:
"This is a Next.js 14 App Router project. Use async Server Components for data fetching. Do not use getServerSideProps, getStaticProps, or any Pages Router patterns."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models have strong priors toward the most common Next.js patterns in their training data. Pages Router patterns were dominant for years and appear more frequently.",
      },
    ],
  },

  {
    id: "class-component",
    category: "stale-pattern",
    title: "Generated a class component in a hooks-only codebase",
    severity: "medium",
    scenario:
      "Asked to create a new component with local state and a lifecycle method equivalent.",
    badOutput: `import React, { Component } from 'react';

interface State {
  count: number;
  loading: boolean;
}

class Counter extends Component<{}, State> {
  state = { count: 0, loading: false };

  componentDidMount() {
    this.loadInitialCount();
  }

  async loadInitialCount() {
    this.setState({ loading: true });
    const count = await fetchCount();
    this.setState({ count, loading: false });
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}`,
    bugHighlight: "class Counter extends Component<{}, State> {",
    whyWrong:
      "Class components work, but they're inconsistent with a modern hooks codebase. The componentDidMount pattern is replaced by useEffect. More importantly, class components can't use hooks — so if this component needs to consume context or other hooks later, it'll need a full rewrite.",
    spotDifficulty: "easy",
    fix: "State your conventions in the system prompt or CLAUDE.md. 'Use functional components and hooks only. Never generate class components.'",
    fixExample: `CLAUDE.md addition:
"Use functional components with hooks. Never use class components or lifecycle methods (componentDidMount, etc.)."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models pattern-match on 'component with state and lifecycle' and may reach for the class pattern, which has more training examples for that exact combination.",
      },
    ],
  },

  {
    id: "legacy-context-api",
    category: "stale-pattern",
    title: "Used legacy Context API with contextTypes",
    severity: "medium",
    scenario:
      "Asked to add theme support to a component using React context.",
    badOutput: `import PropTypes from 'prop-types';

class ThemedButton extends React.Component {
  render() {
    return (
      <button style={{ background: this.context.theme.primary }}>
        {this.props.children}
      </button>
    );
  }
}

ThemedButton.contextTypes = {
  theme: PropTypes.object,
};`,
    bugHighlight: "ThemedButton.contextTypes = {",
    whyWrong:
      "contextTypes is the React 15 legacy context API, removed in React 19. The modern API uses React.createContext() and useContext(). This pattern also requires class components and PropTypes, adding two more outdated dependencies.",
    spotDifficulty: "easy",
    fix: "Specify React version and hooks-only convention. Ask for useContext explicitly.",
    fixExample: `Prompt:
"Add theme support using React.createContext and useContext. We use React 18+, functional components only."`,
    riskFactors: [
      {
        trait: "latencyBand",
        risky: ["fast", "instant"],
        explanation:
          "Fast models have extensive training on older React patterns. Without explicit version context, they may surface the most-seen pattern rather than the current one.",
      },
      {
        trait: "tier",
        risky: ["fast"],
        explanation:
          "Fast-tier models are less likely to reason about API evolution and more likely to reproduce common training patterns.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getFailuresByCategory(category: FailureCategory): FailureCase[] {
  return FAILURES.filter((f) => f.category === category);
}

export const CATEGORY_ORDER: FailureCategory[] = [
  "hallucination",
  "scope-creep",
  "confident-wrong",
  "subtle-bug",
  "stale-pattern",
];
