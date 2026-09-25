"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, getBookmarks, addBookmark, toggleFavorite } from "@/lib/storage";
import { normalizeUrl } from "@/lib/favicon";
import SearchBar from "@/components/SearchBar";
import BookmarkGrid from "@/components/BookmarkGrid";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import ThemeToggle from "@/components/ThemeToggle";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"date" | "alpha">("date");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleAdd(name: string, url: string) {
    setBookmarks(addBookmark(name, normalizeUrl(url)));
  }

  function handleToggleFavorite(id: string) {
    setBookmarks(toggleFavorite(id));
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = bookmarks.filter(
      (b) => b.name.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) =>
      sort === "alpha" ? a.name.localeCompare(b.name) : b.createdAt - a.createdAt
    );
  }, [bookmarks, query, sort]);

  return (
    <main className="w-full px-10 py-10">
      <div className="flex items-center justify-end gap-4">
        <button onClick={() => setShowModal(true)} aria-label="Add bookmark" className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-[var(--bg)]">+</button>
        <ThemeToggle />
      </div>
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Link href="/" className="text-xl font-bold text-white">Bookmark Manager</Link>
        <div className="mt-6 w-full">
          <SearchBar value={query} onChange={setQuery} sort={sort} onSortChange={setSort} />
        </div>
      </div>
      <BookmarkGrid bookmarks={filtered} onToggleFavorite={handleToggleFavorite} />
      {showModal && <AddBookmarkModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </main>
  );
}
