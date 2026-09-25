import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("renders the current value", () => {
    render(<SearchBar value="react" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search bookmarks")).toHaveValue("react");
  });

  it("calls onChange with the new value as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText("Search bookmarks"), "a");

    expect(onChange).toHaveBeenCalledWith("a");
  });
});
