import {
  MODEL_BY_ID,
  PRICING_META,
  getEffectiveModelPricing,
  type ModelSpec,
} from "@/lib/modelSpecs";
import { formatCost } from "@/lib/scenarioLabData";

/** All model IDs referenced by the guidelines document — must exist in MODEL_REGISTRY */
export const GUIDELINES_MODEL_IDS = [
  "gemini-flash",
  "gemini-3.1-pro",
  "composer-2.5",
  "composer-2.5-fast",
  "gpt-5.6-luna",
  "gpt-5.6-terra",
  "gpt-5.6-sol",
  "claude-fable-5",
  "sonnet-5",
  "opus-fast",
] as const;

export type GuidelinesModelId = (typeof GUIDELINES_MODEL_IDS)[number];

/** Ordered list for the pricing table */
export const GUIDELINES_PRICING_MODEL_IDS: GuidelinesModelId[] = [
  "composer-2.5",
  "composer-2.5-fast",
  "gpt-5.6-luna",
  "gpt-5.6-terra",
  "gemini-flash",
  "gemini-3.1-pro",
  "sonnet-5",
  "gpt-5.6-sol",
  "claude-fable-5",
  "opus-fast",
];

export function getGuidelinesModel(id: GuidelinesModelId): ModelSpec {
  const model = MODEL_BY_ID[id];
  if (!model) {
    throw new Error(`Unknown guidelines model ID: ${id}`);
  }
  return model;
}

export function getModelDisplayName(id: GuidelinesModelId): string {
  return getGuidelinesModel(id).name;
}

export function formatModelNames(ids: GuidelinesModelId[]): string {
  return ids.map((id) => getModelDisplayName(id)).join(", ");
}

export function formatPricePer1M(inputPer1M: number, outputPer1M: number): string {
  const inPrice =
    inputPer1M >= 10
      ? `$${inputPer1M.toFixed(0)}`
      : `$${inputPer1M.toFixed(2).replace(/\.?0+$/, "")}`;
  const outPrice =
    outputPer1M >= 10
      ? `$${outputPer1M.toFixed(0)}`
      : `$${outputPer1M.toFixed(2).replace(/\.?0+$/, "")}`;
  return `${inPrice} input / ${outPrice} output`;
}

export function formatPriceForModel(id: GuidelinesModelId): string {
  const m = getGuidelinesModel(id);
  if (m.promotionalPricing) {
    const promo = formatPricePer1M(
      m.promotionalPricing.inputPer1M,
      m.promotionalPricing.outputPer1M
    );
    const standard = formatPricePer1M(m.inputPer1M, m.outputPer1M);
    return `${promo} through Aug 31; ${standard} from Sep 1`;
  }
  if (id === "opus-fast") {
    return `around ${formatPricePer1M(m.inputPer1M, m.outputPer1M)}`;
  }
  return formatPricePer1M(m.inputPer1M, m.outputPer1M);
}

export function calcGuidelinesCost(
  id: GuidelinesModelId,
  inputTokens: number,
  outputTokens: number
): number {
  const m = getGuidelinesModel(id);
  const pricing = getEffectiveModelPricing(m);
  return (
    (inputTokens / 1_000_000) * pricing.inputPer1M +
    (outputTokens / 1_000_000) * pricing.outputPer1M
  );
}

export function formatAboutCost(
  id: GuidelinesModelId,
  inputTokens: number,
  outputTokens: number
): string {
  const cost = calcGuidelinesCost(id, inputTokens, outputTokens);
  return `about ${formatCost(cost)}`;
}

export function formatPricingVerifiedDate(): string {
  const [year, month, day] = PRICING_META.verifiedDate.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export { PRICING_META };
