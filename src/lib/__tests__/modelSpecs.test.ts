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
import { getRanking, score, type Answers } from "../modelPickerScoring";

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
    expect(estimateModelCost("gpt-6.1-sol", 272_000, 10_000)).toBeCloseTo(0.644);
    expect(estimateModelCost("gpt-6.1-sol", 272_001, 10_000)).toBeCloseTo(1.238004);
  });

  it("prices Opus fast mode at the Opus 5.5 rate", () => {
    expect(MODEL_BY_ID["opus-fast"]).toMatchObject({
      name: "Claude Opus 5.5 Fast",
      inputPer1M: 8,
      outputPer1M: 40,
    });
  });
});

describe("superseded Opus versions", () => {
  const superseded = ["opus-4.8", "opus-5"];

  it("keeps their historical rates for the scenario examples", () => {
    for (const id of superseded) {
      expect(MODEL_BY_ID[id]).toMatchObject({ retired: true, inputPer1M: 5, outputPer1M: 25 });
    }
    expect(getScenarioLabModels().map((model) => model.id)).toEqual(
      expect.arrayContaining(superseded)
    );
  });

  it("leaves them out of every current recommendation surface", () => {
    const current = [
      ...getMixerModels(),
      ...getCostCalculatorModels(),
      ...getPickerModels(),
      ...getPickerModelsV2(),
      ...getFailureGalleryModels(),
      ...getTinderModels(),
      ...getDevBenchmarkColumns(),
    ].map((model) => model.id);
    expect(current).not.toEqual(expect.arrayContaining(["opus-4.8"]));
    expect(current).not.toEqual(expect.arrayContaining(["opus-5"]));
    expect(getContextWindowModels().map((model) => model.name)).not.toContain("Claude Opus 5");
  });
});

describe("superseded Kimi K3", () => {
  it("keeps K3 for its scenario examples and swaps in K3.1 Pro elsewhere", () => {
    expect(MODEL_BY_ID["kimi-k3"]).toMatchObject({ retired: true, inputPer1M: 3, outputPer1M: 15 });
    expect(getScenarioLabModels().map((model) => model.id)).toContain("kimi-k3");
    const current = [
      ...getMixerModels(),
      ...getCostCalculatorModels(),
      ...getPickerModels(),
      ...getPickerModelsV2(),
      ...getFailureGalleryModels(),
      ...getTinderModels(),
      ...getDevBenchmarkColumns(),
    ].map((model) => model.id);
    expect(current).not.toContain("kimi-k3");
    expect(current).toContain("kimi-k3.1-pro");
  });
});

describe("Claude Haiku 5.5 prompt-length pricing", () => {
  it("charges 5x on prompts over 100K tokens", () => {
    expect(estimateModelCost("haiku-5.5", 100_000, 10_000)).toBeCloseTo(0.015);
    expect(estimateModelCost("haiku-5.5", 100_001, 10_000)).toBeCloseTo((100_001 * 0.5 + 10_000 * 2.5) / 1_000_000);
  });
});

describe("Gemini 4 introductory pricing", () => {
  it.each([
    ["gemini-4-argon", "2026-10-12", 4, 20, false],
    ["gemini-4-argon", "2026-10-13", 2, 10, true],
    ["gemini-4-carbon", "2026-11-09", 4, 20, false],
    ["gemini-4-carbon", "2026-11-10", 2, 10, true],
    ["gemini-4-carbon", "2026-11-30", 2, 10, true],
    ["gemini-4-argon", "2026-12-01", 4, 20, false],
  ] as const)("resolves %s on %s", (id, date, input, output, promotional) => {
    expect(getEffectiveModelPricing(MODEL_BY_ID[id], date)).toMatchObject({
      inputPer1M: input, outputPer1M: output, isPromotional: promotional,
    });
  });
});

describe("superseded Fable 5.1", () => {
  it("keeps its rates on record and leaves every current surface", () => {
    expect(MODEL_BY_ID["claude-fable-5.1"]).toMatchObject({ retired: true, inputPer1M: 10, outputPer1M: 50 });
    const current = [
      ...getMixerModels(),
      ...getCostCalculatorModels(),
      ...getPickerModels(),
      ...getPickerModelsV2(),
      ...getScenarioLabModels(),
      ...getFailureGalleryModels(),
      ...getTinderModels(),
      ...getDevBenchmarkColumns(),
    ].map((model) => model.id);
    expect(current).not.toContain("claude-fable-5.1");
    expect(current).toContain("claude-fable-5.2");
    expect(getContextWindowModels().map((model) => model.name)).not.toContain("Claude Fable 5.1");
  });
});

describe("current frontier model registry", () => {
  const expected = [
    { id: "mistral-large-4", input: 0.7, output: 2.1, tier: "reasoning", context: 1_000_000 },
    { id: "gemini-3.8-flash", input: 1.5, output: 7.5, tier: "fast", context: 1_048_576 },
    { id: "deepseek-v4.1-flash", input: 0.3, output: 1.2, tier: "fast", context: 1_000_000 },
    { id: "gpt-6-astra", input: 10, output: 50, tier: "reasoning", context: 1_050_000 },
    { id: "claude-fable-5.2", input: 8, output: 40, tier: "reasoning", context: 1_000_000 },
    { id: "gpt-5.6-luna", input: 0.2, output: 1.2, tier: "fast", context: 1_050_000 },
    { id: "gpt-5.6-terra", input: 2, output: 12, tier: "balanced", context: 1_050_000 },
    { id: "gpt-5.6-sol", input: 4, output: 20, tier: "reasoning", context: 1_050_000 },
    { id: "claude-fable-5", input: 10, output: 50, tier: "reasoning", context: 1_000_000 },
    { id: "opus-5.5", input: 4, output: 20, tier: "reasoning", context: 1_000_000 },
    { id: "sonnet-5.5", input: 2, output: 10, tier: "balanced", context: 1_000_000 },
    { id: "gpt-6.1-sol", input: 2, output: 10, tier: "reasoning", context: 1_050_000 },
    { id: "gpt-6-luna", input: 0.1, output: 0.5, tier: "fast", context: 1_050_000 },
    { id: "glm-5.3", input: 1.4, output: 4.4, tier: "reasoning", context: 1_000_000 },
    { id: "kimi-k3.1-pro", input: 2, output: 10, tier: "reasoning", context: 1_048_576 },
    { id: "haiku-5.5", input: 0.1, output: 0.5, tier: "fast", context: 1_000_000 },
    { id: "gemini-4-argon", input: 4, output: 20, tier: "balanced", context: 1_048_576 },
    { id: "gemini-4-carbon", input: 4, output: 20, tier: "reasoning", context: 1_048_576 },
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
    for (const id of ["gemini-3.8-flash", "deepseek-v4.1-flash", "gpt-6-astra", "claude-fable-5.2", "opus-5.5", "sonnet-5.5", "gpt-6.1-sol", "gpt-6-luna", "glm-5.3", "kimi-k3.1-pro", "haiku-5.5", "gemini-4-argon", "gemini-4-carbon"]) {
      expect(Object.values(MODEL_BY_ID[id].benchmark)).toEqual([null, null, null, null]);
    }
  });
});


describe("Mistral open-weight pricing", () => {
  const model = MODEL_BY_ID["mistral-large-4"];

  it("uses the post-release rates with no leftover launch offer", () => {
    expect(model.promotionalPricing).toBeUndefined();
    for (const date of ["2026-10-07", "2026-11-12"]) {
      expect(getEffectiveModelPricing(model, date)).toMatchObject({
        inputPer1M: 0.7, outputPer1M: 2.1, isPromotional: false,
      });
    }
    expect(estimateModelCost(model.id, 100_000, 10_000)).toBeCloseTo(0.091);
  });

  it("leaves developer checks untested", () => {
    expect(Object.values(model.benchmark)).toEqual([null, null, null, null]);
    expect(getDevBenchmarkColumns().find((column) => column.id === model.id)?.benchmark)
      .toEqual(model.benchmark);
  });
});

describe("picker ties between a model and its successor", () => {
  const cases: { label: string; answers: Answers; older: string; current: string }[] = [
    {
      label: "speed-focused architecture work",
      answers: { task: "coding", scope: "architecture", stakes: "production", priority: "speed", autonomy: "drive" },
      older: "gpt-5.6-sol",
      current: "gpt-6.1-sol",
    },
    {
      label: "a targeted prototype optimized for speed",
      answers: { task: "coding", scope: "targeted", stakes: "prototype", priority: "speed", autonomy: "targeted" },
      older: "gpt-5.6-luna",
      current: "gpt-6-luna",
    },
  ];

  it.each(cases)("ranks the current version first for $label", ({ answers, older, current }) => {
    expect(score(current, answers)).toBe(score(older, answers));

    const ranked = getRanking(getPickerModelsV2(), answers).top3.map((entry) => entry.model.id);
    expect(ranked).toContain(current);
    if (ranked.includes(older)) {
      expect(ranked.indexOf(current)).toBeLessThan(ranked.indexOf(older));
    }
  });

  it("lists current models ahead of older ones", () => {
    const ids = getPickerModelsV2().map((model) => model.id);
    expect(ids.indexOf("gpt-6.1-sol")).toBeLessThan(ids.indexOf("gpt-5.6-sol"));
    expect(ids.indexOf("gpt-6-luna")).toBeLessThan(ids.indexOf("gpt-5.6-luna"));
    expect(ids.indexOf("sonnet-5.5")).toBeLessThan(ids.indexOf("sonnet-5"));
    expect(ids.indexOf("claude-fable-5.2")).toBeLessThan(ids.indexOf("claude-fable-5"));
    expect(ids.indexOf("haiku-5.5")).toBeLessThan(ids.indexOf("haiku-4.5"));
  });
});
