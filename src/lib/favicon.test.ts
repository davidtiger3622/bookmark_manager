import { describe, expect, it } from "vitest";
import { getFaviconUrl, normalizeUrl } from "./favicon";

describe("normalizeUrl", () => {
  it("adds https:// when no protocol is present", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  it("leaves an https:// url unchanged", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("leaves an http:// url unchanged", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("is case-insensitive when detecting an existing protocol", () => {
    expect(normalizeUrl("HTTPS://example.com")).toBe("HTTPS://example.com");
  });
});

describe("getFaviconUrl", () => {
  it("builds a google favicon url from the hostname", () => {
    expect(getFaviconUrl("https://example.com/some/path")).toBe(
      "https://www.google.com/s2/favicons?domain=example.com&sz=64"
    );
  });

  it("returns an empty string for an invalid url", () => {
    expect(getFaviconUrl("not a url")).toBe("");
  });

  it("keeps the full hostname, including subdomains", () => {
    expect(getFaviconUrl("https://sub.example.com")).toBe(
      "https://www.google.com/s2/favicons?domain=sub.example.com&sz=64"
    );
  });
});
