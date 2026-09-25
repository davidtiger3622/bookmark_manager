export type ThemeMode = "dark" | "light";
export type WallpaperManifest = Record<string, string[]>;

const THEME_KEY = "bookmark-manager:theme";
const WALLPAPER_KEY = "bookmark-manager:wallpaper";

let manifestCache: WallpaperManifest | null = null;

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

export function setStoredTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme);
  void applyAppearance();
}

export function getWallpaper(): string {
  if (typeof window === "undefined") return "none";
  return window.localStorage.getItem(WALLPAPER_KEY) ?? "none";
}

export function setStoredWallpaper(id: string) {
  window.localStorage.setItem(WALLPAPER_KEY, id);
  void applyAppearance();
}

export async function applyAppearance() {
  const theme = getTheme();
  const wallpaperId = getWallpaper();
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "light" && wallpaperId !== "none") {
    const [category, filename] = wallpaperId.split("/");
    const manifest = await loadManifest();
    if (manifest[category]?.includes(filename)) {
      const url = `/wallpapers/${category}/${filename}`;
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      return;
    }
  }
  document.body.style.backgroundImage = "";
}
