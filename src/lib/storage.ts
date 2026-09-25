export type Bookmark = {
  id: string;
  name: string;
  url: string;
  favorite: boolean;
  createdAt: number;
};

const STORAGE_KEY = "bookmark-manager:bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function addBookmark(name: string, url: string): Bookmark[] {
  const bookmarks = getBookmarks();
  const next: Bookmark = {
    id: crypto.randomUUID(),
    name,
    url,
    favorite: false,
    createdAt: Date.now(),
  };
  const updated = [...bookmarks, next];
  saveBookmarks(updated);
  return updated;
}

export function deleteBookmark(id: string): Bookmark[] {
  const updated = getBookmarks().filter((b) => b.id !== id);
  saveBookmarks(updated);
  return updated;
}

export function updateBookmark(id: string, name: string, url: string): Bookmark[] {
  const updated = getBookmarks().map((b) =>
    b.id === id ? { ...b, name, url } : b
  );
  saveBookmarks(updated);
  return updated;
}

export function toggleFavorite(id: string): Bookmark[] {
  const updated = getBookmarks().map((b) =>
    b.id === id ? { ...b, favorite: !b.favorite } : b
  );
  saveBookmarks(updated);
  return updated;
}
