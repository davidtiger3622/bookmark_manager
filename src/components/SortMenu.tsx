"use client";

import { useEffect, useRef, useState } from "react";

export type SortOption = "date" | "az" | "za";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const labels: Record<SortOption, string> = {
  date: "Date added",
  az: "A-Z",
  za: "Z-A",
};

export default function SortMenu({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen((o) => !o)} className="whitespace-nowrap rounded-full border border-[var(--text)] bg-transparent px-5 py-2 text-sm font-bold text-[var(--text)]">
        Sort
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-40 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--text)] bg-[var(--bg-card)]">
          {(Object.keys(labels) as SortOption[]).map((option) => (
            <button key={option} onClick={() => { onChange(option); setOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--bg)] ${value === option ? "bg-[var(--accent)] text-[var(--bg)]" : ""}`}>
              {labels[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
