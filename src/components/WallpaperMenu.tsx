"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loadManifest, getWallpaper, setStoredWallpaper, categoryLabel, WallpaperManifest } from "@/lib/appearance";

export default function WallpaperMenu() {
  const [open, setOpen] = useState(false);
  const [manifest, setManifest] = useState<WallpaperManifest>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState<string>("none");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWallpaper(getWallpaper());
    loadManifest().then(setManifest);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function choose(id: string) {
    setWallpaper(id);
    setStoredWallpaper(id);
    setOpen(false);
    setActiveCategory(null);
  }

  const categories = Object.keys(manifest);

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen((o) => !o)} className="whitespace-nowrap rounded-full border border-[var(--text)] bg-transparent px-5 py-2 text-sm font-bold text-[var(--text)]">
        Theme
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-[var(--text)] bg-[var(--bg-card)] p-3">
          {activeCategory === null ? (
            <>
              <button onClick={() => choose("none")} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)] ${wallpaper === "none" ? "bg-[var(--accent)] text-[var(--bg)]" : ""}`}>
                None
              </button>
              {categories.map((key) => (
                <button key={key} onClick={() => setActiveCategory(key)} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)]">
                  {categoryLabel(key)}
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={() => setActiveCategory(null)} className="mb-3 block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)]">
                &larr; Back
              </button>
              <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto">
                {manifest[activeCategory]?.map((filename) => {
                  const id = `${activeCategory}/${filename}`;
                  const url = `/wallpapers/${activeCategory}/${filename}`;
                  return (
                    <button key={id} onClick={() => choose(id)} className={`relative h-24 overflow-hidden rounded-lg border-2 ${wallpaper === id ? "border-[var(--accent)]" : "border-transparent"}`}>
                      <Image src={url} alt="" fill sizes="140px" className="object-cover" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
