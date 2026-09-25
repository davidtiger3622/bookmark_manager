import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import BookmarkGrid from "./BookmarkGrid";
import type { Bookmark } from "@/lib/storage";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

function makeBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
  return {
    id: overrides.id ?? "1",
    name: overrides.name ?? "Example",
    url: overrides.url ?? "https://example.com",
    favorite: overrides.favorite ?? false,
    createdAt: overrides.createdAt ?? Date.now(),
  };
}

describe("BookmarkGrid", () => {
  it("shows an empty state when there are no bookmarks", () => {
    render(<BookmarkGrid bookmarks={[]} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText("No bookmarks yet. Add your first link.")).toBeInTheDocument();
  });

  it("does not show the Favorites section when nothing is favorited", () => {
    const bookmarks = [makeBookmark({ id: "1", name: "First" })];
    render(<BookmarkGrid bookmarks={bookmarks} onToggleFavorite={vi.fn()} />);
    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("shows the Favorites section only for favorited bookmarks", () => {
    const bookmarks = [
      makeBookmark({ id: "1", name: "Favorited", favorite: true }),
      makeBookmark({ id: "2", name: "Regular", favorite: false }),
    ];
    render(<BookmarkGrid bookmarks={bookmarks} onToggleFavorite={vi.fn()} />);

    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Favorited")).toBeInTheDocument();
    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("does not show the empty state message when there are favorites but no others", () => {
    const bookmarks = [makeBookmark({ id: "1", name: "Favorited", favorite: true })];
    render(<BookmarkGrid bookmarks={bookmarks} onToggleFavorite={vi.fn()} />);
    expect(screen.queryByText("No bookmarks yet. Add your first link.")).not.toBeInTheDocument();
  });

  it("calls onToggleFavorite with the bookmark id when the heart button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    const bookmarks = [makeBookmark({ id: "abc", name: "First" })];

    render(<BookmarkGrid bookmarks={bookmarks} onToggleFavorite={onToggleFavorite} />);

    await user.click(screen.getByRole("button", { name: "Toggle favorite" }));

    expect(onToggleFavorite).toHaveBeenCalledWith("abc");
  });

  it("passes onEdit through to a bookmark and calls it with the full bookmark", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const bookmark = makeBookmark({ id: "abc", name: "First" });

    render(<BookmarkGrid bookmarks={[bookmark]} onToggleFavorite={vi.fn()} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit bookmark" }));

    expect(onEdit).toHaveBeenCalledWith(bookmark);
  });

  it("passes onDelete through and calls it with the bookmark id after confirming", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const bookmark = makeBookmark({ id: "abc", name: "First" });

    render(<BookmarkGrid bookmarks={[bookmark]} onToggleFavorite={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete bookmark" }));

    expect(onDelete).toHaveBeenCalledWith("abc");
    confirmSpy.mockRestore();
  });

  it("passes onEdit and onDelete through to each bookmark when there are favorites and non-favorites", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const favorited = makeBookmark({ id: "1", name: "Favorited", favorite: true });
    const regular = makeBookmark({ id: "2", name: "Regular", favorite: false });

    render(<BookmarkGrid bookmarks={[favorited, regular]} onToggleFavorite={vi.fn()} onEdit={onEdit} />);

    const editButtons = screen.getAllByRole("button", { name: "Edit bookmark" });
    expect(editButtons).toHaveLength(2);

    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(favorited);

    await user.click(editButtons[1]);
    expect(onEdit).toHaveBeenCalledWith(regular);
  });
});
