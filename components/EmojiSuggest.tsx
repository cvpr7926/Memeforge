"use client";

const SUGGEST = ["😂", "💀", "🔥", "👀", "✨", "💯", "🤡", "🫠", "📈", "☕", "🐱", "💼"];

type Props = {
  onInsert: (emoji: string) => void;
};

export function EmojiSuggest({ onInsert }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SUGGEST.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onInsert(e)}
          className="w-8 h-8 rounded-lg bg-smoke border border-white/10 hover:border-neon text-base transition-colors"
          aria-label={`Insert ${e}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
