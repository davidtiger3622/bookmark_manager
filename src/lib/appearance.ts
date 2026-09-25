export type ThemeMode = "dark" | "light";
export type WallpaperManifest = Record<string, string[]>;

const THEME_KEY = "bookmark-manager:theme";
const WALLPAPER_KEY = "bookmark-manager:wallpaper";

let manifestCache: WallpaperManifest | null = null;
type Listener = () => void;
const listeners: Listener[] = [];

export function subscribeAppearance(listener: Listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) listeners.splice(index, 1);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function resetWallpaperManifestCache() {
  manifestCache = null;
}

export async function loadManifest(): Promise<WallpaperManifest> {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch("/wallpapers/manifest.json");
    manifestCache = await res.json();
  } catch {
    manifestCache = {};
  }
  return manifestCache as WallpaperManifest;
}

export function categoryLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function applyStoredTheme() {
  document.documentElement.setAttribute("data-theme", getTheme());
}

export function setStoredTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
  notify();
}

export function getWallpaper(): string {
  if (typeof window === "undefined") return "none";
  return window.localStorage.getItem(WALLPAPER_KEY) ?? "none";
}

export function setStoredWallpaper(id: string) {
  window.localStorage.setItem(WALLPAPER_KEY, id);
  notify();
}

export async function getWallpaperUrl(): Promise<string | null> {
  const theme = getTheme();
  const wallpaperId = getWallpaper();
  if (theme !== "light" || wallpaperId === "none") return null;
  const [category, filename] = wallpaperId.split("/");
  const manifest = await loadManifest();
  if (manifest[category]?.includes(filename)) {
    return `/wallpapers/${category}/${filename}`;
  }
  return null;
}
