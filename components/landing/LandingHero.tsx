"use client";

import { HERO_SCATTER } from "@/lib/landing-memes";
import { MemeThumb } from "./MemeThumb";
import { ScatteredMemes } from "./ScatteredMemes";
import { SharePreviewCard } from "./SharePreviewCard";

export function LandingHero() {
  return (
    <section className="relative min-h-[82vh] sm:min-h-[88vh] overflow-visible flex flex-col justify-center py-10 px-4 pb-4">
      <ScatteredMemes />
      <SharePreviewCard />

      {/* Mobile scatter strip */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x mb-6">
        {HERO_SCATTER.slice(0, 8).map((m) => (
          <div key={m.id} className="snap-center shrink-0">
            <MemeThumb src={m.src} fallback={m.fallback} alt={m.alt} size="md" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5 text-xs font-semibold text-neon mb-5">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          Vision AI · six formats · zero watermark
        </div>

        <h1 className="font-display font-extrabold text-[2.35rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight">
          Make it a meme
          <br />
          <span className="shimmer-text">that doesn&apos;t suck.</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-paper/60 max-w-lg mx-auto leading-relaxed">
          Upload the cursed screenshot. Add context. Pick from six live previews — relatable to savage —
          edit, export, share. Reactions roll in live.
        </p>

        <p className="mt-3 text-xs text-paper/35 font-mono italic">
          Funny is the hard part. That&apos;s the whole point.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {["📤 Upload", "✨ Suggest", "👆 Pick", "🎨 Edit", "🔗 Share", "🤣 React"].map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-smoke/80 border border-white/10 text-paper/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="#studio"
          className="mt-9 inline-flex items-center gap-2 bg-gradient-to-r from-punch via-grape to-punch bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] text-white font-display font-extrabold text-sm uppercase tracking-wider px-10 py-4 rounded-full shadow-punch hover:scale-[1.03] active:scale-[0.98] transition-transform"
        >
          Forge your meme
          <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
