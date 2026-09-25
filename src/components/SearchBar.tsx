"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  sort: "date" | "alpha";
  onSortChange: (sort: "date" | "alpha") => void;
};

export default function SearchBar({ value, onChange, sort, onSortChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search bookmarks" className="w-full rounded-full border border-white bg-transparent px-4 py-2 text-sm font-bold text-white placeholder-white outline-none focus:border-[var(--accent)]" />
      <select value={sort} onChange={(e) => onSortChange(e.target.value as "date" | "alpha")} className="rounded-full border border-white bg-[var(--bg)] px-3 py-2 text-sm font-bold text-white outline-none">
        <option value="date">Newest</option>
        <option value="alpha">A-Z</option>
      </select>
    </div>
  );
}
