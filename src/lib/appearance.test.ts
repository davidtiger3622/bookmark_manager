import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("categoryLabel", () => {
  it("capitalizes the first letter", async () => {
    const { categoryLabel } = await import("./appearance");
    expect(categoryLabel("nature")).toBe("Nature");
  });

  it("leaves an already-capitalized key looking correct", async () => {
    const { categoryLabel } = await import("./appearance");
    expect(categoryLabel("Ocean")).toBe("Ocean");
  });
});

describe("theme storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when nothing stored", async () => {
    vi.resetModules();
    const { getTheme } = await import("./appearance");
    expect(getTheme()).toBe("dark");
  });

  it("returns light only when explicitly stored as light", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    const { getTheme } = await import("./appearance");
    expect(getTheme()).toBe("light");
  });

  it("treats any non-light value as dark", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "garbage");
    const { getTheme } = await import("./appearance");
    expect(getTheme()).toBe("dark");
  });

  it("setStoredTheme persists and sets data-theme", async () => {
    vi.resetModules();
    const { setStoredTheme } = await import("./appearance");
    setStoredTheme("light");
    expect(window.localStorage.getItem("bookmark-manager:theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("applyStoredTheme sets data-theme from whatever is stored", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    const { applyStoredTheme } = await import("./appearance");
    applyStoredTheme();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});

describe("wallpaper storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to 'none' when nothing stored", async () => {
    vi.resetModules();
    const { getWallpaper } = await import("./appearance");
    expect(getWallpaper()).toBe("none");
  });

  it("returns the stored wallpaper id", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const { getWallpaper } = await import("./appearance");
    expect(getWallpaper()).toBe("nature/forest.jpg");
  });

  it("setStoredWallpaper persists the wallpaper id", async () => {
    vi.resetModules();
    const { setStoredWallpaper } = await import("./appearance");
    setStoredWallpaper("ocean/wave.jpg");
    expect(window.localStorage.getItem("bookmark-manager:wallpaper")).toBe("ocean/wave.jpg");
  });
});

describe("getWallpaperUrl", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when theme is dark, even with a wallpaper stored", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "dark");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const { getWallpaperUrl } = await import("./appearance");
    expect(await getWallpaperUrl()).toBeNull();
  });

  it("returns null when wallpaper is 'none'", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "none");
    const { getWallpaperUrl } = await import("./appearance");
    expect(await getWallpaperUrl()).toBeNull();
  });

  it("returns the url when theme is light and wallpaper is in the manifest", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) })
    );
    const { getWallpaperUrl } = await import("./appearance");
    expect(await getWallpaperUrl()).toBe("/wallpapers/nature/forest.jpg");
  });

  it("returns null when the stored wallpaper is not in the manifest", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/missing.jpg");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) })
    );
    const { getWallpaperUrl } = await import("./appearance");
    expect(await getWallpaperUrl()).toBeNull();
  });

  it("caches the manifest so fetch is only called once", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) });
    vi.stubGlobal("fetch", fetchMock);
    const { getWallpaperUrl } = await import("./appearance");
    await getWallpaperUrl();
    await getWallpaperUrl();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to an empty manifest when the wallpaper fetch fails", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    const { getWallpaperUrl } = await import("./appearance");
    await expect(getWallpaperUrl()).resolves.toBeNull();
  });
});

describe("subscribeAppearance", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("notifies subscribers when the theme changes", async () => {
    vi.resetModules();
    const { subscribeAppearance, setStoredTheme } = await import("./appearance");
    const listener = vi.fn();
    const unsubscribe = subscribeAppearance(listener);
    setStoredTheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    setStoredTheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies subscribers when the wallpaper changes", async () => {
    vi.resetModules();
    const { subscribeAppearance, setStoredWallpaper } = await import("./appearance");
    const listener = vi.fn();
    subscribeAppearance(listener);
    setStoredWallpaper("cars/car1.jpg");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("calling the same unsubscribe function twice does not throw and only removes it once", async () => {
    vi.resetModules();
    const { subscribeAppearance, setStoredTheme } = await import("./appearance");
    const listener = vi.fn();
    const unsubscribe = subscribeAppearance(listener);
    unsubscribe();
    expect(() => unsubscribe()).not.toThrow();
    setStoredTheme("light");
    expect(listener).not.toHaveBeenCalled();
  });
});
