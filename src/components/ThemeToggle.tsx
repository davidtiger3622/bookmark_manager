"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("bookmark-manager:theme");
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("bookmark-manager:theme", next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="text-xl leading-none text-[var(--text-dim)] transition hover:text-[var(--accent)]">
      {theme === "dark" ? "\u263E" : "\u2600"}
    </button>
  );
}
