import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

describe("layout metadata", () => {
  it("sets the page title and description", () => {
    expect(metadata.title).toBe("Bookmark Manager");
    expect(metadata.description).toBe("Save and organize your links");
  });
});

describe("RootLayout", () => {
  it("renders its children", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
