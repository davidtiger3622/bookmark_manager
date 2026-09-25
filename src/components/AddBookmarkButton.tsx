"use client";

type Props = {
  onClick: () => void;
};

export default function AddBookmarkButton({ onClick }: Props) {
  return (
    <button onClick={onClick} className="rounded-full border border-[var(--text)] bg-[var(--accent)] px-5 py-2 text-sm font-bold text-[var(--bg)]">
      + Add
    </button>
  );
}
