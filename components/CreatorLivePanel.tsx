"use client";

import { useEffect, useRef, useState } from "react";

const EMOJIS = ["😂", "💀", "🔥", "👀"];

type Props = {
  memeId: string;
  shareUrl: string;
};

export function CreatorLivePanel({ memeId, shareUrl }: Props) {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState<string | null>(null);
  const prevTotalRef = useRef(0);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/memes/${memeId}`);
      const data = await res.json();
      if (!res.ok) return;
      const r = data.reactions as Record<string, number>;
      const total = Object.values(r).reduce((a, b) => a + b, 0);
      if (total > prevTotalRef.current) {
        setPulse("🔥");
        setTimeout(() => setPulse(null), 600);
      }
      prevTotalRef.current = total;
      setReactions(r);
    };
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [memeId]);

  const copyLink = () => {
    const full =
      typeof window !== "undefined" ? `${window.location.origin}${shareUrl}` : shareUrl;
    void navigator.clipboard.writeText(full);
  };

  const total = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div
      className={`studio-panel rounded-2xl p-5 border space-y-4 transition-colors ${
        pulse ? "border-neon shadow-neon" : "border-neon/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
        <p className="font-display font-bold text-neon">Creator live feed</p>
      </div>
      <p className="text-sm text-paper/55">Share the link — reactions update every 2s.</p>

      <div className="grid grid-cols-4 gap-3">
        {EMOJIS.map((e) => (
          <div key={e} className="text-center rounded-xl py-4 border border-white/10 bg-ink/50">
            <span className="text-3xl">{e}</span>
            <p className="font-mono text-2xl font-bold text-neon mt-1 tabular-nums">{reactions[e] ?? 0}</p>
          </div>
        ))}
      </div>

      <p className="text-center font-mono text-sm text-paper/40">{total} total reactions</p>

      <button
        type="button"
        onClick={copyLink}
        className="w-full py-3 rounded-full border border-white/15 text-sm font-semibold hover:border-neon transition-colors"
      >
        Copy public link
      </button>
    </div>
  );
}
