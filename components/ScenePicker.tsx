"use client";

import { SCENE_LABELS } from "@/lib/scenes";
import type { SceneId } from "@/lib/types";

const SCENES: SceneId[] = ["none", "void", "sunset", "office", "matrix"];

type Props = {
  value: SceneId;
  onChange: (s: SceneId) => void;
};

export function ScenePicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-paper/40">
        Scene (fake background removal)
      </p>
      <div className="flex flex-wrap gap-2">
        {SCENES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              value === s ? "bg-neon text-ink border-neon" : "border-white/15 text-paper/60 hover:border-neon/40"
            }`}
          >
            {SCENE_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
