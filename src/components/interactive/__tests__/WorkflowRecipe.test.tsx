import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkflowRecipe } from "../WorkflowRecipe";
import { track } from "@vercel/analytics";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

beforeEach(() => { vi.stubEnv("NEXT_PUBLIC_GROWTH_EVENTS_ENABLED", "true"); vi.clearAllMocks(); });
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe("Workflow recipe use", () => {
  it("copies the chapter's initial recipe and only tracks successful copies", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<WorkflowRecipe initialRecipeId="bug-to-fix" />);
    expect(screen.getByRole("button", { name: "Bug → Fix" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Copy recipe" }));
    expect(copy).toHaveBeenCalledWith(expect.stringContaining("# Bug → Fix"));
    expect(track).toHaveBeenCalledWith("recipe_copied", { recipe: "bug-to-fix" });
  });

  it("shows a result, copies it, and permits starting again", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<WorkflowRecipe />);
    await user.click(screen.getByRole("button", { name: "Help Me Choose" }));
    await user.click(await screen.findByRole("button", { name: /Review code/ }));
    expect(await screen.findByRole("heading", { name: "AI Code Review" })).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith("workflow_completed", { result: "review" });
    await user.click(screen.getByRole("button", { name: "Copy workflow" }));
    expect(copy).toHaveBeenCalledWith(expect.stringContaining("AI Code Review"));
    expect(track).toHaveBeenCalledWith("recipe_copied", { recipe: "review" });
    await user.click(screen.getByRole("button", { name: "Start over" }));
    expect(await screen.findByRole("button", { name: /Review code/ })).toBeInTheDocument();
    expect(vi.mocked(track).mock.calls.filter(([name]) => name === "workflow_completed")).toHaveLength(1);
  });

  it("reports clipboard denial without a false success event", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Denied"));
    render(<WorkflowRecipe />);
    await user.click(screen.getByRole("button", { name: "Copy recipe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not copy");
    expect(track).not.toHaveBeenCalled();
  });

  it("works when optional events are disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_GROWTH_EVENTS_ENABLED", "false");
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<WorkflowRecipe />);
    await user.click(screen.getByRole("button", { name: "Copy recipe" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument());
    expect(track).not.toHaveBeenCalled();
  });
});
