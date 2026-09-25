"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, getBookmarks, addBookmark, deleteBookmark, updateBookmark, toggleFavorite } from "@/lib/storage";
import { normalizeUrl } from "@/lib/favicon";
import { applyStoredTheme, getWallpaperUrl, subscribeAppearance } from "@/lib/appearance";
import SearchBar from "@/components/SearchBar";
import SortMenu, { SortOption } from "@/components/SortMenu";
import AddBookmarkButton from "@/components/AddBookmarkButton";
import ThemeToggle from "@/components/ThemeToggle";
import WallpaperMenu from "@/components/WallpaperMenu";
import BookmarkGrid from "@/components/BookmarkGrid";
import AddBookmarkModal from "@/components/AddBookmarkModal";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("date");
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
    applyStoredTheme();

    function refreshWallpaper() {
      getWallpaperUrl().then(setWallpaperUrl);
    }
    refreshWallpaper();
    return subscribeAppearance(refreshWallpaper);
  }, []);

  function handleSave(name: string, url: string) {
    if (editingBookmark) {
      setBookmarks(updateBookmark(editingBookmark.id, name, normalizeUrl(url)));
      setEditingBookmark(null);
    } else {
      setBookmarks(addBookmark(name, normalizeUrl(url)));
    }
  }

  function handleDelete(id: string) {
    setBookmarks(deleteBookmark(id));
  }

  function handleEdit(bookmark: Bookmark) {
    setEditingBookmark(bookmark);
    setShowModal(true);
  }

  function handleToggleFavorite(id: string) {
    setBookmarks(toggleFavorite(id));
  }

  function closeModal() {
    setShowModal(false);
    setEditingBookmark(null);
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
    <div
      className="min-h-screen w-full"
      style={wallpaperUrl ? { backgroundImage: `url(${wallpaperUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : undefined}
    >
      <main className="w-full px-4 py-6 sm:px-10 sm:py-10">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-[var(--bg-card)]/85 px-4 py-5 text-center shadow-lg backdrop-blur-md sm:px-6">
          <Link href="/" className="text-xl font-bold text-[var(--text)]">Bookmark Manager</Link>
          <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3">
            <AddBookmarkButton onClick={() => setShowModal(true)} />
            <SortMenu value={sort} onChange={setSort} />
            <ThemeToggle />
            <WallpaperMenu />
          </div>
          <div className="mt-3 w-full max-w-xs">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <p className="mt-3 text-xs font-bold text-[var(--text-dim)]">
            Wallpapers show in light mode only. Dark mode overrides them.
          </p>
        </div>
        <BookmarkGrid bookmarks={filtered} onToggleFavorite={handleToggleFavorite} onDelete={handleDelete} onEdit={handleEdit} />
        {showModal && <AddBookmarkModal bookmark={editingBookmark} onSave={handleSave} onClose={closeModal} />}
      </main>
    </div>
  );
}
