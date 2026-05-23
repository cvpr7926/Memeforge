"use client";

import type { TextStyle } from "@/lib/types";

type Props = {
  activeLineIndex: number;
  styles: TextStyle[];
  onStyleChange: (index: number, style: TextStyle) => void;
};

const COLOR_PRESETS = ["#FFFFFF", "#FFFF00", "#FF6B6B", "#51CF66", "#4DABF7", "#F0A"];

export function TextFormatPanel({ activeLineIndex, styles, onStyleChange }: Props) {
  const style = styles[activeLineIndex] ?? {};

  return (
    <div className="rounded-xl bg-ink/60 border border-white/10 p-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-paper/50">Text Formatting</p>

      {/* Font Size Slider */}
      <div>
        <label className="text-[11px] text-paper/40 uppercase">Size</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="range"
            min={0.7}
            max={1.5}
            step={0.1}
            value={style.fontSize ?? 1}
            onChange={(e) => {
              const newStyle = { ...style, fontSize: Number(e.target.value) };
              onStyleChange(activeLineIndex, newStyle);
            }}
            className="flex-1 h-2 rounded accent-neon"
          />
          <span className="text-xs text-neon font-semibold w-10">{((style.fontSize ?? 1) * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="text-[11px] text-paper/40 uppercase">Color</label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                const newStyle = { ...style, color };
                onStyleChange(activeLineIndex, newStyle);
              }}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                (style.color ?? "#FFFFFF") === color ? "border-neon shadow-neon" : "border-white/20 hover:border-neon/50"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <input
            type="color"
            value={style.color ?? "#FFFFFF"}
            onChange={(e) => {
              const newStyle = { ...style, color: e.target.value };
              onStyleChange(activeLineIndex, newStyle);
            }}
            className="w-8 h-8 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
