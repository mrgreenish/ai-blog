import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModelTinder, CHAT_SCRIPTS } from "../ModelTinder";
import { ConfigGenerator } from "../ConfigGenerator";
import { QuickEstimate } from "../QuickEstimate";
import { ModelMixer } from "../ModelMixer";
import { MaxModeViz } from "../MaxModeViz";
import { ModelPicker } from "../ModelPicker";
import { WorkflowRecipe } from "../WorkflowRecipe";
import { ModelCompare } from "../ModelCompare";
import { getTinderModels } from "@/lib/modelSpecs";
import { QUESTIONS } from "@/lib/modelPickerScoring";

afterEach(cleanup);

describe("Useful tool outputs", () => {
  it("keeps every saved profile, including after finishing a scripted example", async () => {
    const user = userEvent.setup();
    const models = getTinderModels();
    render(<ModelTinder />);
    await user.click(screen.getByRole("button", { name: "Save & next" }));
    await user.click(screen.getByRole("button", { name: "Save & next" }));
    await user.click(
      screen.getByRole("button", { name: "View shortlist (2)" }),
    );
    expect(
      screen.getByRole("heading", { name: /Your shortlist · 2 saved/ }),
    ).toBeVisible();
    await user.click(
      screen.getAllByRole("button", { name: "Explore example" })[0],
    );
    for (let i = 1; i < CHAT_SCRIPTS[models[0].id].length; i++) {
      await user.click(screen.getByRole("button", { name: "Next example" }));
    }
    await user.click(
      screen.getByRole("button", { name: "Done · Back to models" }),
    );
    expect(
      screen.getByRole("heading", { name: /Your shortlist · 2 saved/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: new RegExp(models[0].name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: `Remove ${models[0].name}` }),
    );
    expect(
      screen.getByRole("heading", { name: /Your shortlist · 1 saved/ }),
    ).toBeVisible();
  });

  it("generates Cursor metadata, project commands, and custom conventions in the copied file", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<ConfigGenerator />);
    await user.selectOptions(
      screen.getByLabelText("Instruction file"),
      "cursor",
    );
    await user.selectOptions(screen.getByLabelText("Project stack"), "python");
    await user.type(
      screen.getByLabelText(/Your conventions/),
      "Use type hints.",
    );
    await user.click(screen.getByRole("button", { name: "Copy instructions" }));
    expect(copy).toHaveBeenCalledWith(
      expect.stringMatching(/^---\ndescription:.*\nalwaysApply: true\n---/),
    );
    expect(copy).toHaveBeenCalledWith(
      expect.stringContaining("Test command: pytest"),
    );
    expect(copy).toHaveBeenCalledWith(
      expect.stringContaining("- Use type hints."),
    );
    expect(copy.mock.lastCall?.[0]).not.toContain("pnpm build");
  });

  it("copies custom token estimates and resets assumptions when selecting a preset", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<QuickEstimate />);
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Input tokens per run" }),
      { target: { value: "0" } },
    );
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Output tokens per run" }),
      { target: { value: "0" } },
    );
    await user.click(screen.getByRole("button", { name: "Once/day" }));
    await user.click(screen.getByRole("button", { name: "Copy estimate" }));
    expect(copy.mock.lastCall?.[0]).toContain(
      "0 input and 0 output tokens/run; 1 runs/day; 30 days/month.",
    );
    expect(copy.mock.lastCall?.[0]).toContain("$0.00/run; $0.00/month");
    await user.click(screen.getByRole("button", { name: "Build a feature" }));
    expect(
      screen.getByRole("spinbutton", { name: "Input tokens per run" }),
    ).toHaveValue(8000);
    expect(
      screen.getByRole("spinbutton", { name: "Output tokens per run" }),
    ).toHaveValue(12000);
  });

  it("applies retry assumptions to the mixed workflow and preserves assignments across modes", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<ModelMixer />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Model for 1. Scaffold" }),
      "gpt-5.6-luna",
    );
    await user.click(screen.getByRole("button", { name: "Copy pipeline" }));
    const initial = Number(
      copy.mock.lastCall?.[0].match(
        /Mixed pipeline: 1 attempt\(s\), \$(\d+\.\d+)/,
      )?.[1],
    );
    fireEvent.change(
      screen.getByRole("slider", { name: "Mixed pipeline attempts" }),
      { target: { value: "3" } },
    );
    await user.click(screen.getByRole("button", { name: "Quick Estimate" }));
    await user.click(screen.getByRole("button", { name: "Pipeline Builder" }));
    expect(
      screen.getByRole("combobox", { name: "Model for 1. Scaffold" }),
    ).toHaveValue("gpt-5.6-luna");
    await user.click(screen.getByRole("button", { name: "Copied!" }));
    const updated = Number(
      copy.mock.lastCall?.[0].match(
        /Mixed pipeline: 3 attempt\(s\), \$(\d+\.\d+)/,
      )?.[1],
    );
    expect(updated).toBeCloseTo(initial * 3, 3);
    expect(copy.mock.lastCall?.[0]).toContain(
      "Single-model alternatives: 1 attempt(s)",
    );
  });

  it("does not claim usable requests when context is exceeded or the request is empty", () => {
    render(<MaxModeViz />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Input tokens" }), {
      target: { value: "2000000" },
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "exceeds the listed context window",
    );
    expect(screen.getByText(/This request does not fit/)).toBeVisible();
    fireEvent.change(screen.getByRole("spinbutton", { name: "Input tokens" }), {
      target: { value: "0" },
    });
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Output tokens" }),
      { target: { value: "0" } },
    );
    expect(screen.getByText(/Add input or output tokens/)).toBeVisible();
  });

  it("allows keyboard users to finish the picker and revise their last answer", async () => {
    const user = userEvent.setup();
    render(<ModelPicker />);
    for (const question of QUESTIONS) {
      const option = await screen.findByRole("button", {
        name: new RegExp(`^${question.options[0].label}`),
      });
      await user.click(option);
      expect(document.activeElement).toHaveAttribute("role", "group");
    }
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy recommendations" }),
      ).toBeVisible(),
    );
    await user.click(
      screen.getByRole("button", { name: "Change last answer" }),
    );
    await waitFor(() =>
      expect(
        screen.getByText(QUESTIONS.at(-1)!.text, { exact: true }),
      ).toBeVisible(),
    );
  });

  it("preserves recipe and finder progress when switching modes", async () => {
    const user = userEvent.setup();
    render(<WorkflowRecipe />);
    await user.click(screen.getByRole("button", { name: "Bug → Fix" }));
    await user.click(screen.getByRole("button", { name: "Help Me Choose" }));
    await user.click(screen.getByRole("button", { name: /Review code/ }));
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "AI Code Review" }),
      ).toBeVisible(),
    );
    await user.click(screen.getByRole("button", { name: "Browse Recipes" }));
    expect(screen.getByRole("button", { name: "Bug → Fix" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Help Me Choose" }));
    expect(
      screen.getByRole("heading", { name: "AI Code Review" }),
    ).toBeVisible();
  });

  it("exposes context overflow and provides a usable evaluation checklist", async () => {
    const user = userEvent.setup();
    render(<ModelCompare />);
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Codebase tokens" }),
      { target: { value: "2000000" } },
    );
    expect(screen.getAllByText(/No room for output/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Developer checks" }));
    expect(
      screen.getByRole("button", { name: "Copy review checklist" }),
    ).toBeVisible();
  });
});
