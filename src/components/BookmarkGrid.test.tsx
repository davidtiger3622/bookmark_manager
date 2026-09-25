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
});
