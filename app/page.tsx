"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ForgeControls } from "@/components/ForgeControls";
import { LoadingForge } from "@/components/LoadingForge";
import { LandingHero } from "@/components/landing/LandingHero";
import { MemeMarquee } from "@/components/landing/MemeMarquee";
import { SamplePhotos } from "@/components/SamplePhotos";
import { SiteHeader } from "@/components/SiteHeader";
import { SuggestionGrid } from "@/components/SuggestionGrid";
import { UploadZone } from "@/components/UploadZone";
import { compressImageDataUrl } from "@/lib/compress-image";
import type { AnalyzeResult, MemeSuggestion } from "@/lib/types";

type Step = "upload" | "loading" | "pick";

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [image, setImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userContext, setUserContext] = useState("");
  const [spice, setSpice] = useState(25);
  const [remixBanner, setRemixBanner] = useState(false);

  useEffect(() => {
    const remixImg = sessionStorage.getItem("roastcam-image");
    const remixFrom = sessionStorage.getItem("roastcam-remix-from");
    if (remixImg && remixFrom) {
      setPendingImage(remixImg);
      setRemixBanner(true);
      sessionStorage.removeItem("roastcam-remix-from");
    }
  }, []);

  const runAnalyze = useCallback(
    async (
      dataUrl: string,
      shuffle = false,
    ): Promise<{ data: AnalyzeResult; compressed: string } | null> => {
      setImage(dataUrl);
      setStep("loading");
      setError(null);
      try {
        const compressed = await compressImageDataUrl(dataUrl);
        setImage(compressed);
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: compressed,
            userContext,
            spice,
            shuffle,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setResult(data);
        setStep("pick");
        return { data, compressed };
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something broke");
        setStep("upload");
        return null;
      }
    },
    [userContext, spice],
  );

  const onImageSelected = useCallback((dataUrl: string) => {
    setPendingImage(dataUrl);
    setResult(null);
    setError(null);
    setRemixBanner(false);
  }, []);

  const onForge = useCallback(() => {
    if (!pendingImage) return;
    void runAnalyze(pendingImage, false);
  }, [pendingImage, runAnalyze]);

  const onFeelingLucky = useCallback(async () => {
    const src = image ?? pendingImage;
    if (!src) return;

    if (step === "pick" && result?.suggestions.length) {
      const pick = result.suggestions[Math.floor(Math.random() * result.suggestions.length)];
      sessionStorage.setItem("roastcam-image", src);
      sessionStorage.setItem("roastcam-suggestion", JSON.stringify(pick));
      router.push(`/edit?template=${pick.template}&texts=${encodeURIComponent(JSON.stringify(pick.texts))}`);
      return;
    }

    const out = await runAnalyze(src, true);
    if (!out?.data.suggestions?.length) return;
    const pick = out.data.suggestions[Math.floor(Math.random() * out.data.suggestions.length)];
    sessionStorage.setItem("roastcam-image", out.compressed);
    sessionStorage.setItem("roastcam-suggestion", JSON.stringify(pick));
    router.push(`/edit?template=${pick.template}&texts=${encodeURIComponent(JSON.stringify(pick.texts))}`);
  }, [image, pendingImage, result, step, runAnalyze, router]);

  const onShuffle = useCallback(() => {
    if (!image) return;
    void runAnalyze(image, true);
  }, [image, runAnalyze]);

  const onPick = (s: MemeSuggestion) => {
    if (!image) return;
    const q = new URLSearchParams({
      template: s.template,
      texts: JSON.stringify(s.texts),
    });
    sessionStorage.setItem("roastcam-image", image);
    sessionStorage.setItem("roastcam-suggestion", JSON.stringify(s));
    router.push(`/edit?${q.toString()}`);
  };

  const reset = () => {
    setStep("upload");
    setResult(null);
    setImage(null);
    setPendingImage(null);
    setError(null);
    setRemixBanner(false);
  };

  const showLanding = step === "upload" && !pendingImage;

  return (
    <>
      <SiteHeader />

      {showLanding && (
        <div className="relative">
          <LandingHero />
          <MemeMarquee />
        </div>
      )}

      <section
        id="studio"
        className={`max-w-4xl mx-auto px-4 ${showLanding ? "py-12" : "py-8"} scroll-mt-24`}
      >
        <div className="studio-panel rounded-3xl p-6 sm:p-8 space-y-6">
          {remixBanner && (
            <p className="text-sm text-punch border border-punch/30 bg-punch/10 rounded-xl px-4 py-2">
              ♻️ Remix mode — same photo, new captions. Add fresh context and forge.
            </p>
          )}

          {step === "upload" && (
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                {pendingImage ? "Ready to forge" : "The studio"}
              </h2>
              <p className="text-paper/55 text-sm mt-1">
                {pendingImage
                  ? "Forge, shuffle, or roll the dice with I'm feeling lucky."
                  : "Context + photo → six live meme previews."}
              </p>
            </div>
          )}

          {step === "pick" && (
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display font-extrabold text-2xl">Pick your meme</h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-semibold text-paper/50 hover:text-neon uppercase tracking-wide"
              >
                ← New photo
              </button>
            </div>
          )}

          {step !== "pick" && (
            <ForgeControls
              userContext={userContext}
              onContextChange={setUserContext}
              spice={spice}
              onSpiceChange={setSpice}
              disabled={step === "loading"}
            />
          )}

          {error && (
            <p className="text-punch text-sm font-medium border border-punch/40 bg-punch/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {step === "upload" && (
            <div className="space-y-5">
              <SamplePhotos onPick={onImageSelected} />
              <UploadZone onImage={onImageSelected} />
              {pendingImage && (
                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-ink/50 border border-white/10">
                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <img
                      src={pendingImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-neon/30 shadow-neon"
                    />
                    <p className="text-sm text-paper/60 text-center sm:text-left flex-1">
                      Photo locked in. Claude is standing by.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onForge}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-neon to-grape text-ink font-display font-extrabold uppercase tracking-wide px-6 py-3.5 rounded-full hover:shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Forge 6 memes →
                    </button>
                    <button
                      type="button"
                      onClick={onFeelingLucky}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-punch to-grape text-white font-display font-extrabold uppercase tracking-wide px-6 py-3.5 rounded-full hover:shadow-punch transition-all"
                    >
                      🎰 Feeling lucky
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "loading" && image && <LoadingForge imageSrc={image} />}

          {step === "pick" && image && result && (
            <div className="space-y-6">
              <div className="rounded-xl bg-ink/50 border border-white/10 p-4 text-sm space-y-2">
                <p>
                  <span className="text-paper/40">Vibe · </span>
                  <span className="text-paper">{result.image_vibe}</span>
                </p>
                {result.detected_irony && (
                  <p>
                    <span className="text-paper/40">Irony · </span>
                    <span className="text-paper/90">{result.detected_irony}</span>
                  </p>
                )}
              </div>

              <SuggestionGrid imageSrc={image} suggestions={result.suggestions} onPick={onPick} />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onShuffle}
                  className="flex-1 border border-white/15 hover:border-neon/50 font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded-full transition-colors"
                >
                  Shuffle ↻
                </button>
                <button
                  type="button"
                  onClick={onFeelingLucky}
                  className="flex-1 bg-punch/20 border border-punch/40 text-punch font-semibold text-sm uppercase px-6 py-3 rounded-full hover:bg-punch/30 transition-colors"
                >
                  🎰 Lucky pick
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-paper/30 space-y-2">
        <p>MemeForge · AI memes with taste · No signup</p>
        <a href="/wall" className="text-neon hover:underline">
          🏆 Today&apos;s meme wall
        </a>
      </footer>
    </>
  );
}
