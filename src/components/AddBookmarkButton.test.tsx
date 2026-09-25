import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookmarkButton from "./AddBookmarkButton";

describe("AddBookmarkButton", () => {
  it("renders the add label", () => {
    render(<AddBookmarkButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "+ Add" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<AddBookmarkButton onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "+ Add" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
