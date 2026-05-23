"use client";

import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { CreatorLivePanel } from "@/components/CreatorLivePanel";
import { MemeCanvas } from "@/components/MemeCanvas";
import { SiteHeader } from "@/components/SiteHeader";
import type { MemeRecord } from "@/lib/types";

const EMOJIS = ["😂", "💀", "🔥", "👀"];

function ShareInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCreator = searchParams.get("creator") === "1";
  const [meme, setMeme] = useState<MemeRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [burst, setBurst] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/memes/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setMeme(data);
  }, [id]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
    const t = setInterval(() => load().catch(() => {}), 3000);
    return () => clearInterval(t);
  }, [load]);

  const react = async (emoji: string) => {
    const res = await fetch(`/api/memes/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setMeme((m) => (m ? { ...m, reactions: data.reactions } : m));
    setBurst(emoji);
    setTimeout(() => setBurst(null), 400);
  };

  const remix = () => {
    if (!meme) return;
    sessionStorage.setItem("roastcam-image", meme.imageDataUrl);
    sessionStorage.setItem("roastcam-remix-from", id);
    router.push("/#studio");
  };

  if (error) return <p className="p-8 text-center text-punch">{error}</p>;
  if (!meme) return <p className="p-8 text-center font-display text-neon animate-pulse">Loading meme…</p>;

  const displaySrc = meme.pngDataUrl ?? meme.imageDataUrl;
  const showCanvas = !meme.pngDataUrl;

  return (
    <main className="min-h-dvh max-w-lg mx-auto px-4 py-8 space-y-6">
      {isCreator && <CreatorLivePanel memeId={id} shareUrl={`/m/${id}`} />}

      <div className="studio-panel rounded-3xl p-6 space-y-6 text-center">
        <p className="font-mono text-[10px] text-paper/40 uppercase tracking-widest">MemeForge · no signup</p>

        <div className={`transition-transform ${burst ? "scale-[1.02]" : ""}`}>
          {showCanvas ? (
            <MemeCanvas
              imageSrc={meme.imageDataUrl}
              template={meme.template}
              texts={meme.captionTexts}
              stickers={meme.stickers}
              width={512}
              height={512}
              className="w-full rounded-2xl border border-white/10 shadow-card mx-auto"
            />
          ) : (
            <img src={displaySrc} alt="meme" className="w-full rounded-2xl border border-white/10 shadow-card" />
          )}
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => react(e)}
              className={`flex items-center gap-2 bg-ink/60 border rounded-full px-5 py-2.5 text-xl transition-all active:scale-90 ${
                burst === e ? "border-neon shadow-neon scale-110" : "border-white/10 hover:border-neon"
              }`}
            >
              {e}
              <b className="font-mono text-neon text-sm tabular-nums">{meme.reactions[e] ?? 0}</b>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={remix}
          className="w-full py-3 rounded-full border border-punch/40 text-punch font-semibold text-sm uppercase tracking-wide hover:bg-punch/10 transition-colors"
        >
          ♻️ Remix this photo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center text-center">
        <Link href="/wall" className="text-sm font-semibold text-neon hover:underline">
          🏆 Meme wall
        </Link>
        <Link href="/#studio" className="text-sm font-semibold text-paper/50 hover:text-neon">
          Forge another →
        </Link>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<p className="p-8 text-center text-neon animate-pulse">Loading…</p>}>
        <ShareInner />
      </Suspense>
    </>
  );
}
