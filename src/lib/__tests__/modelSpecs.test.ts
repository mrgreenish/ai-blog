import { describe, expect, it } from "vitest";
import {
  MODEL_BY_ID,
  getCostCalculatorModels,
  getContextWindowModels,
  getDevBenchmarkColumns,
  getEffectiveModelPricing,
  estimateModelCost,
  getFailureGalleryModels,
  getMixerModels,
  getPickerModels,
  getPickerModelsV2,
  getScenarioLabModels,
  getTinderModels,
} from "../modelSpecs";

describe("time-dependent model pricing", () => {
  const sonnet = MODEL_BY_ID["sonnet-5"];

  it("keeps Claude Sonnet 5 at the permanent launch price", () => {
    expect(getEffectiveModelPricing(sonnet, "2026-06-30")).toEqual({
      inputPer1M: 2,
      outputPer1M: 10,
      isPromotional: false,
    });
    expect(getEffectiveModelPricing(sonnet, "2026-09-01")).toEqual({
      inputPer1M: 2,
      outputPer1M: 10,
      isPromotional: false,
    });
  });

  it("changes Gemini 3.8 Flash pricing after the launch offer", () => {
    const flash = MODEL_BY_ID["gemini-3.8-flash"];
    expect(getEffectiveModelPricing(flash, "2026-12-31")).toMatchObject({
      inputPer1M: 0.75,
      outputPer1M: 3.75,
      isPromotional: true,
    });
    expect(getEffectiveModelPricing(flash, "2027-01-01")).toEqual({
      inputPer1M: 1.5,
      outputPer1M: 7.5,
      isPromotional: false,
    });
  });

  it("applies OpenAI long-context rates only above 272K input tokens", () => {
    expect(estimateModelCost("gpt-6-astra", 272_000, 10_000)).toBeCloseTo(3.22);
    expect(estimateModelCost("gpt-6-astra", 272_001, 10_000)).toBeCloseTo(6.19002);
  });
});

describe("current frontier model registry", () => {
  const expected = [
    { id: "gemini-3.8-flash", input: 1.5, output: 7.5, tier: "fast", context: 1_048_576 },
    { id: "deepseek-v4.1-flash", input: 0.3, output: 1.2, tier: "fast", context: 1_000_000 },
    { id: "gpt-6-astra", input: 10, output: 50, tier: "reasoning", context: 1_050_000 },
    { id: "claude-fable-5.1", input: 10, output: 50, tier: "reasoning", context: 1_000_000 },
    { id: "gpt-5.6-luna", input: 0.2, output: 1.2, tier: "fast", context: 1_050_000 },
    { id: "gpt-5.6-terra", input: 2, output: 12, tier: "balanced", context: 1_050_000 },
    { id: "gpt-5.6-sol", input: 4, output: 20, tier: "reasoning", context: 1_050_000 },
    { id: "claude-fable-5", input: 10, output: 50, tier: "reasoning", context: 1_000_000 },
    { id: "opus-5", input: 5, output: 25, tier: "reasoning", context: 1_000_000 },
    { id: "kimi-k3", input: 3, output: 15, tier: "reasoning", context: 1_048_576 },
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

  it("surfaces the current models in every shared model tool selector", () => {
    const ids = expected.map((model) => model.id);
    expect(getMixerModels("2026-07-29").map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getCostCalculatorModels("2026-07-14").map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getPickerModels().map((model) => model.id)).toEqual(expect.arrayContaining(ids));
    expect(getPickerModelsV2("2026-07-29").map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getScenarioLabModels("2026-07-29").map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getFailureGalleryModels().map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getTinderModels().map((model) => model.id)).toEqual(expect.arrayContaining(ids));
    expect(getDevBenchmarkColumns().map((model) => model.id)).toEqual(
      expect.arrayContaining(ids)
    );
    expect(getContextWindowModels().map((model) => model.name)).toEqual(
      expect.arrayContaining(expected.map((model) => MODEL_BY_ID[model.id].name))
    );
  });

  it("marks models without local developer checks as not tested", () => {
    for (const id of ["gemini-3.8-flash", "deepseek-v4.1-flash", "gpt-6-astra", "claude-fable-5.1", "opus-5", "kimi-k3"]) {
      expect(Object.values(MODEL_BY_ID[id].benchmark)).toEqual([null, null, null, null]);
    }
  });
});
