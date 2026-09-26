import { describe, expect, it } from "vitest";
import { parseBookmarksHtml } from "./bookmarkImport";

describe("parseBookmarksHtml", () => {
  it("extracts http(s) links with their link text as name", () => {
    const html = `<a href="https://a.com">A Site</a><a href="https://b.com">B Site</a>`;
    expect(parseBookmarksHtml(html)).toEqual([
      { name: "A Site", url: "https://a.com" },
      { name: "B Site", url: "https://b.com" },
    ]);
  });

  it("ignores non-http(s) links like javascript: or mailto:", () => {
    const html = `<a href="javascript:void(0)">JS</a><a href="mailto:a@b.com">Mail</a><a href="https://ok.com">OK</a>`;
    expect(parseBookmarksHtml(html)).toEqual([{ name: "OK", url: "https://ok.com" }]);
  });

  it("falls back to the url as name when link text is empty", () => {
    const html = `<a href="https://noname.com"></a>`;
    expect(parseBookmarksHtml(html)).toEqual([{ name: "https://noname.com", url: "https://noname.com" }]);
  });

  it("returns an empty array for html with no links", () => {
    expect(parseBookmarksHtml("<p>no links here</p>")).toEqual([]);
  });
});
