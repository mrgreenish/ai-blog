import { describe, expect, it } from "vitest";
import {
  MODEL_BY_ID,
  getCostCalculatorModels,
  getEffectiveModelPricing,
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
