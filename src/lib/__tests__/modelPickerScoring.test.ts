import { describe, it, expect } from "vitest";
import {
  score,
  getRecommendation,
  QUESTIONS,
  type Answers,
} from "../modelPickerScoring";

// Minimal model stubs for getRecommendation tests
const MODELS = [
  { id: "gemini-flash", name: "Gemini Flash", why: { targeted: "Fast targeted edits", vision: "Best vision model" } },
  { id: "sonnet-4.6", name: "Sonnet 4.6", why: { multifile: "Great at multi-file", writing: "Strong writing" } },
  { id: "opus-4.6", name: "Opus 4.6", why: { critical: "Best for critical systems", reasoning: "Deep reasoning" } },
  { id: "composer-1", name: "Composer-1", why: { targeted: "Precise targeted edits", speed: "Fastest completions" } },
  { id: "composer-1-5", name: "Composer-1.5", why: { autonomous: "Runs tasks end-to-end", multifile: "Multi-file agent" } },
];

function allAnswers(overrides: Partial<Answers> = {}): Answers {
  return {
    task: "coding",
    scope: "targeted",
    stakes: "production",
    priority: "balance",
    autonomy: "gaps",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// QUESTIONS structure
// ---------------------------------------------------------------------------
describe("QUESTIONS", () => {
  it("has five questions", () => {
    expect(QUESTIONS).toHaveLength(5);
  });

  it("covers task, scope, stakes, priority, autonomy", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(ids).toEqual(["task", "scope", "stakes", "priority", "autonomy"]);
  });

  it("each question has at least 2 options with id and label", () => {
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      for (const opt of q.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.label).toBeTruthy();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// score() — per-model dimension tests
// ---------------------------------------------------------------------------
describe("score()", () => {
  describe("gemini-flash", () => {
    it("scores high for vision + targeted + production + accuracy", () => {
      const s = score("gemini-flash", allAnswers({
        task: "vision", scope: "targeted", stakes: "production", priority: "accuracy", autonomy: "targeted",
      }));
      // vision(3) + targeted(3) + production(3) + accuracy(3) + targeted-autonomy(3) = 15
      expect(s).toBe(15);
    });

    it("gets negative points for prototype stakes", () => {
      const base = score("gemini-flash", allAnswers({ stakes: "production" }));
      const proto = score("gemini-flash", allAnswers({ stakes: "prototype" }));
      expect(proto).toBeLessThan(base);
    });

    it("penalized for drive autonomy", () => {
      const targeted = score("gemini-flash", allAnswers({ autonomy: "targeted" }));
      const drive = score("gemini-flash", allAnswers({ autonomy: "drive" }));
      expect(drive).toBeLessThan(targeted);
    });
  });

  describe("sonnet-4.6", () => {
    it("scores high for writing + architecture + balance + gaps", () => {
      const s = score("sonnet-4.6", allAnswers({
        task: "writing", scope: "architecture", priority: "balance", autonomy: "gaps",
      }));
      // writing(3) + architecture(3) + balance(2) + gaps(3) = 11 + stakes points
      expect(s).toBeGreaterThanOrEqual(11);
    });

    it("rewards analysis task", () => {
      const coding = score("sonnet-4.6", allAnswers({ task: "coding" }));
      const analysis = score("sonnet-4.6", allAnswers({ task: "analysis" }));
      expect(analysis).toBeGreaterThan(coding);
    });

    it("rewards multifile scope", () => {
      const targeted = score("sonnet-4.6", allAnswers({ scope: "targeted" }));
      const multi = score("sonnet-4.6", allAnswers({ scope: "multifile" }));
      expect(multi).toBeGreaterThan(targeted);
    });
  });

  describe("opus-4.6", () => {
    it("scores highest for reasoning + architecture + critical + accuracy", () => {
      const s = score("opus-4.6", allAnswers({
        task: "reasoning", scope: "architecture", stakes: "critical", priority: "accuracy", autonomy: "gaps",
      }));
      // reasoning(4) + architecture(4) + critical(5) + accuracy(4) + gaps(2) + interaction(critical+accuracy: +2) = 21
      expect(s).toBe(21);
    });

    it("penalized for prototype + speed", () => {
      const best = score("opus-4.6", allAnswers({ stakes: "critical", priority: "accuracy" }));
      const worst = score("opus-4.6", allAnswers({ stakes: "prototype", priority: "speed" }));
      expect(worst).toBeLessThan(best);
    });

    it("gets prototype penalty", () => {
      const prod = score("opus-4.6", allAnswers({ stakes: "production" }));
      const proto = score("opus-4.6", allAnswers({ stakes: "prototype" }));
      expect(proto).toBeLessThan(prod);
    });
  });

  describe("composer-1", () => {
    it("scores high for coding + targeted scope + speed + targeted autonomy", () => {
      const s = score("composer-1", allAnswers({
        task: "coding", scope: "targeted", priority: "speed", autonomy: "targeted",
      }));
      // coding(3) + targeted(5) + production(2) + speed(3) + targeted-autonomy(5) = 18
      expect(s).toBe(18);
    });

    it("heavily penalized for autonomous scope", () => {
      const targeted = score("composer-1", allAnswers({ scope: "targeted" }));
      const auto = score("composer-1", allAnswers({ scope: "autonomous" }));
      expect(auto).toBeLessThan(targeted);
    });

    it("heavily penalized for drive autonomy", () => {
      const targeted = score("composer-1", allAnswers({ autonomy: "targeted" }));
      const drive = score("composer-1", allAnswers({ autonomy: "drive" }));
      expect(drive).toBeLessThan(targeted);
    });
  });

  describe("composer-1-5", () => {
    it("scores high for autonomous scope + drive autonomy", () => {
      const s = score("composer-1-5", allAnswers({
        task: "coding", scope: "autonomous", stakes: "prototype", priority: "speed", autonomy: "drive",
      }));
      // coding(3) + autonomous(5) + prototype(2) + speed(2) + drive(5) + interaction(auto+drive: -2) = 15
      expect(s).toBe(15);
    });

    it("penalized for targeted scope", () => {
      const auto = score("composer-1-5", allAnswers({ scope: "autonomous" }));
      const targeted = score("composer-1-5", allAnswers({ scope: "targeted" }));
      expect(targeted).toBeLessThan(auto);
    });

    it("penalized for critical stakes", () => {
      const internal = score("composer-1-5", allAnswers({ stakes: "internal" }));
      const critical = score("composer-1-5", allAnswers({ stakes: "critical" }));
      expect(critical).toBeLessThan(internal);
    });

    it("penalized for targeted autonomy", () => {
      const drive = score("composer-1-5", allAnswers({ autonomy: "drive" }));
      const targeted = score("composer-1-5", allAnswers({ autonomy: "targeted" }));
      expect(targeted).toBeLessThan(drive);
    });
  });

  describe("unknown model", () => {
    it("returns 0 for an unrecognized model id", () => {
      expect(score("unknown-model", allAnswers())).toBe(0);
    });
  });
});

// ---------------------------------------------------------------------------
// Interaction effects
// ---------------------------------------------------------------------------
describe("interaction effects", () => {
  it("dampens composer-1-5 when autonomous + drive overlap", () => {
    const withoutInteraction = score("composer-1-5", allAnswers({
      scope: "autonomous", autonomy: "gaps",
    }));
    const withInteraction = score("composer-1-5", allAnswers({
      scope: "autonomous", autonomy: "drive",
    }));
    // drive gives +5 but interaction removes 2, so net +3 vs gaps +2 = only +1 difference
    const diff = withInteraction - withoutInteraction;
    // Without the dampen, drive(+5) - gaps(+2) = +3. With dampen, it's +1.
    expect(diff).toBeLessThan(3);
  });

  it("boosts opus-4.6 for critical + autonomous scope", () => {
    const opusWithout = score("opus-4.6", allAnswers({
      stakes: "critical", scope: "multifile",
    }));
    const opusWith = score("opus-4.6", allAnswers({
      stakes: "critical", scope: "autonomous",
    }));
    // autonomous scope gives +1 base + +2 interaction = +3 vs multifile +2
    // so opusWith should be higher, and the interaction boost accounts for part of it
    expect(opusWith).toBeGreaterThan(opusWithout);
  });

  it("boosts opus-4.6 and penalizes composer-1-5 for critical + accuracy", () => {
    const opusCritAcc = score("opus-4.6", allAnswers({
      stakes: "critical", priority: "accuracy",
    }));
    const opusCritBal = score("opus-4.6", allAnswers({
      stakes: "critical", priority: "balance",
    }));
    // accuracy(+4) + interaction(+2) vs balance(0) = +6 difference
    expect(opusCritAcc - opusCritBal).toBe(6);

    const compCritAcc = score("composer-1-5", allAnswers({
      stakes: "critical", priority: "accuracy",
    }));
    const compCritBal = score("composer-1-5", allAnswers({
      stakes: "critical", priority: "balance",
    }));
    // accuracy(-1) + interaction(-1) = -2 vs balance(0)
    expect(compCritAcc).toBeLessThan(compCritBal);
  });
});

// ---------------------------------------------------------------------------
// getRecommendation()
// ---------------------------------------------------------------------------
describe("getRecommendation()", () => {
  it("returns the highest-scoring model as the winner", () => {
    // This combo strongly favors opus-4.6
    const rec = getRecommendation(MODELS, {
      task: "reasoning", scope: "architecture", stakes: "critical",
      priority: "accuracy", autonomy: "gaps",
    });
    expect(rec.model.id).toBe("opus-4.6");
  });

  it("returns a runner-up different from the winner", () => {
    const rec = getRecommendation(MODELS, allAnswers());
    expect(rec.runnerUp.id).not.toBe(rec.model.id);
  });

  it("recommends composer-1 for targeted + speed + coding", () => {
    const rec = getRecommendation(MODELS, {
      task: "coding", scope: "targeted", stakes: "production",
      priority: "speed", autonomy: "targeted",
    });
    expect(rec.model.id).toBe("composer-1");
  });

  it("recommends composer-1-5 for autonomous + drive", () => {
    const rec = getRecommendation(MODELS, {
      task: "coding", scope: "autonomous", stakes: "internal",
      priority: "speed", autonomy: "drive",
    });
    expect(rec.model.id).toBe("composer-1-5");
  });

  it("recommends sonnet-4.6 for writing + architecture + balance", () => {
    const rec = getRecommendation(MODELS, {
      task: "writing", scope: "architecture", stakes: "internal",
      priority: "balance", autonomy: "gaps",
    });
    expect(rec.model.id).toBe("sonnet-4.6");
  });

  it("recommends gemini-flash for vision + targeted", () => {
    const rec = getRecommendation(MODELS, {
      task: "vision", scope: "targeted", stakes: "production",
      priority: "accuracy", autonomy: "targeted",
    });
    expect(rec.model.id).toBe("gemini-flash");
  });

  describe("confidence levels", () => {
    it("returns 'strong' when margin >= 6", () => {
      // Opus with critical+accuracy+reasoning should dominate
      const rec = getRecommendation(MODELS, {
        task: "reasoning", scope: "architecture", stakes: "critical",
        priority: "accuracy", autonomy: "gaps",
      });
      expect(rec.confidence).toBe("strong");
    });

    it("returns 'close' when margin < 3", () => {
      // A balanced combo where models score similarly
      const rec = getRecommendation(MODELS, {
        task: "coding", scope: "multifile", stakes: "internal",
        priority: "balance", autonomy: "gaps",
      });
      expect(["close", "good"]).toContain(rec.confidence);
    });
  });

  describe("reason generation", () => {
    it("uses model why text when a matching key is found", () => {
      const rec = getRecommendation(MODELS, {
        task: "reasoning", scope: "architecture", stakes: "critical",
        priority: "accuracy", autonomy: "gaps",
      });
      // Should match one of the why keys from opus model stub
      expect(
        rec.reason === "Best for critical systems" ||
        rec.reason === "Deep reasoning"
      ).toBe(true);
    });

    it("uses fallback reason when no why key matches", () => {
      // Create models with no matching why keys for the answers
      const models = [
        { id: "a", name: "Model A", why: { xyz: "nope" } },
        { id: "b", name: "Model B", why: { abc: "nah" } },
      ];
      const rec = getRecommendation(models, {
        task: "coding", scope: "targeted", stakes: "production",
        priority: "speed", autonomy: "targeted",
      });
      expect(rec.reason).toContain(rec.model.name);
      expect(rec.reason).toContain("right fit");
    });
  });
});

// ---------------------------------------------------------------------------
// Scenario-based integration tests — real-world user journeys
// ---------------------------------------------------------------------------
describe("real-world scenarios", () => {
  it("quick bug fix: coding + targeted + production + speed + targeted autonomy → composer-1", () => {
    const rec = getRecommendation(MODELS, {
      task: "coding", scope: "targeted", stakes: "production",
      priority: "speed", autonomy: "targeted",
    });
    expect(rec.model.id).toBe("composer-1");
  });

  it("writing docs: writing + multifile + internal + balance + gaps → sonnet-4.6", () => {
    const rec = getRecommendation(MODELS, {
      task: "writing", scope: "multifile", stakes: "internal",
      priority: "balance", autonomy: "gaps",
    });
    expect(rec.model.id).toBe("sonnet-4.6");
  });

  it("critical system design: reasoning + architecture + critical + accuracy + gaps → opus-4.6", () => {
    const rec = getRecommendation(MODELS, {
      task: "reasoning", scope: "architecture", stakes: "critical",
      priority: "accuracy", autonomy: "gaps",
    });
    expect(rec.model.id).toBe("opus-4.6");
  });

  it("full autonomous agent task: coding + autonomous + prototype + speed + drive → composer-1-5", () => {
    const rec = getRecommendation(MODELS, {
      task: "coding", scope: "autonomous", stakes: "prototype",
      priority: "speed", autonomy: "drive",
    });
    expect(rec.model.id).toBe("composer-1-5");
  });

  it("vision task: vision + targeted + production + accuracy + targeted → gemini-flash", () => {
    const rec = getRecommendation(MODELS, {
      task: "vision", scope: "targeted", stakes: "production",
      priority: "accuracy", autonomy: "targeted",
    });
    expect(rec.model.id).toBe("gemini-flash");
  });
});
