"use client";

import { MemeThumb } from "./MemeThumb";

type Props = {
  src: string;
  fallback?: string;
  alt: string;
  caption: string;
  rotate: number;
  className?: string;
  delay?: "none" | "delay";
};

export function FloatingMeme({ src, fallback, alt, caption, rotate, className, delay }: Props) {
  return (
    <div
      className={`flex ${delay === "delay" ? "animate-float-delay" : "animate-float"} ${className ?? ""}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <MemeThumb src={src} fallback={fallback} alt={alt} caption={caption} size="md" />
    </div>
  );
}
