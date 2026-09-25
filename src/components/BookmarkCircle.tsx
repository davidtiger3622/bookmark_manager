"use client";

import Image from "next/image";
import { Bookmark } from "@/lib/storage";
import { getFaviconUrl } from "@/lib/favicon";

type Props = {
  bookmark: Bookmark;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (bookmark: Bookmark) => void;
};

export default function BookmarkCircle({ bookmark, onToggleFavorite, onDelete, onEdit }: Props) {
  function open() {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  }

  function handleDelete() {
    if (window.confirm(`Delete "${bookmark.name}"?`)) {
      onDelete?.(bookmark.id);
    }
  }

  return (
    <div className="group flex w-20 flex-col items-center gap-2">
      <div className="relative">
        <button onClick={open} className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-card)] shadow-md transition hover:scale-105">
          <Image src={getFaviconUrl(bookmark.url)} alt="" width={32} height={32} className="h-8 w-8" unoptimized />
        </button>
        <button onClick={() => onEdit?.(bookmark)} aria-label="Edit bookmark" className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] text-sm text-blue-600 opacity-0 shadow transition group-hover:opacity-100">
          &#9998;
        </button>
        <button onClick={() => onToggleFavorite(bookmark.id)} aria-label="Toggle favorite" className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] text-sm opacity-0 shadow transition group-hover:opacity-100 ${bookmark.favorite ? "opacity-100 text-red-500" : "text-slate-500"}`}>
          &#9829;
        </button>
        <button onClick={handleDelete} aria-label="Delete bookmark" className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] text-sm text-red-600 opacity-0 shadow transition group-hover:opacity-100">
          &#128465;
        </button>
      </div>
      <button onClick={open} className="w-full truncate rounded-full bg-[var(--bg-card)]/85 px-2 py-0.5 text-center text-xs font-bold text-[var(--text)] shadow-sm backdrop-blur-sm">
        {bookmark.name}
      </button>
    </div>
  );
}
