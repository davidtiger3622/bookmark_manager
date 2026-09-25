import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortMenu from "./SortMenu";

describe("SortMenu", () => {
  it("does not show options until the Sort button is clicked", () => {
    render(<SortMenu value="date" onChange={vi.fn()} />);
    expect(screen.queryByText("A-Z")).not.toBeInTheDocument();
  });

  it("shows all sort options when opened", async () => {
    const user = userEvent.setup();
    render(<SortMenu value="date" onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Sort" }));

    expect(screen.getByText("Date added")).toBeInTheDocument();
    expect(screen.getByText("A-Z")).toBeInTheDocument();
    expect(screen.getByText("Z-A")).toBeInTheDocument();
  });

  it("closes the menu when the Sort button is clicked again", async () => {
    const user = userEvent.setup();
    render(<SortMenu value="date" onChange={vi.fn()} />);

    const sortButton = screen.getByRole("button", { name: "Sort" });
    await user.click(sortButton);
    expect(screen.getByText("A-Z")).toBeInTheDocument();

    await user.click(sortButton);
    expect(screen.queryByText("A-Z")).not.toBeInTheDocument();
  });

  it("calls onChange with the selected option and closes the menu", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortMenu value="date" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Sort" }));
    await user.click(screen.getByText("A-Z"));

    expect(onChange).toHaveBeenCalledWith("az");
    expect(screen.queryByText("A-Z")).not.toBeInTheDocument();
  });

  it("closes the menu when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SortMenu value="date" onChange={vi.fn()} />
        <div data-testid="outside">Outside</div>
      </div>
    );

    await user.click(screen.getByRole("button", { name: "Sort" }));
    expect(screen.getByText("A-Z")).toBeInTheDocument();

    await user.click(screen.getByTestId("outside"));

    expect(screen.queryByText("A-Z")).not.toBeInTheDocument();
  });

  it("highlights the currently selected option", async () => {
    const user = userEvent.setup();
    render(<SortMenu value="za" onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Sort" }));

    expect(screen.getByText("Z-A").classList.contains("bg-[var(--accent)]")).toBe(true);
    expect(screen.getByText("A-Z").classList.contains("bg-[var(--accent)]")).toBe(false);
  });
});
