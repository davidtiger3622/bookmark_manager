export type ParsedBookmark = { name: string; url: string };

export function parseBookmarksHtml(html: string): ParsedBookmark[] {
  if (typeof window === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = Array.from(doc.querySelectorAll("a[href]"));
  const results: ParsedBookmark[] = [];
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (!href || !/^https?:\/\//i.test(href)) continue;
    const name = a.textContent?.trim() || href;
    results.push({ name, url: href });
  }
  return results;
}
