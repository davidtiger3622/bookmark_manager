import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookmarkModal from "./AddBookmarkModal";

describe("AddBookmarkModal", () => {
  it("calls onAdd with trimmed name and url, then closes", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText("Name"), "  Example  ");
    await user.type(screen.getByPlaceholderText("Link"), "  example.com  ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onAdd).toHaveBeenCalledWith("Example", "example.com");
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onAdd when name is empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText("Link"), "example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onAdd when url is empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText("Name"), "Example");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onAdd when both fields are only whitespace", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText("Name"), "   ");
    await user.type(screen.getByPlaceholderText("Link"), "   ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking the backdrop", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    const { container } = render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.click(container.firstChild as Element);

    expect(onClose).toHaveBeenCalled();
  });

  it("does not close when clicking inside the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(<AddBookmarkModal onAdd={onAdd} onClose={onClose} />);

    await user.click(screen.getByText("Save a bookmark"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
