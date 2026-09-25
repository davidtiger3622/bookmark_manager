export type ThemeMode = "dark" | "light";
export type WallpaperKey = "none" | "wildlife" | "nature" | "beach" | "cars" | "buildings" | "roads" | "space";

export const wallpapers: Record<Exclude<WallpaperKey, "none">, { label: string; url: string }> = {
  wildlife: { label: "Wildlife", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=2000&q=80" },
  nature: { label: "Nature", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" },
  beach: { label: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80" },
  cars: { label: "Cars", url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=2000&q=80" },
  buildings: { label: "Buildings", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80" },
  roads: { label: "Roads", url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=2000&q=80" },
  space: { label: "Space", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=80" },
};

const THEME_KEY = "bookmark-manager:theme";
const WALLPAPER_KEY = "bookmark-manager:wallpaper";

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function setStoredTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme);
  applyAppearance();
}

export function getWallpaper(): WallpaperKey {
  if (typeof window === "undefined") return "none";
  const stored = window.localStorage.getItem(WALLPAPER_KEY);
  return stored && stored in wallpapers ? (stored as WallpaperKey) : "none";
}

export function setStoredWallpaper(wallpaper: WallpaperKey) {
  window.localStorage.setItem(WALLPAPER_KEY, wallpaper);
  applyAppearance();
}

export function applyAppearance() {
  const theme = getTheme();
  const wallpaper = getWallpaper();
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light" && wallpaper !== "none") {
    document.body.style.backgroundImage = `url(${wallpapers[wallpaper].url})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.backgroundImage = "";
  }
}
