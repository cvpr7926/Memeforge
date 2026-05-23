"use client";

import { SAMPLE_PHOTOS } from "@/lib/sample-photos";

type Props = {
  onPick: (dataUrl: string) => void;
  disabled?: boolean;
};

export function SamplePhotos({ onPick, disabled }: Props) {
  const load = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onPick(reader.result);
    };
    reader.readAsDataURL(blob);
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-paper/40">Try a sample</p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PHOTOS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => load(p.url)}
            className="text-xs font-semibold px-3 py-2 rounded-full border border-white/10 bg-smoke/50 hover:border-neon/50 disabled:opacity-50 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
