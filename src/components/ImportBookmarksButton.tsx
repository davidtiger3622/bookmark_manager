"use client";

import { useRef, useState } from "react";
import { parseBookmarksHtml } from "@/lib/bookmarkImport";

type Props = {
  existingUrls: string[];
  onImport: (bookmarks: { name: string; url: string }[]) => void;
};

export default function ImportBookmarksButton({ existingUrls, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseBookmarksHtml(text);
    const existing = new Set(existingUrls.map((u) => u.toLowerCase()));
    const seen = new Set<string>();
    const newOnes = parsed.filter((b) => {
      const key = b.url.toLowerCase();
      if (existing.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    onImport(newOnes);
    setMessage(
      newOnes.length > 0
        ? `Added ${newOnes.length} new bookmark${newOnes.length === 1 ? "" : "s"}.`
        : "No new bookmarks found — everything was already saved."
    );
    e.target.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={handleClick} className="whitespace-nowrap rounded-full border border-[var(--text)] bg-transparent px-5 py-2 text-sm font-bold text-[var(--text)]">
        Import
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".html,text/html"
        onChange={handleFileChange}
        className="hidden"
        data-testid="import-file-input"
      />
      {message && <p className="max-w-xs text-xs font-bold text-[var(--text-dim)]">{message}</p>}
    </div>
  );
}
