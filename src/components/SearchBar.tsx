"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search bookmarks" className="w-full rounded-full border border-[var(--text)] bg-transparent px-4 py-2 text-sm font-bold text-[var(--text)] placeholder-[var(--text)] outline-none focus:border-[var(--accent)]" />
  );
}
