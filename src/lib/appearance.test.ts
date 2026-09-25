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
});

describe("applyAppearance", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.body.style.backgroundImage = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets data-theme to the stored theme", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({}) }));
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("clears the background image when theme is dark", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "dark");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    expect(document.body.style.backgroundImage).toBe("");
  });

  it("clears the background image when wallpaper is 'none'", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "none");
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    expect(document.body.style.backgroundImage).toBe("");
  });

  it("sets the background image when theme is light and wallpaper is in the manifest", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) })
    );
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    expect(document.body.style.backgroundImage).toContain("/wallpapers/nature/forest.jpg");
  });

  it("clears the background image when the stored wallpaper is not in the manifest", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/missing.jpg");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) })
    );
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    expect(document.body.style.backgroundImage).toBe("");
  });

  it("caches the manifest so fetch is only called once", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ nature: ["forest.jpg"] }) });
    vi.stubGlobal("fetch", fetchMock);
    const { applyAppearance } = await import("./appearance");
    await applyAppearance();
    await applyAppearance();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to an empty manifest when the wallpaper fetch fails", async () => {
    vi.resetModules();
    window.localStorage.setItem("bookmark-manager:theme", "light");
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    const { applyAppearance } = await import("./appearance");
    await expect(applyAppearance()).resolves.not.toThrow();
    expect(document.body.style.backgroundImage).toBe("");
  });
});

describe("setStoredTheme / setStoredWallpaper", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({}) }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("persists the theme to localStorage", async () => {
    vi.resetModules();
    const { setStoredTheme } = await import("./appearance");
    setStoredTheme("light");
    expect(window.localStorage.getItem("bookmark-manager:theme")).toBe("light");
  });

  it("persists the wallpaper id to localStorage", async () => {
    vi.resetModules();
    const { setStoredWallpaper } = await import("./appearance");
    setStoredWallpaper("ocean/wave.jpg");
    expect(window.localStorage.getItem("bookmark-manager:wallpaper")).toBe("ocean/wave.jpg");
  });
});
