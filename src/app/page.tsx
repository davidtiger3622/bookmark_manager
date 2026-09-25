"use client";

import { useEffect } from "react";
import Link from "next/link";
import { applyStoredTheme } from "@/lib/appearance";

export default function Home() {
  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center px-6"
      style={{ backgroundImage: "url(/wallpapers/wildlife/flamingo.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="flex flex-col items-center rounded-3xl bg-[var(--bg-card)]/85 px-8 py-10 text-center shadow-lg backdrop-blur-md">
        <h1 className="text-5xl font-bold tracking-tight text-[var(--text)]">Bookmark Manager</h1>
        <p className="mt-4 max-w-md font-bold text-[var(--text-dim)]">
          Save your links, keep them organized, find them again in seconds.
        </p>
        <Link
          href="/bookmarks"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-6 py-3 font-bold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-[var(--bg)]"
        >
          Open your bookmarks
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
