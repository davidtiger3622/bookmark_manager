import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("shows Dark by default when nothing is stored", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("shows Light when light is stored", () => {
    window.localStorage.setItem("bookmark-manager:theme", "light");
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
  });

  it("applies the theme to the document on mount", async () => {
    window.localStorage.setItem("bookmark-manager:theme", "light");
    render(<ThemeToggle />);
    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  it("toggles from Dark to Light and persists it", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(window.localStorage.getItem("bookmark-manager:theme")).toBe("light");
  });

  it("toggles from Light back to Dark and persists it", async () => {
    window.localStorage.setItem("bookmark-manager:theme", "light");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Light" }));

    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
    expect(window.localStorage.getItem("bookmark-manager:theme")).toBe("dark");
  });
});
