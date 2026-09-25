import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import BookmarksPage from "./page";
import type { Bookmark } from "@/lib/storage";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

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

const STORAGE_KEY = "bookmark-manager:bookmarks";

function seedBookmarks(bookmarks: Bookmark[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

function makeStoredBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
  return {
    id: overrides.id ?? "1",
    name: overrides.name ?? "Example",
    url: overrides.url ?? "https://example.com",
    favorite: overrides.favorite ?? false,
    createdAt: overrides.createdAt ?? Date.now(),
  };
}

describe("BookmarksPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({}) }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the empty state when there are no bookmarks", () => {
    render(<BookmarksPage />);
    expect(screen.getByText("No bookmarks yet. Add your first link.")).toBeInTheDocument();
  });

  it("loads existing bookmarks from storage on mount", () => {
    seedBookmarks([
      makeStoredBookmark({ id: "1", name: "First" }),
      makeStoredBookmark({ id: "2", name: "Second" }),
    ]);

    render(<BookmarksPage />);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("adds a bookmark through the modal and normalizes a bare url", async () => {
    const user = userEvent.setup();
    render(<BookmarksPage />);

    await user.click(screen.getByRole("button", { name: "+ Add" }));
    await user.type(screen.getByPlaceholderText("Name"), "Example");
    await user.type(screen.getByPlaceholderText("Link"), "example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Example")).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].url).toBe("https://example.com");
  });

  it("edits an existing bookmark through the modal", async () => {
    seedBookmarks([makeStoredBookmark({ id: "1", name: "Old", url: "https://old.com" })]);
    const user = userEvent.setup();
    render(<BookmarksPage />);

    await user.click(screen.getByRole("button", { name: "Edit bookmark" }));
    const nameInput = screen.getByPlaceholderText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("New Name")).toBeInTheDocument();
    expect(screen.queryByText("Old")).not.toBeInTheDocument();
  });

  it("deletes a bookmark after confirming", async () => {
    seedBookmarks([makeStoredBookmark({ id: "1", name: "First" })]);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<BookmarksPage />);

    await user.click(screen.getByRole("button", { name: "Delete bookmark" }));

    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")).toHaveLength(0);
    confirmSpy.mockRestore();
  });

  it("toggles favorite and moves the bookmark into the Favorites section", async () => {
    seedBookmarks([makeStoredBookmark({ id: "1", name: "First", favorite: false })]);
    const user = userEvent.setup();
    render(<BookmarksPage />);

    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Toggle favorite" }));

    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("filters bookmarks by the search query", async () => {
    seedBookmarks([
      makeStoredBookmark({ id: "1", name: "Alpha", url: "https://alpha.com" }),
      makeStoredBookmark({ id: "2", name: "Beta", url: "https://beta.com" }),
    ]);
    const user = userEvent.setup();
    render(<BookmarksPage />);

    await user.type(screen.getByPlaceholderText("Search bookmarks"), "alpha");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("re-sorts bookmarks alphabetically when A-Z is selected", async () => {
    seedBookmarks([
      makeStoredBookmark({ id: "1", name: "Zeta", url: "https://zeta.com", createdAt: 2 }),
      makeStoredBookmark({ id: "2", name: "Alpha", url: "https://alpha.com", createdAt: 1 }),
    ]);
    const user = userEvent.setup();
    const { container } = render(<BookmarksPage />);

    await screen.findByText("Zeta");
    // default sort is by date added (newest first)
    expect(container.textContent!.indexOf("Zeta")).toBeLessThan(
      container.textContent!.indexOf("Alpha")
    );

    await user.click(screen.getByRole("button", { name: "Sort" }));
    await user.click(screen.getByText("A-Z"));

    await waitFor(() => {
      expect(container.textContent!.indexOf("Alpha")).toBeLessThan(
        container.textContent!.indexOf("Zeta")
      );
    });
  });

  it("re-sorts bookmarks in reverse alphabetical order when Z-A is selected", async () => {
    seedBookmarks([
      makeStoredBookmark({ id: "1", name: "Alpha", url: "https://alpha.com", createdAt: 1 }),
      makeStoredBookmark({ id: "2", name: "Zeta", url: "https://zeta.com", createdAt: 2 }),
    ]);
    const user = userEvent.setup();
    const { container } = render(<BookmarksPage />);

    await screen.findByText("Zeta");

    await user.click(screen.getByRole("button", { name: "Sort" }));
    await user.click(screen.getByText("Z-A"));

    await waitFor(() => {
      expect(container.textContent!.indexOf("Zeta")).toBeLessThan(
        container.textContent!.indexOf("Alpha")
      );
    });
  });
});
