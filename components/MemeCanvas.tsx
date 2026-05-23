"use client";

import { memo, useEffect, useRef } from "react";
import { drawMeme } from "@/lib/templates";
import type { SceneId, StickerPlacement, TemplateId } from "@/lib/types";

type Props = {
  imageSrc: string;
  template: TemplateId;
  texts: string[];
  stickers?: StickerPlacement[];
  scene?: SceneId;
  width?: number;
  height?: number;
  className?: string;
  onReady?: (canvas: HTMLCanvasElement) => void;
};

function MemeCanvasInner({
  imageSrc,
  template,
  texts,
  stickers = [],
  scene = "none",
  width = 400,
  height = 400,
  className,
  onReady,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const textsKey = texts.join("\u0000");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      canvas.width = width;
      canvas.height = height;
      drawMeme(ctx, width, height, img, template, texts, stickers, [], scene);
      onReadyRef.current?.(canvas);
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc, template, textsKey, stickers, scene, width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      className={className ?? "w-full rounded-lg"}
    />
  );
}

export const MemeCanvas = memo(MemeCanvasInner);
