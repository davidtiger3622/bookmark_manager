import { beforeEach, describe, expect, it } from "vitest";
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
  saveBookmarks,
  toggleFavorite,
  updateBookmark,
} from "./storage";

beforeEach(() => {
  window.localStorage.clear();
});

describe("getBookmarks", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(getBookmarks()).toEqual([]);
  });

  it("returns an empty array when stored value is invalid JSON", () => {
    window.localStorage.setItem("bookmark-manager:bookmarks", "not-json");
    expect(getBookmarks()).toEqual([]);
  });

  it("returns parsed bookmarks when present", () => {
    const bookmarks = [
      { id: "1", name: "Example", url: "https://example.com", favorite: false, createdAt: 1 },
    ];
    saveBookmarks(bookmarks);
    expect(getBookmarks()).toEqual(bookmarks);
  });
});

describe("addBookmark", () => {
  it("adds a new bookmark with generated id and createdAt", () => {
    const result = addBookmark("Example", "https://example.com");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: "Example",
      url: "https://example.com",
      favorite: false,
    });
    expect(result[0].id).toBeTruthy();
    expect(typeof result[0].createdAt).toBe("number");
  });

  it("appends to existing bookmarks rather than replacing them", () => {
    addBookmark("First", "https://first.com");
    const result = addBookmark("Second", "https://second.com");
    expect(result).toHaveLength(2);
    expect(getBookmarks()).toHaveLength(2);
  });
});

describe("deleteBookmark", () => {
  it("removes the bookmark with the matching id", () => {
    addBookmark("First", "https://first.com");
    const [toDelete] = getBookmarks();
    addBookmark("Second", "https://second.com");

    const result = deleteBookmark(toDelete.id);

    expect(result).toHaveLength(1);
    expect(result.find((b) => b.id === toDelete.id)).toBeUndefined();
  });

  it("is a no-op when the id does not exist", () => {
    addBookmark("First", "https://first.com");
    const result = deleteBookmark("nonexistent-id");
    expect(result).toHaveLength(1);
  });
});

describe("updateBookmark", () => {
  it("updates name and url for the matching id", () => {
    addBookmark("First", "https://first.com");
    const [bookmark] = getBookmarks();

    const result = updateBookmark(bookmark.id, "Updated", "https://updated.com");

    expect(result.find((b) => b.id === bookmark.id)).toMatchObject({
      name: "Updated",
      url: "https://updated.com",
    });
  });

  it("leaves other bookmarks unaffected", () => {
    addBookmark("First", "https://first.com");
    addBookmark("Second", "https://second.com");
    const [first, second] = getBookmarks();

    const result = updateBookmark(first.id, "Changed", "https://changed.com");

    expect(result.find((b) => b.id === second.id)).toMatchObject({
      name: "Second",
      url: "https://second.com",
    });
  });

  it("is a no-op when the id does not exist", () => {
    addBookmark("First", "https://first.com");
    const before = getBookmarks();

    const result = updateBookmark("nonexistent-id", "X", "https://x.com");

    expect(result).toEqual(before);
  });

  it("preserves favorite and createdAt when updating", () => {
    addBookmark("First", "https://first.com");
    const [bookmark] = getBookmarks();
    toggleFavorite(bookmark.id);
    const favorited = getBookmarks()[0];

    const result = updateBookmark(bookmark.id, "Renamed", "https://renamed.com");
    const updated = result.find((b) => b.id === bookmark.id);

    expect(updated?.favorite).toBe(true);
    expect(updated?.createdAt).toBe(favorited.createdAt);
  });
});

describe("toggleFavorite", () => {
  it("flips favorite from false to true", () => {
    addBookmark("First", "https://first.com");
    const [bookmark] = getBookmarks();

    const result = toggleFavorite(bookmark.id);

    expect(result.find((b) => b.id === bookmark.id)?.favorite).toBe(true);
  });

  it("flips favorite back to false on second call", () => {
    addBookmark("First", "https://first.com");
    const [bookmark] = getBookmarks();

    toggleFavorite(bookmark.id);
    const result = toggleFavorite(bookmark.id);

    expect(result.find((b) => b.id === bookmark.id)?.favorite).toBe(false);
  });

  it("leaves other bookmarks unaffected", () => {
    addBookmark("First", "https://first.com");
    addBookmark("Second", "https://second.com");
    const [first, second] = getBookmarks();

    const result = toggleFavorite(first.id);

    expect(result.find((b) => b.id === second.id)?.favorite).toBe(false);
  });
});
