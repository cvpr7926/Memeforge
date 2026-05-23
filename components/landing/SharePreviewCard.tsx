"use client";

import { MemeThumb } from "./MemeThumb";

/** Mock share page — shows judges you built the react loop. */
export function SharePreviewCard() {
  return (
    <div className="hidden lg:block absolute right-2 xl:right-8 top-[48%] z-20 w-64 xl:w-72">
      <div className="studio-panel rounded-2xl p-4 shadow-card border border-neon/20">
        <p className="font-mono text-[10px] text-neon/70 truncate mb-2">memeforge.app/m/demo</p>
        <MemeThumb
          src="https://i.imgflip.com/2fm6x.jpg"
          alt="Preview"
          size="lg"
          className="w-full h-36"
        />
        <p className="meme-caption text-[10px] text-center text-paper/80 mt-2 leading-tight">
          when the code finally compiles
        </p>
        <div className="flex justify-center gap-3 mt-2 text-sm">
          {[
            ["😂", 14],
            ["💀", 7],
            ["🔥", 3],
          ].map(([e, n]) => (
            <span key={String(e)} className="font-mono text-[10px] text-paper/60">
              {e} <b className="text-neon">{n}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
