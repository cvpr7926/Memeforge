"use client";

import { STICKER_PACK } from "@/lib/stickers";
import type { StickerPlacement } from "@/lib/types";

type Props = {
  stickers: StickerPlacement[];
  onChange: (s: StickerPlacement[]) => void;
};

export function StickerBar({ stickers, onChange }: Props) {
  const add = (emoji: string) => {
    onChange([
      ...stickers,
      { emoji, x: 0.5 + (Math.random() - 0.5) * 0.2, y: 0.5 + (Math.random() - 0.5) * 0.2, scale: 1 },
    ]);
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-paper/40">
        Stickers & emoji layer
      </p>
      <div className="flex flex-wrap gap-1.5">
        {STICKER_PACK.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => add(e)}
            className="w-9 h-9 rounded-lg bg-ink/60 border border-white/10 hover:border-neon hover:scale-110 transition-all text-lg"
          >
            {e}
          </button>
        ))}
      </div>
      {stickers.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs text-punch hover:underline"
        >
          Clear stickers ({stickers.length})
        </button>
      )}
    </div>
  );
}
