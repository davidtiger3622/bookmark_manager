"use client";

import { Bookmark } from "@/lib/storage";
import BookmarkCircle from "./BookmarkCircle";

type Props = {
  bookmarks: Bookmark[];
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (bookmark: Bookmark) => void;
};

export default function BookmarkGrid({ bookmarks, onToggleFavorite, onDelete, onEdit }: Props) {
  const favorites = bookmarks.filter((b) => b.favorite);
  const rest = bookmarks.filter((b) => !b.favorite);

  return (
    <div className="mt-10 flex flex-col gap-10">
      {favorites.length > 0 && (
        <section>
          <h2 className="mb-4 inline-block rounded-full bg-[var(--bg-card)]/85 px-3 py-1 text-sm font-bold text-[var(--text)] shadow-sm backdrop-blur-sm">
            Favorites
          </h2>
          <div className="flex flex-wrap gap-6">
            {favorites.map((b) => (
              <BookmarkCircle key={b.id} bookmark={b} onToggleFavorite={onToggleFavorite} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </section>
      )}
      <section>
        {rest.length === 0 && favorites.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)]">No bookmarks yet. Add your first link.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {rest.map((b) => (
              <BookmarkCircle key={b.id} bookmark={b} onToggleFavorite={onToggleFavorite} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
