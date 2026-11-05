import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/empty-state";

describe("smoke", () => {
  it("renders the empty state", () => {
    render(<EmptyState title="Clear sky" description="Nothing here yet." />);
    expect(screen.getByText("Clear sky")).toBeInTheDocument();
  });
});
