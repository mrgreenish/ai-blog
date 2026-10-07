import { afterEach, describe, expect, it, vi } from "vitest";
import { formatPriceForModel } from "../guidelinesModels";

afterEach(() => vi.useRealTimers());

describe("static guidelines pricing", () => {
  it.each(["2026-10-05", "2026-10-07", "2026-10-20", "2027-01-01"])(
    "includes standard and dated promotional rates when built on %s",
    (date) => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date(`${date}T12:00:00Z`));
      expect(formatPriceForModel("mistral-large-4")).toBe(
        "$1.36 input / $4.18 output (standard); $0.68 input / $2.09 output (2026-10-06–2026-10-19 inclusive; 50% launch offer; calendar interpretation: Oct 6–19 inclusive)",
      );
      expect(formatPriceForModel("gemini-3.8-flash")).toBe(
        "$1.5 input / $7.5 output (standard); $0.75 input / $3.75 output (2026-09-02–2026-12-31 inclusive; Introductory pricing through December 31, 2026)",
      );
    },
  );

  it("keeps ordinary rates concise", () => {
    expect(formatPriceForModel("gpt-6-luna")).toBe("$0.1 input / $0.5 output");
  });
});
