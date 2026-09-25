"use client";

import { useEffect, useState } from "react";
import { WallpaperKey, wallpapers, getWallpaper, setStoredWallpaper } from "@/lib/appearance";

export default function WallpaperMenu() {
  const [open, setOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperKey>("none");

  useEffect(() => {
    setWallpaper(getWallpaper());
  }, []);

  function choose(key: WallpaperKey) {
    setWallpaper(key);
    setStoredWallpaper(key);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="rounded-full border border-[var(--text)] bg-[var(--bg)] px-5 py-2 text-sm font-bold text-[var(--text)]">
        Theme
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--text)] bg-[var(--bg-card)]">
          <button onClick={() => choose("none")} className={`block w-full px-4 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)] ${wallpaper === "none" ? "bg-[var(--accent)] text-[var(--bg)]" : ""}`}>
            None
          </button>
          {(Object.keys(wallpapers) as Exclude<WallpaperKey, "none">[]).map((key) => (
            <button key={key} onClick={() => choose(key)} className={`block w-full px-4 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)] ${wallpaper === key ? "bg-[var(--accent)] text-[var(--bg)]" : ""}`}>
              {wallpapers[key].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
