import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button label="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant styles", () => {
    render(<Button label="Primary" variant="primary" />);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("applies secondary variant styles", () => {
    render(<Button label="Secondary" variant="secondary" />);
    const button = screen.getByText("Secondary");
    expect(button).toHaveClass("bg-gray-200");
  });

  it("applies size styles", () => {
    render(<Button label="Small" size="sm" />);
    const button = screen.getByText("Small");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button label="Click me" onClick={handleClick} />);
    
    await user.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button label="Disabled" onClick={handleClick} disabled />);
    
    await user.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled styles when disabled", () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByText("Disabled");
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(button).toBeDisabled();
  });
});
