"use client";

import { useEffect, useRef, useState } from "react";
import { MemeCanvas } from "./MemeCanvas";
import { HUMOR_STYLE_EMOJI, HUMOR_STYLE_LABELS } from "@/lib/humor-styles";
import { TEMPLATE_LABELS } from "@/lib/templates";
import type { MemeSuggestion, TemplateId } from "@/lib/types";

type Props = {
  imageSrc: string;
  suggestions: MemeSuggestion[];
  onPick: (s: MemeSuggestion) => void;
};

const PREVIEW = 420;

function canvasSize(template: TemplateId) {
  if (template === "brain" || template === "drake") return { w: PREVIEW, h: Math.round(PREVIEW * 1.15) };
  return { w: PREVIEW, h: PREVIEW };
}

function LazyMemePreview({
  imageSrc,
  suggestion,
}: {
  imageSrc: string;
  suggestion: MemeSuggestion;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { w, h } = canvasSize(suggestion.template);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full bg-ink/30" style={{ aspectRatio: `${w} / ${h}` }}>
      {visible ? (
        <MemeCanvas
          imageSrc={imageSrc}
          template={suggestion.template}
          texts={suggestion.texts}
          width={w}
          height={h}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full min-h-[200px] animate-pulse bg-smoke/60" />
      )}
    </div>
  );
}

function SuggestionCard({
  imageSrc,
  suggestion,
  onPick,
  className,
}: {
  imageSrc: string;
  suggestion: MemeSuggestion;
  onPick: (s: MemeSuggestion) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(suggestion)}
      className={`group text-left rounded-2xl border border-white/10 overflow-hidden bg-smoke/80 hover:border-neon/60 hover:shadow-neon hover:-translate-y-0.5 transition-all duration-200 ${className ?? ""}`}
    >
      <div className="relative">
        <LazyMemePreview imageSrc={imageSrc} suggestion={suggestion} />
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-ink/80 backdrop-blur px-2 py-1 rounded-full border border-white/10">
          {HUMOR_STYLE_EMOJI[suggestion.humor_style]} {HUMOR_STYLE_LABELS[suggestion.humor_style]}
        </span>
      </div>
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] font-mono text-paper/40">{TEMPLATE_LABELS[suggestion.template]}</p>
        <p className="text-xs text-paper/55 line-clamp-2 mt-1 group-hover:text-paper/80 transition-colors">
          {suggestion.why_funny}
        </p>
      </div>
    </button>
  );
}

export function SuggestionGrid({ imageSrc, suggestions, onPick }: Props) {
  return (
    <>
      {/* Mobile: one meme per swipe */}
      <div className="lg:hidden -mx-4 px-4">
        <p className="text-[10px] font-mono text-paper/40 uppercase tracking-widest mb-2 text-center">
          Swipe for all 6 →
        </p>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.id}
              imageSrc={imageSrc}
              suggestion={s}
              onPick={onPick}
              className="min-w-[88vw] max-w-[88vw] shrink-0 snap-center"
            />
          ))}
        </div>
      </div>

      {/* Desktop: large readable grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-5">
        {suggestions.map((s) => (
          <SuggestionCard key={s.id} imageSrc={imageSrc} suggestion={s} onPick={onPick} />
        ))}
      </div>
    </>
  );
}
