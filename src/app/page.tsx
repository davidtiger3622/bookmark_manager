import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">Bookmark Manager</h1>
      <p className="mt-4 max-w-md text-[var(--text-dim)]">
        Save your links, keep them organized, find them again in seconds.
      </p>
      <Link
        href="/bookmarks"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-6 py-3 text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-[var(--bg)]"
      >
        Open your bookmarks
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </main>
  );
}
