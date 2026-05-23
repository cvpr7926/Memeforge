"use client";

import { useState } from "react";

type Props = {
  src: string;
  fallback?: string;
  alt: string;
  caption?: string;
  showCaption?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const SIZES = {
  sm: "w-[72px] h-[72px] sm:w-20 sm:h-20",
  md: "w-24 h-24 sm:w-28 sm:h-28",
  lg: "w-32 h-32 sm:w-40 sm:h-40",
  xl: "w-36 h-36 sm:w-44 sm:h-44",
};

export function MemeThumb({
  src,
  fallback,
  alt,
  caption,
  showCaption = false,
  className,
  size = "md",
}: Props) {
  const [url, setUrl] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative shrink-0 ${SIZES[size]} ${className ?? ""}`}>
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/15 bg-smoke">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => {
              if (fallback && url !== fallback) {
                setUrl(fallback);
                return;
              }
              setFailed(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-grape/20 text-[10px] font-mono text-paper/30 uppercase">
            meme
          </div>
        )}
        {showCaption && caption && (
          <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5">
            <p className="meme-caption text-[8px] text-white text-center truncate">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
