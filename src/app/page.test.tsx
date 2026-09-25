import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import Home from "./page";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Home", () => {
  it("renders the heading and intro copy", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Bookmark Manager" })).toBeInTheDocument();
    expect(
      screen.getByText("Save your links, keep them organized, find them again in seconds.")
    ).toBeInTheDocument();
  });

  it("links to the bookmarks page", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /Open your bookmarks/ })).toHaveAttribute(
      "href",
      "/bookmarks"
    );
  });
});
