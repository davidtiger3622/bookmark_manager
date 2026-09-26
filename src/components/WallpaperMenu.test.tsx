import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import WallpaperMenu from "./WallpaperMenu";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

const manifest = {
  nature: ["forest.jpg", "beach.jpg"],
  ocean: ["wave.jpg"],
};

describe("WallpaperMenu", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => manifest }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not show the menu until the Theme button is clicked", () => {
    render(<WallpaperMenu />);
    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("shows None and the categories once opened and the manifest loads", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));

    expect(screen.getByText("None")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Nature")).toBeInTheDocument();
      expect(screen.getByText("Ocean")).toBeInTheDocument();
    });
  });

  it("selects None and persists it", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await user.click(screen.getByText("None"));

    expect(window.localStorage.getItem("bookmark-manager:wallpaper")).toBe("none");
    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("does not highlight None when a wallpaper is already selected", async () => {
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));

    expect(screen.getByText("None").classList.contains("bg-[var(--accent)]")).toBe(false);
  });

  it("shows a prompt to pick a category before any category is selected", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));

    expect(screen.getByText("Pick a category to see wallpapers.")).toBeInTheDocument();
  });

  it("clicking a category shows its thumbnails while keeping the category list visible", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));

    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.queryByText("Pick a category to see wallpapers.")).not.toBeInTheDocument();
  });

  it("switching categories replaces the thumbnails shown", async () => {
    const user = userEvent.setup();
    const { container } = render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));
    expect(container.querySelector('img[src="/wallpapers/nature/forest.jpg"]')).toBeInTheDocument();

    await user.click(screen.getByText("Ocean"));
    expect(container.querySelector('img[src="/wallpapers/ocean/wave.jpg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/wallpapers/nature/forest.jpg"]')).not.toBeInTheDocument();
  });

  it("chooses a wallpaper, persists it, and closes the menu", async () => {
    const user = userEvent.setup();
    const { container } = render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));

    const thumbnail = container.querySelector('img[src="/wallpapers/nature/forest.jpg"]')!.closest("button")!;
    await user.click(thumbnail);

    expect(window.localStorage.getItem("bookmark-manager:wallpaper")).toBe("nature/forest.jpg");
    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("highlights only the currently selected wallpaper thumbnail", async () => {
    window.localStorage.setItem("bookmark-manager:wallpaper", "nature/forest.jpg");
    const user = userEvent.setup();
    const { container } = render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));

    const selected = container.querySelector('img[src="/wallpapers/nature/forest.jpg"]')!.closest("button")!;
    const other = container.querySelector('img[src="/wallpapers/nature/beach.jpg"]')!.closest("button")!;

    expect(selected.className).toContain("border-[var(--accent)]");
    expect(other.className).toContain("border-transparent");
  });

  it("closes the menu and resets category when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <WallpaperMenu />
        <div data-testid="outside">Outside</div>
      </div>
    );

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));

    await user.click(screen.getByTestId("outside"));

    expect(screen.queryByText("None")).not.toBeInTheDocument();
    expect(screen.queryByText("Pick a category to see wallpapers.")).not.toBeInTheDocument();
  });
});
