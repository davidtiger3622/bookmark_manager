import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookmarkModal from "./AddBookmarkModal";
import type { Bookmark } from "@/lib/storage";

function makeBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
  return {
    id: overrides.id ?? "1",
    name: overrides.name ?? "Example",
    url: overrides.url ?? "https://example.com",
    favorite: overrides.favorite ?? false,
    createdAt: overrides.createdAt ?? Date.now(),
  };
}

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

  describe("editing an existing bookmark", () => {
    it("pre-fills the fields with the bookmark's name and url", () => {
      const bookmark = makeBookmark({ name: "My Site", url: "https://mysite.com" });
      render(<AddBookmarkModal bookmark={bookmark} onAdd={vi.fn()} onEdit={vi.fn()} onClose={vi.fn()} />);

      expect(screen.getByPlaceholderText("Name")).toHaveValue("My Site");
      expect(screen.getByPlaceholderText("Link")).toHaveValue("https://mysite.com");
    });

    it("shows the edit title and Save changes button", () => {
      const bookmark = makeBookmark();
      render(<AddBookmarkModal bookmark={bookmark} onAdd={vi.fn()} onEdit={vi.fn()} onClose={vi.fn()} />);

      expect(screen.getByText("Edit bookmark")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    });

    it("calls onEdit with the bookmark id and trimmed values, then closes", async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      const onEdit = vi.fn();
      const onClose = vi.fn();
      const bookmark = makeBookmark({ id: "abc", name: "Old Name", url: "https://old.com" });

      render(<AddBookmarkModal bookmark={bookmark} onAdd={onAdd} onEdit={onEdit} onClose={onClose} />);

      const nameInput = screen.getByPlaceholderText("Name");
      await user.clear(nameInput);
      await user.type(nameInput, "  New Name  ");
      const urlInput = screen.getByPlaceholderText("Link");
      await user.clear(urlInput);
      await user.type(urlInput, "  new.com  ");
      await user.click(screen.getByRole("button", { name: "Save changes" }));

      expect(onEdit).toHaveBeenCalledWith("abc", "New Name", "new.com");
      expect(onAdd).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it("does not call onEdit when the name is cleared to empty", async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      const bookmark = makeBookmark();

      render(<AddBookmarkModal bookmark={bookmark} onAdd={vi.fn()} onEdit={onEdit} onClose={vi.fn()} />);

      await user.clear(screen.getByPlaceholderText("Name"));
      await user.click(screen.getByRole("button", { name: "Save changes" }));

      expect(onEdit).not.toHaveBeenCalled();
    });

    it("falls back to onAdd if onEdit is not provided even while editing", async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      const onClose = vi.fn();
      const bookmark = makeBookmark({ name: "Old Name", url: "https://old.com" });

      render(<AddBookmarkModal bookmark={bookmark} onAdd={onAdd} onClose={onClose} />);

      await user.click(screen.getByRole("button", { name: "Save changes" }));

      expect(onAdd).toHaveBeenCalledWith("Old Name", "https://old.com");
      expect(onClose).toHaveBeenCalled();
    });
  });
});
