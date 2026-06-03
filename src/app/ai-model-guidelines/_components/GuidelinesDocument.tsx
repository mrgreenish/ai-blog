import {
  AT_A_GLANCE_COLUMNS,
  AT_A_GLANCE_FOOTNOTES,
  AT_A_GLANCE_ROWS,
  COST_EXAMPLES,
  CREATIVITY_SCALE,
  GUIDELINES_INTRO,
  GUIDELINES_METADATA,
  MODEL_PICK_QUESTIONS,
  PLAN_MODE_EXAMPLE,
  PRICING_DISCLAIMER,
  PROMPT_CHECKLIST,
  REASONING_EFFORT,
  REASONING_EFFORT_CAPTION,
  REASONING_RULE_OF_THUMB,
  RECOMMENDED_PICKS,
  type CostExample,
} from "../guidelinesContent";
import {
  formatAboutCost,
  formatModelNames,
  formatPriceForModel,
  formatPricingVerifiedDate,
  getModelDisplayName,
  GUIDELINES_PRICING_MODEL_IDS,
} from "../guidelinesModels";
import { resolveAtAGlanceCell } from "../guidelinesUtils";
import { ReasoningEffortFigure } from "./ReasoningEffortFigure";
import { calcGuidelinesCost } from "../guidelinesModels";
import { formatCost } from "@/lib/scenarioLabData";
import type { CSSProperties } from "react";

export type GuidelinesVariant = "blog" | "sharepoint";

const SP: Record<string, CSSProperties> = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    margin: "16px 0",
  },
  th: {
    border: "1px solid #dfe1e6",
    padding: "10px 12px",
    textAlign: "left",
    background: "#f4f5f7",
    fontWeight: 600,
  },
  td: {
    border: "1px solid #dfe1e6",
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "top",
  },
  tdLabel: {
    border: "1px solid #dfe1e6",
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "top",
    background: "#f4f5f7",
    fontWeight: 600,
  },
  h1: {
    fontSize: 28,
    fontWeight: 600,
    margin: "0 0 16px",
    lineHeight: 1.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: 600,
    margin: "32px 0 12px",
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: 600,
    margin: "24px 0 8px",
    lineHeight: 1.3,
  },
  p: { margin: "0 0 12px", lineHeight: 1.6 },
  metaTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    margin: "0 0 24px",
  },
  draft: {
    display: "inline-block",
    background: "#fff0b3",
    padding: "2px 8px",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 600,
  },
  card: {
    border: "1px solid #dfe1e6",
    borderRadius: 8,
    padding: 16,
    margin: "0 0 12px",
  },
  footnote: { fontSize: 13, color: "#44546f", margin: "8px 0 0" },
};

function CardList({
  variant,
  items,
}: {
  variant: GuidelinesVariant;
  items: Array<{ title: string; description: string; level?: string }>;
}) {
  if (variant === "sharepoint") {
    return (
      <div>
        {items.map((item) => (
          <div key={`${item.level ?? ""}${item.title}`} style={SP.card}>
            <p style={{ margin: "0 0 4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b778c" }}>
              {item.level ?? item.title}
            </p>
            {item.level && (
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: "16px" }}>{item.title}</p>
            )}
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="not-prose my-8 grid gap-4">
      {items.map((item) => (
        <div
          key={`${item.level ?? ""}${item.title}`}
          className="rounded-lg border border-border-default bg-bg-surface p-5"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder">
            {item.level ?? item.title}
          </p>
          {item.level && (
            <h3 className="mt-2 font-sans text-lg font-semibold tracking-tight text-fg-primary">
              {item.title}
            </h3>
          )}
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function CostExampleSection({
  variant,
  example,
}: {
  variant: GuidelinesVariant;
  example: CostExample;
}) {
  const costItems = example.modelCosts.map((row) => ({
    label: getModelDisplayName(row.modelId),
    cost: formatAboutCost(row.modelId, row.inputTokens, row.outputTokens),
  }));

  const list =
    variant === "sharepoint" ? (
      <ul style={{ margin: "0 0 12px", paddingLeft: "24px" }}>
        {costItems.map((item) => (
          <li key={item.label} style={{ marginBottom: "4px" }}>
            {item.label}: {item.cost}
          </li>
        ))}
      </ul>
    ) : (
      <ul>
        {costItems.map((item) => (
          <li key={item.label}>
            {item.label}: {item.cost}
          </li>
        ))}
      </ul>
    );

  const extra =
    example.id === "complex" && example.extraCosts ? (
      <>
        {variant === "sharepoint" ? (
          <p style={SP.p}>
            <strong>Cheaper but riskier implementation option:</strong>
          </p>
        ) : (
          <p>
            <strong>Cheaper but riskier implementation option:</strong>
          </p>
        )}
        <ul style={variant === "sharepoint" ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
          <li>
            {getModelDisplayName("gemini-flash")} implementation:{" "}
            {formatAboutCost("gemini-flash", 120_000, 20_000)}
          </li>
          <li>
            Total with {getModelDisplayName("opus-4.8")} planning:{" "}
            about{" "}
            {formatCost(
              calcGuidelinesCost("opus-4.8", 300_000, 20_000) +
                calcGuidelinesCost("gemini-flash", 120_000, 20_000)
            )}
          </li>
        </ul>
        {variant === "sharepoint" ? (
          <p style={SP.p}>
            <strong>Expensive version:</strong>
          </p>
        ) : (
          <p>
            <strong>Expensive version:</strong>
          </p>
        )}
        <ul style={variant === "sharepoint" ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
          <li>
            Doing the whole task with {getModelDisplayName("opus-4.8")} in Max Mode:{" "}
            {formatAboutCost("opus-4.8", 420_000, 40_000)} or more
          </li>
        </ul>
      </>
    ) : null;

  const total =
    example.totalLine && example.id === "complex" ? (
      <ul style={variant === "sharepoint" ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
        <li>
          {getModelDisplayName("opus-4.8")} planning:{" "}
          {formatAboutCost("opus-4.8", 300_000, 20_000)}
        </li>
        <li>
          {getModelDisplayName("composer-2.5")} implementation:{" "}
          {formatAboutCost("composer-2.5", 120_000, 20_000)}
        </li>
        <li>
          Total: about{" "}
          {formatCost(
            calcGuidelinesCost("opus-4.8", 300_000, 20_000) +
              calcGuidelinesCost("composer-2.5", 120_000, 20_000)
          )}
        </li>
      </ul>
    ) : null;

  const Heading = variant === "sharepoint" ? "h3" : "h3";
  const headingProps =
    variant === "sharepoint"
      ? { style: SP.h3 }
      : { className: undefined };

  return (
    <>
      <Heading {...headingProps}>{example.title}</Heading>
      {variant === "sharepoint" ? (
        <p style={SP.p}>
          <strong>Task:</strong> {example.task}
        </p>
      ) : (
        <p>Task: {example.task}</p>
      )}
      {example.usage?.map((u) =>
        variant === "sharepoint" ? (
          <p key={u.label} style={SP.p}>
            {u.label}: {u.inputTokens.toLocaleString()} input tokens,{" "}
            {u.outputTokens.toLocaleString()} output tokens.
          </p>
        ) : (
          <p key={u.label}>
            {u.label}: {u.inputTokens.toLocaleString()} input tokens,{" "}
            {u.outputTokens.toLocaleString()} output tokens.
          </p>
        )
      )}
      {example.approach && (
        <>
          {variant === "sharepoint" ? (
            <p style={SP.p}>
              <strong>Better approach:</strong>
            </p>
          ) : (
            <p>Better approach:</p>
          )}
          <ul style={variant === "sharepoint" ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
            {example.approach.map((step) => (
              <li key={step.label}>
                {step.label}{" "}
                {step.modelIds ? formatModelNames(step.modelIds) : ""}
                {step.text ? ` ${step.text}` : "."}
              </li>
            ))}
          </ul>
        </>
      )}
      {variant === "sharepoint" ? (
        <p style={SP.p}>
          <strong>Approximate cost:</strong>
        </p>
      ) : (
        <p>Approximate cost:</p>
      )}
      {example.id === "complex" ? total : list}
      {extra}
      {variant === "sharepoint" ? (
        <p style={SP.p}>
          <strong>Advice:</strong> {example.advice}
        </p>
      ) : (
        <p>Advice: {example.advice}</p>
      )}
      {example.paragraphs?.map((para) =>
        variant === "sharepoint" ? (
          <p key={para.slice(0, 24)} style={SP.p}>
            {para}
          </p>
        ) : (
          <p key={para.slice(0, 24)}>{para}</p>
        )
      )}
    </>
  );
}

export function GuidelinesDocument({ variant }: { variant: GuidelinesVariant }) {
  const isSp = variant === "sharepoint";

  const metadataTable = (
    <table style={isSp ? SP.metaTable : undefined} className={!isSp ? "not-prose my-6 w-full border-collapse text-sm" : undefined}>
      <tbody>
        <tr>
          <th style={isSp ? { ...SP.tdLabel, width: 120 } : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-2 text-left font-medium" : undefined}>Owners</th>
          <td style={isSp ? SP.td : undefined} className={!isSp ? "border border-border-default px-4 py-2" : undefined}>{GUIDELINES_METADATA.owners}</td>
        </tr>
        <tr>
          <th style={isSp ? SP.tdLabel : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-2 text-left font-medium" : undefined}>Refer to</th>
          <td style={isSp ? SP.td : undefined} className={!isSp ? "border border-border-default px-4 py-2" : undefined}>{GUIDELINES_METADATA.referTo}</td>
        </tr>
        <tr>
          <th style={isSp ? SP.tdLabel : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-2 text-left font-medium" : undefined}>Description</th>
          <td style={isSp ? SP.td : undefined} className={!isSp ? "border border-border-default px-4 py-2" : undefined}>{GUIDELINES_METADATA.description}</td>
        </tr>
        <tr>
          <th style={isSp ? SP.tdLabel : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-2 text-left font-medium" : undefined}>Status</th>
          <td style={isSp ? SP.td : undefined} className={!isSp ? "border border-border-default px-4 py-2" : undefined}>
            <span style={isSp ? SP.draft : undefined} className={!isSp ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900" : undefined}>
              {GUIDELINES_METADATA.status}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  const atAGlanceTable = (
    <div className={!isSp ? "not-prose my-8 overflow-x-auto" : undefined}>
      <table style={isSp ? SP.table : undefined} className={!isSp ? "w-full min-w-[720px] border-collapse text-left text-sm" : undefined}>
        <thead>
          <tr>
            <th style={isSp ? SP.th : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-3 font-medium" : undefined} />
            {AT_A_GLANCE_COLUMNS.map((col) => (
              <th key={col.id} style={isSp ? SP.th : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-3 font-medium" : undefined}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AT_A_GLANCE_ROWS.map((row) => (
            <tr key={row.label}>
              <th style={isSp ? SP.tdLabel : undefined} className={!isSp ? "border border-border-default bg-bg-surface px-4 py-3 font-medium align-top" : undefined}>
                {row.label}
              </th>
              {AT_A_GLANCE_COLUMNS.map((col) => (
                <td key={col.id} style={isSp ? SP.td : undefined} className={!isSp ? "border border-border-default px-4 py-3 align-top text-fg-muted" : undefined}>
                  {resolveAtAGlanceCell(row.cells[col.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pricingTable = (
    <div className={!isSp ? "not-prose my-8 overflow-hidden rounded-lg border border-border-default" : undefined}>
      <table style={isSp ? SP.table : undefined} className={!isSp ? "w-full border-collapse text-left text-sm" : undefined}>
        <thead>
          <tr>
            <th style={isSp ? SP.th : undefined} className={!isSp ? "border-b border-border-default bg-bg-surface px-4 py-3 font-mono text-xs uppercase tracking-widest text-fg-muted" : undefined}>Model</th>
            <th style={isSp ? SP.th : undefined} className={!isSp ? "border-b border-border-default bg-bg-surface px-4 py-3 font-mono text-xs uppercase tracking-widest text-fg-muted" : undefined}>Price per 1M tokens</th>
          </tr>
        </thead>
        <tbody>
          {GUIDELINES_PRICING_MODEL_IDS.map((id) => (
            <tr key={id}>
              <td style={isSp ? SP.td : undefined} className={!isSp ? "border-b border-border-subtle px-4 py-3 font-medium text-fg-primary last:border-0" : undefined}>
                {getModelDisplayName(id)}
              </td>
              <td style={isSp ? SP.td : undefined} className={!isSp ? "border-b border-border-subtle px-4 py-3 text-fg-muted last:border-0" : undefined}>
                {formatPriceForModel(id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const body = (
    <>
      {metadataTable}

      {isSp ? (
        <h1 style={SP.h1}>{GUIDELINES_INTRO.title}</h1>
      ) : null}

      <p className={!isSp ? undefined : undefined} style={isSp ? SP.p : undefined}>
        {GUIDELINES_INTRO.shortVersion}
      </p>
      <p style={isSp ? SP.p : undefined}>{GUIDELINES_INTRO.balance}</p>

      {isSp ? (
        <h2 style={SP.h2}>Model Picker — At a Glance</h2>
      ) : (
        <h2>Model Picker — At a Glance</h2>
      )}
      {atAGlanceTable}
      {AT_A_GLANCE_FOOTNOTES.map((fn) => (
        <p key={fn.marker} style={isSp ? SP.footnote : undefined} className={!isSp ? "text-sm text-fg-muted" : undefined}>
          <sup>{fn.marker}</sup> <strong>{fn.label}:</strong> {fn.text}
        </p>
      ))}

      {isSp ? <h2 style={SP.h2}>Model Pick</h2> : <h2>Model Pick</h2>}
      <p style={isSp ? SP.p : undefined}>Think about two things first:</p>
      <ol style={isSp ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
        {MODEL_PICK_QUESTIONS.map((q) => (
          <li key={q.label} style={isSp ? { marginBottom: "4px" } : undefined}>
            <strong>{q.label}:</strong> {q.text}
          </li>
        ))}
      </ol>

      {isSp ? <h2 style={SP.h2}>Recommended picks</h2> : <p>Recommended picks:</p>}
      <div className={!isSp ? "not-prose my-8 grid gap-4" : undefined}>
        {RECOMMENDED_PICKS.map((rec) => (
          <div
            key={rec.title}
            style={isSp ? SP.card : undefined}
            className={!isSp ? "rounded-lg border border-border-default bg-bg-surface p-5" : undefined}
          >
            <p style={isSp ? { margin: "0 0 8px", fontWeight: 600 } : undefined} className={!isSp ? "font-sans text-lg font-semibold text-fg-primary" : undefined}>
              {rec.title}
            </p>
            <p style={isSp ? { margin: 0, fontSize: "14px", lineHeight: 1.6 } : undefined} className={!isSp ? "text-sm text-fg-muted" : undefined}>
              Use {formatModelNames(rec.modelIds)}.
              {rec.note ? ` ${rec.note}` : ""}
            </p>
          </div>
        ))}
      </div>

      {isSp ? <h2 style={SP.h2}>A practical creativity scale</h2> : <p>A practical creativity scale:</p>}
      <CardList variant={variant} items={CREATIVITY_SCALE} />

      {isSp ? <h2 style={SP.h2}>Reasoning Effort</h2> : <h2>Reasoning Effort</h2>}
      <p style={isSp ? SP.p : undefined}>
        Reasoning effort is how hard the model should think before answering.
      </p>
      {isSp ? (
        <figure style={{ margin: "16px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cursor-reasoning-effort.png"
            alt="Cursor model menu showing reasoning effort options"
            width={631}
            height={481}
            style={{ maxWidth: "100%", height: "auto", border: "1px solid #dfe1e6", borderRadius: "8px" }}
          />
          <figcaption style={{ fontSize: "13px", color: "#44546f", marginTop: "8px" }}>
            {REASONING_EFFORT_CAPTION}
          </figcaption>
        </figure>
      ) : (
        <ReasoningEffortFigure />
      )}
      <CardList variant={variant} items={REASONING_EFFORT} />
      <p style={isSp ? SP.p : undefined}>{REASONING_RULE_OF_THUMB}</p>

      {isSp ? <h2 style={SP.h2}>Productivity, Performance, and Cost Tips</h2> : <h2>Productivity, Performance, and Cost Tips</h2>}

      {isSp ? <h3 style={SP.h3}>Use Plan Mode</h3> : <h3>Use Plan Mode</h3>}
      <p style={isSp ? SP.p : undefined}>
        For complex tasks, start in Plan Mode with a stronger model. Let the model understand the problem, inspect the codebase, and decide the approach.
      </p>
      <p style={isSp ? SP.p : undefined}>
        Then switch to a lighter model for implementation if the plan is clear.
      </p>
      <p style={isSp ? SP.p : undefined}>Example:</p>
      {isSp ? (
        <blockquote style={{ margin: "0 0 12px", paddingLeft: "16px", borderLeft: "4px solid #dfe1e6" }}>
          <p style={{ margin: 0 }}>{PLAN_MODE_EXAMPLE.quote}</p>
        </blockquote>
      ) : (
        <blockquote>
          <p>{PLAN_MODE_EXAMPLE.quote}</p>
        </blockquote>
      )}
      <p style={isSp ? SP.p : undefined}>Good approach:</p>
      <ul style={isSp ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
        <li>Plan with {formatModelNames(PLAN_MODE_EXAMPLE.planModelIds)}.</li>
        <li>Use medium or high reasoning depending on complexity.</li>
        <li>Implement with {formatModelNames(PLAN_MODE_EXAMPLE.implementModelIds)} if the work is straightforward.</li>
      </ul>
      <p style={isSp ? SP.p : undefined}>
        This often gives better results than immediately throwing a cheap model at a vague task.
      </p>

      {isSp ? <h3 style={SP.h3}>Max Mode</h3> : <h3>Max Mode</h3>}
      <p style={isSp ? SP.p : undefined}>Use Max Mode with caution.</p>
      <p style={isSp ? SP.p : undefined}>
        Do not be afraid of it. It is useful when the model needs a lot of context: large codebases, many files, long chats, big refactors, or deep debugging.
      </p>
      <p style={isSp ? SP.p : undefined}>
        But do not use Max Mode for small tasks. It can cost much more because the model reads and reasons over more tokens.
      </p>
      <p style={isSp ? SP.p : undefined}>
        Doing everything with {getModelDisplayName("opus-4.8")} in Max Mode can get really expensive very quickly. Do not do this by default. Use it only when the task truly benefits from deep context and stronger reasoning.
      </p>

      {isSp ? <h3 style={SP.h3}>Fast Mode</h3> : <h3>Fast Mode</h3>}
      <p style={isSp ? SP.p : undefined}>Avoid Fast mode by default.</p>
      <p style={isSp ? SP.p : undefined}>
        It is convenient, but often more expensive. If the task is not urgent, standard mode is usually the better tradeoff. You can do other work while it runs.
      </p>

      {isSp ? <h3 style={SP.h3}>Skills and Rules</h3> : <h3>Skills and Rules</h3>}
      <p style={isSp ? SP.p : undefined}>
        Use skills and rules so the AI does not need to rediscover your whole workflow every time.
      </p>
      <p style={isSp ? SP.p : undefined}>Good rules can tell the model:</p>
      <ul style={isSp ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
        <li>how your project is structured</li>
        <li>which patterns to follow</li>
        <li>which files are important</li>
        <li>how to test changes</li>
        <li>what not to touch</li>
      </ul>
      <p style={isSp ? SP.p : undefined}>
        Also give context in the prompt. The better the context, the less the model has to guess.
      </p>

      {isSp ? <h3 style={SP.h3}>Prompts</h3> : <h3>Prompts</h3>}
      <p style={isSp ? SP.p : undefined}>English prompts usually work a bit better than Dutch.</p>
      <p style={isSp ? SP.p : undefined}>For simple tasks, be direct.</p>
      <p style={isSp ? SP.p : undefined}>For complex tasks, explain:</p>
      <ul style={isSp ? { margin: "0 0 12px", paddingLeft: "24px" } : undefined}>
        {PROMPT_CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={isSp ? SP.p : undefined}>
        That last point helps a lot. It prevents the model from guessing when the task has missing context.
      </p>

      {isSp ? <h2 style={SP.h2}>Example Pricing</h2> : <h2>Example Pricing</h2>}
      <p style={isSp ? SP.p : undefined}>
        Approximate Cursor model prices, per 1M tokens, as of {formatPricingVerifiedDate()}:
      </p>
      {pricingTable}
      <p style={isSp ? SP.p : undefined}>{PRICING_DISCLAIMER}</p>

      {COST_EXAMPLES.map((ex) => (
        <CostExampleSection key={ex.id} variant={variant} example={ex} />
      ))}
    </>
  );

  if (isSp) {
    return <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", color: "#172b4d", maxWidth: "900px" }}>{body}</div>;
  }

  return <div className="prose prose-stone max-w-none">{body}</div>;
}

export function SharePointHtmlDocument() {
  return <GuidelinesDocument variant="sharepoint" />;
}
