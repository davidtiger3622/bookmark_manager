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

  it("drills into a category and shows its wallpaper thumbnails", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));

    expect(screen.getByText("← Back")).toBeInTheDocument();
    expect(screen.queryByText("Ocean")).not.toBeInTheDocument();
  });

  it("goes back to the category list when Back is clicked", async () => {
    const user = userEvent.setup();
    render(<WallpaperMenu />);

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await waitFor(() => screen.getByText("Nature"));
    await user.click(screen.getByText("Nature"));
    await user.click(screen.getByText("← Back"));

    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("Ocean")).toBeInTheDocument();
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
    expect(screen.queryByText("← Back")).not.toBeInTheDocument();
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

    expect(screen.queryByText("← Back")).not.toBeInTheDocument();
    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });
});
