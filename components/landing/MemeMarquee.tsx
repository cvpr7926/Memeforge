"use client";

import { MARQUEE_TRAIN } from "@/lib/landing-memes";
import { MemeThumb } from "./MemeThumb";

/** Single GPU-friendly row — no captions, no second row */
export function MemeMarquee() {
  const track = (
    <div className="flex shrink-0 gap-3 pr-3 will-change-transform">
      {MARQUEE_TRAIN.map((m) => (
        <MemeThumb key={m.id} src={m.src} fallback={m.fallback} alt={m.alt} size="md" showCaption={false} />
      ))}
    </div>
  );

  return (
    <div className="w-full border-y border-white/5 bg-smoke/40 py-4 overflow-hidden -mt-2 relative z-10">
      <div className="flex w-max animate-marquee-gpu motion-reduce:animate-none">
        {track}
        {track}
      </div>
    </div>
  );
}
