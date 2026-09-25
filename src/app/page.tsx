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
      className="relative flex min-h-screen w-full items-center justify-center px-6 sm:justify-start sm:pl-16 lg:pl-24"
      style={{ backgroundImage: "url(/wallpapers/wildlife/bird.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
          Bookmark Manager
        </h1>
        <p className="mt-4 max-w-md font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
          Save your links, keep them organized, find them again in seconds.
        </p>
        <Link
          href="/bookmarks"
          className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-white bg-black/30 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
        >
          Open your bookmarks
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
