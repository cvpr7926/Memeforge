"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawMeme, TEMPLATES } from "@/lib/templates";
import type { SceneId, StickerPlacement, TemplateId, TextOffset } from "@/lib/types";

type Props = {
  imageSrc: string;
  template: TemplateId;
  texts: string[];
  stickers?: StickerPlacement[];
  scene?: SceneId;
  textOffsets?: TextOffset[];
  onTextOffsetsChange?: (o: TextOffset[]) => void;
  width?: number;
  height?: number;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
};

type Hit = { 
  index: number; 
  x: number; 
  y: number; 
  w: number; 
  h: number; 
  type: "text" | "sticker";
  stickerIdx?: number;
};

export function MemeEditor({
  imageSrc,
  template,
  texts,
  stickers = [],
  scene = "none",
  textOffsets = [],
  onTextOffsetsChange,
  width = 512,
  height = 512,
  className,
  onCanvasReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hits, setHits] = useState<Hit[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      drawMeme(ctx, width, height, img, template, texts, stickers, textOffsets, scene);
      onCanvasReady?.(canvas);

      const layers = TEMPLATES[template].layers(texts);
      const newHits: Hit[] = layers.map((layer, i) => {
        const off = textOffsets[i];
        const x = (off?.x ?? layer.x) * width;
        const y = (off?.y ?? layer.y) * height;
        const fs = layer.fontSize * width;
        const mw = (layer.maxWidth ?? 0.9) * width;
        return { index: i, x: x - mw / 2, y: y - fs / 2, w: mw, h: fs * 1.4 };
      });
      setHits(newHits);

      if (dragIdx !== null) {
        const h = newHits[dragIdx];
        if (h) {
          ctx.strokeStyle = "rgba(0, 245, 212, 0.85)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(h.x - 4, h.y - 4, h.w + 8, h.h + 8);
          ctx.setLineDash([]);
        }
      }
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    template,
    texts,
    stickers,
    textOffsets,
    scene,
    width,
    height,
    onCanvasReady,
    dragIdx,
    activeIdx,
  ]);

  useEffect(() => {
    render();
  }, [render]);

  const pointerPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top) / rect.height,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { x, y } = pointerPos(e);
    for (let i = hits.length - 1; i >= 0; i--) {
      const h = hits[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
        setDragIdx(i);
        setActiveIdx(i);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIdx === null || !onTextOffsetsChange) return;
    const { nx, ny } = pointerPos(e);
    const next = [...textOffsets];
    while (next.length < texts.length) next.push({ x: 0.5, y: 0.5 });
    next[dragIdx] = {
      x: Math.max(0.05, Math.min(0.95, nx)),
      y: Math.max(0.05, Math.min(0.95, ny)),
    };
    onTextOffsetsChange(next);
  };

  const onPointerUp = () => setDragIdx(null);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`${className ?? "w-full rounded-2xl"} touch-none ${dragIdx !== null ? "cursor-grabbing" : "cursor-grab"} border border-white/10 transition-shadow hover:shadow-card`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <p className="text-[11px] text-paper/40 text-center">
        Click to drag captions · Edit text in fields below
      </p>
    </div>
  );
}
