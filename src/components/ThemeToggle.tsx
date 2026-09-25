"use client";

import { useEffect, useState } from "react";
import { ThemeMode, getTheme, setStoredTheme, applyStoredTheme } from "@/lib/appearance";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    setTheme(getTheme());
    applyStoredTheme();
  }, []);

  function toggle() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
  }

  return (
    <button onClick={toggle} className="whitespace-nowrap rounded-full border border-[var(--text)] bg-transparent px-5 py-2 text-sm font-bold text-[var(--text)]">
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
