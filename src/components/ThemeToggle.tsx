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
    <button onClick={toggle} className="rounded-full border border-[var(--text)] bg-[var(--bg)] px-5 py-2 text-sm font-bold text-[var(--text)]">
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
