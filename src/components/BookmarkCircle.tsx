"use client";

import { Bookmark } from "@/lib/storage";
import { getFaviconUrl } from "@/lib/favicon";

type Props = {
  bookmark: Bookmark;
  onToggleFavorite: (id: string) => void;
};

export default function BookmarkCircle({ bookmark, onToggleFavorite }: Props) {
  return (
    <div className="group flex w-20 flex-col items-center gap-2">
      <div className="relative">
        <button onClick={() => window.open(bookmark.url, "_blank", "noopener,noreferrer")} className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-card)] shadow-sm transition hover:scale-105">
          <img src={getFaviconUrl(bookmark.url)} alt="" className="h-8 w-8" />
        </button>
        <button onClick={() => onToggleFavorite(bookmark.id)} aria-label="Toggle favorite" className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] text-xs opacity-0 shadow transition group-hover:opacity-100 ${bookmark.favorite ? "opacity-100 text-red-500" : "text-[var(--text-dim)]"}`}>
          &#9829;
        </button>
      </div>
      <span className="w-full truncate text-center text-xs text-[var(--text-dim)]">{bookmark.name}</span>
    </div>
  );
}
