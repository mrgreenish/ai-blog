import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("renders the welcome message", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to AI Blog/i)).toBeInTheDocument();
  });

  it("renders the instruction text", () => {
    render(<Home />);
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument();
  });
});
