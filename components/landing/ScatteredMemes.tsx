"use client";

import { HERO_SCATTER } from "@/lib/landing-memes";
import { MemeThumb } from "./MemeThumb";

/** Static scattered layout — no float animation (smoother) */
export function ScatteredMemes() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden sm:block max-w-[1500px] mx-auto">
      {HERO_SCATTER.map((m) => (
        <div key={m.id} className={`absolute ${m.pos}`} style={{ zIndex: 1 }}>
          <MemeThumb src={m.src} fallback={m.fallback} alt={m.alt} size={m.size ?? "md"} />
        </div>
      ))}
    </div>
  );
}
