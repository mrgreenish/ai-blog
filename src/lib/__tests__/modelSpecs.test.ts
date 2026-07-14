import { describe, expect, it } from "vitest";
import {
  MODEL_BY_ID,
  getCostCalculatorModels,
  getContextWindowModels,
  getDevBenchmarkColumns,
  getEffectiveModelPricing,
  getTinderModels,
} from "../modelSpecs";

describe("Claude Sonnet 5 pricing", () => {
  const sonnet = MODEL_BY_ID["sonnet-5"];

  it("uses introductory pricing through August 31, 2026", () => {
    expect(getEffectiveModelPricing(sonnet, "2026-06-30")).toMatchObject({
      inputPer1M: 2,
      outputPer1M: 10,
      isPromotional: true,
    });
    expect(getEffectiveModelPricing(sonnet, "2026-08-31")).toMatchObject({
      inputPer1M: 2,
      outputPer1M: 10,
      isPromotional: true,
    });
  });

  it("uses standard pricing from September 1, 2026", () => {
    expect(getEffectiveModelPricing(sonnet, "2026-09-01")).toEqual({
      inputPer1M: 3,
      outputPer1M: 15,
      isPromotional: false,
    });
  });

  it("propagates the effective price through calculator selectors", () => {
    const launchPrice = getCostCalculatorModels("2026-07-01").find(
      (model) => model.id === "sonnet-5"
    );
    const standardPrice = getCostCalculatorModels("2026-09-01").find(
      (model) => model.id === "sonnet-5"
    );

    expect(launchPrice).toMatchObject({ perM_in: 2, perM_out: 10 });
    expect(standardPrice).toMatchObject({ perM_in: 3, perM_out: 15 });
  });
});

describe("GPT-5.6 and Claude Fable registry", () => {
  const expected = [
    { id: "gpt-5.6-luna", input: 1, output: 6, tier: "fast", context: 1_050_000 },
    { id: "gpt-5.6-terra", input: 2.5, output: 15, tier: "balanced", context: 1_050_000 },
    { id: "gpt-5.6-sol", input: 5, output: 30, tier: "reasoning", context: 1_050_000 },
    { id: "claude-fable-5", input: 10, output: 50, tier: "reasoning", context: 1_000_000 },
  ] as const;

  it.each(expected)("registers $id with verified specs", ({ id, input, output, tier, context }) => {
    expect(MODEL_BY_ID[id]).toMatchObject({
      id,
      inputPer1M: input,
      outputPer1M: output,
      tier,
      contextWindowTokens: context,
    });
  });

  it("surfaces the current models in cost, context, Tinder, and benchmark selectors", () => {
    const ids = expected.map((model) => model.id);
    expect(getCostCalculatorModels("2026-07-14").map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getTinderModels().map((model) => model.id)).toEqual(expect.arrayContaining(ids));
    expect(getDevBenchmarkColumns().map((model) => model.id)).toEqual(ids);
    expect(getContextWindowModels().map((model) => model.name)).toEqual(
      expect.arrayContaining(expected.map((model) => MODEL_BY_ID[model.id].name))
    );
  });
});
