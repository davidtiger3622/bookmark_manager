"use client";

import { useState } from "react";

type Props = {
  onAdd: (name: string, url: string) => void;
  onClose: () => void;
};

export default function AddBookmarkModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onAdd(name.trim(), url.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[var(--text)]">Save a bookmark</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-4 w-full rounded-lg border border-[var(--text)] bg-transparent px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)]" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link" className="mt-3 w-full rounded-lg border border-[var(--text)] bg-transparent px-3 py-2 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)]" />
        <div className="mt-5 flex justify-end gap-3 text-sm">
          <button type="button" onClick={onClose} className="font-bold text-[var(--text-dim)]">Cancel</button>
          <button type="submit" className="rounded-full bg-[var(--accent)] px-4 py-2 font-bold text-[var(--bg)]">Save</button>
        </div>
      </form>
    </div>
  );
}
