"use client";

import { useState } from "react";
import type { Bookmark } from "@/lib/storage";

type Props = {
  bookmark?: Bookmark | null;
  onAdd: (name: string, url: string) => void;
  onEdit?: (id: string, name: string, url: string) => void;
  onClose: () => void;
};

export default function AddBookmarkModal({ bookmark, onAdd, onEdit, onClose }: Props) {
  const [name, setName] = useState(bookmark?.name ?? "");
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const isEdit = !!bookmark;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;

    if (isEdit) {
      if (onEdit) {
        onEdit(bookmark.id, trimmedName, trimmedUrl);
      } else {
        onAdd(trimmedName, trimmedUrl);
      }
    } else {
      onAdd(trimmedName, trimmedUrl);
    }
    onClose();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[var(--text)]">{isEdit ? "Edit bookmark" : "Save a bookmark"}</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-4 w-full rounded-lg border border-[var(--text)] bg-transparent px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)]" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link" className="mt-3 w-full rounded-lg border border-[var(--text)] bg-transparent px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)]" />
        <div className="mt-5 flex justify-end gap-3 text-sm">
          <button type="button" onClick={onClose} className="font-bold text-[var(--text-dim)]">Cancel</button>
          <button type="submit" className="rounded-full bg-[var(--accent)] px-4 py-2 font-bold text-[var(--bg)]">{isEdit ? "Save changes" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
