import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import BookmarkCircle from "./BookmarkCircle";
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

describe("BookmarkCircle", () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    confirmSpy = vi.spyOn(window, "confirm");
    openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    openSpy.mockRestore();
  });

  it("renders the bookmark name", () => {
    render(<BookmarkCircle bookmark={makeBookmark({ name: "My Site" })} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText("My Site")).toBeInTheDocument();
  });

  it("opens the bookmark url in a new tab when the favicon button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<BookmarkCircle bookmark={makeBookmark({ url: "https://example.com" })} onToggleFavorite={vi.fn()} />);

    const faviconButton = container.querySelector("img")!.closest("button")!;
    await user.click(faviconButton);

    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank", "noopener,noreferrer");
  });

  it("opens the bookmark url when the name button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookmarkCircle bookmark={makeBookmark({ name: "My Site", url: "https://example.com" })} onToggleFavorite={vi.fn()} />);

    await user.click(screen.getByText("My Site"));

    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank", "noopener,noreferrer");
  });

  it("calls onToggleFavorite with the bookmark id", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    render(<BookmarkCircle bookmark={makeBookmark({ id: "abc" })} onToggleFavorite={onToggleFavorite} />);

    await user.click(screen.getByRole("button", { name: "Toggle favorite" }));

    expect(onToggleFavorite).toHaveBeenCalledWith("abc");
  });

  it("calls onEdit with the bookmark when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const bookmark = makeBookmark();
    render(<BookmarkCircle bookmark={bookmark} onToggleFavorite={vi.fn()} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit bookmark" }));

    expect(onEdit).toHaveBeenCalledWith(bookmark);
  });

  it("does nothing when edit is clicked but onEdit is not provided", async () => {
    const user = userEvent.setup();
    render(<BookmarkCircle bookmark={makeBookmark()} onToggleFavorite={vi.fn()} />);

    await expect(user.click(screen.getByRole("button", { name: "Edit bookmark" }))).resolves.not.toThrow();
  });

  it("calls onDelete with the bookmark id when confirm is accepted", async () => {
    confirmSpy.mockReturnValue(true);
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<BookmarkCircle bookmark={makeBookmark({ id: "abc", name: "My Site" })} onToggleFavorite={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete bookmark" }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "My Site"?');
    expect(onDelete).toHaveBeenCalledWith("abc");
  });

  it("does not call onDelete when confirm is cancelled", async () => {
    confirmSpy.mockReturnValue(false);
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<BookmarkCircle bookmark={makeBookmark()} onToggleFavorite={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete bookmark" }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("does nothing when delete is confirmed but onDelete is not provided", async () => {
    confirmSpy.mockReturnValue(true);
    const user = userEvent.setup();
    render(<BookmarkCircle bookmark={makeBookmark()} onToggleFavorite={vi.fn()} />);

    await expect(user.click(screen.getByRole("button", { name: "Delete bookmark" }))).resolves.not.toThrow();
  });

  it("marks the favorite button as active when bookmark.favorite is true", () => {
    render(<BookmarkCircle bookmark={makeBookmark({ favorite: true })} onToggleFavorite={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Toggle favorite" }).className).toContain("opacity-100");
  });
});
