import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "../Header";
vi.mock("next/navigation", () => ({ usePathname: () => "/guides" }));
afterEach(cleanup);
describe("publication navigation", () => {
  it("opens the menu and returns focus on Escape", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /Menu/ });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
  it("marks the current section and closes the menu after a destination is chosen", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /Menu/ });
    fireEvent.click(toggle);
    const guide = screen.getByRole("link", { name: "Guides" });
    expect(guide).toHaveAttribute("aria-current", "page");
    fireEvent.click(guide);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
