"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MemeCanvas } from "@/components/MemeCanvas";
import { SiteHeader } from "@/components/SiteHeader";
import { HUMOR_STYLE_EMOJI, HUMOR_STYLE_LABELS } from "@/lib/humor-styles";
import type { MemeWallItem } from "@/lib/types";

const WALL_CANVAS = 480;

export default function WallPage() {
  const [memes, setMemes] = useState<MemeWallItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/memes");
      const data = await res.json();
      setMemes(data.memes ?? []);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-punch">🏆 Bonus</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl">
            Today&apos;s <span className="text-neon">meme wall</span>
          </h1>
          <p className="text-paper/55 text-sm max-w-md mx-auto">
            Ranked by reactions — updates live every 12 seconds.
          </p>
        </div>

        {loading && <p className="text-center text-neon animate-pulse font-mono">Loading wall…</p>}

        {!loading && memes.length === 0 && (
          <div className="studio-panel rounded-3xl p-12 text-center">
            <p className="text-paper/50">No memes yet today. Be the first to ship one.</p>
            <Link href="/#studio" className="inline-block mt-4 text-neon font-bold hover:underline">
              Forge a meme →
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {memes.map((m, rank) => (
            <Link
              key={m.id}
              href={`/m/${m.id}`}
              className="studio-panel rounded-2xl overflow-hidden hover:border-neon/40 border border-white/5 transition-all group"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <span className="font-mono text-neon font-bold text-lg">#{rank + 1}</span>
                <span className="text-xs font-mono text-paper/40">🔥 {m.score} pts</span>
              </div>
              {m.pngDataUrl ? (
                <img
                  src={m.pngDataUrl}
                  alt=""
                  className="w-full min-h-[280px] sm:min-h-[320px] object-contain bg-ink/40"
                />
              ) : (
                <MemeCanvas
                  imageSrc={m.imageDataUrl}
                  template={m.template}
                  texts={m.captionTexts}
                  width={WALL_CANVAS}
                  height={WALL_CANVAS}
                  className="w-full min-h-[280px] sm:min-h-[320px] object-contain bg-ink/40"
                />
              )}
              <div className="p-3 flex justify-between items-center text-xs">
                {m.humor_style && (
                  <span className="text-paper/50">
                    {HUMOR_STYLE_EMOJI[m.humor_style]} {HUMOR_STYLE_LABELS[m.humor_style]}
                  </span>
                )}
                <span className="font-mono text-paper/40">
                  😂{m.reactions["😂"] ?? 0} 💀{m.reactions["💀"] ?? 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
