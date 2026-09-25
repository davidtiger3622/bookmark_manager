"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, getBookmarks, addBookmark, toggleFavorite } from "@/lib/storage";
import { normalizeUrl } from "@/lib/favicon";
import SearchBar from "@/components/SearchBar";
import SortMenu, { SortOption } from "@/components/SortMenu";
import AddBookmarkButton from "@/components/AddBookmarkButton";
import ThemeToggle from "@/components/ThemeToggle";
import BookmarkGrid from "@/components/BookmarkGrid";
import AddBookmarkModal from "@/components/AddBookmarkModal";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("date");
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
    return [...list].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return b.createdAt - a.createdAt;
    });
  }, [bookmarks, query, sort]);

  return (
    <main className="w-full px-10 py-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Link href="/" className="text-xl font-bold text-[var(--text)]">Bookmark Manager</Link>
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <AddBookmarkButton onClick={() => setShowModal(true)} />
          <div className="max-w-xs flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <SortMenu value={sort} onChange={setSort} />
          <ThemeToggle />
        </div>
      </div>
      <BookmarkGrid bookmarks={filtered} onToggleFavorite={handleToggleFavorite} />
      {showModal && <AddBookmarkModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </main>
  );
}
