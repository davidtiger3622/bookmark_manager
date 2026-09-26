import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImportBookmarksButton from "./ImportBookmarksButton";

function makeFile(html: string) {
  return new File([html], "bookmarks.html", { type: "text/html" });
}

describe("ImportBookmarksButton", () => {
  it("clicking the Import button opens the hidden file picker", async () => {
    const user = userEvent.setup();
    render(<ImportBookmarksButton existingUrls={[]} onImport={vi.fn()} />);

    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");

    await user.click(screen.getByRole("button", { name: "Import" }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it("imports only urls not already present", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportBookmarksButton existingUrls={["https://old.com"]} onImport={onImport} />);

    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    const file = makeFile(`<a href="https://old.com">Old</a><a href="https://new.com">New</a>`);
    await user.upload(input, file);

    expect(onImport).toHaveBeenCalledWith([{ name: "New", url: "https://new.com" }]);
    expect(await screen.findByText("Added 1 new bookmark.")).toBeInTheDocument();
  });

  it("shows a no-new-bookmarks message when everything is a duplicate", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportBookmarksButton existingUrls={["https://old.com"]} onImport={onImport} />);

    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    const file = makeFile(`<a href="https://old.com">Old</a>`);
    await user.upload(input, file);

    expect(onImport).toHaveBeenCalledWith([]);
    expect(await screen.findByText("No new bookmarks found — everything was already saved.")).toBeInTheDocument();
  });

  it("deduplicates repeated urls within the imported file itself", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportBookmarksButton existingUrls={[]} onImport={onImport} />);

    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    const file = makeFile(`<a href="https://dup.com">Dup 1</a><a href="https://dup.com">Dup 2</a>`);
    await user.upload(input, file);

    expect(onImport).toHaveBeenCalledWith([{ name: "Dup 1", url: "https://dup.com" }]);
  });

  it("does nothing when no file is selected", async () => {
    const onImport = vi.fn();
    render(<ImportBookmarksButton existingUrls={[]} onImport={onImport} />);
    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onImport).not.toHaveBeenCalled();
  });
});
