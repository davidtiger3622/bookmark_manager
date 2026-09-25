"use client";

import { Bookmark } from "@/lib/storage";
import BookmarkCircle from "./BookmarkCircle";

type Props = {
  bookmarks: Bookmark[];
  onToggleFavorite: (id: string) => void;
};

export default function BookmarkGrid({ bookmarks, onToggleFavorite }: Props) {
  const favorites = bookmarks.filter((b) => b.favorite);
  const rest = bookmarks.filter((b) => !b.favorite);

  return (
    <div className="mt-10 flex flex-col gap-10">
      {favorites.length > 0 && (
        <section>
          <h2 className="mb-4 inline-block rounded-full bg-[var(--bg-card)]/85 px-3 py-1 text-sm font-bold text-[var(--text)] backdrop-blur-sm">Favorites</h2>
          <div className="flex flex-wrap gap-6">
            {favorites.map((b) => (
              <BookmarkCircle key={b.id} bookmark={b} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </section>
      )}
      <section>
        {rest.length === 0 && favorites.length === 0 ? (
          <p className="inline-block rounded-full bg-[var(--bg-card)]/85 px-4 py-2 text-sm font-bold text-[var(--text)] shadow-sm backdrop-blur-sm">
            No bookmarks yet. Add your first link.
          </p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {rest.map((b) => (
              <BookmarkCircle key={b.id} bookmark={b} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
