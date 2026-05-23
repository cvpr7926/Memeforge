import { drawSceneBackground } from "./scenes";
import type { SceneId, StickerPlacement, TemplateId, TextOffset } from "./types";

export const ALL_TEMPLATES: TemplateId[] = [
  "classic",
  "drake",
  "brain",
  "subtitle",
  "label",
  "speech",
];

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: "Top / Bottom",
  drake: "Drake",
  brain: "Expanding Brain",
  subtitle: "Netflix Subtitle",
  label: "Arrow Label",
  speech: "Speech Bubble",
};

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  maxWidth?: number;
  align?: CanvasTextAlign;
}

export interface TemplateLayout {
  id: TemplateId;
  layers: (texts: string[]) => TextLayer[];
}

export const TEMPLATES: Record<TemplateId, TemplateLayout> = {
  classic: {
    id: "classic",
    layers: (texts) => [
      { id: "top", text: texts[0] ?? "", x: 0.5, y: 0.08, fontSize: 0.09, maxWidth: 0.92, align: "center" },
      { id: "bottom", text: texts[1] ?? "", x: 0.5, y: 0.88, fontSize: 0.09, maxWidth: 0.92, align: "center" },
    ],
  },
  drake: {
    id: "drake",
    layers: (texts) => [
      { id: "reject", text: texts[0] ?? "", x: 0.72, y: 0.28, fontSize: 0.055, maxWidth: 0.45, align: "center" },
      { id: "approve", text: texts[1] ?? "", x: 0.72, y: 0.72, fontSize: 0.055, maxWidth: 0.45, align: "center" },
    ],
  },
  brain: {
    id: "brain",
    layers: (texts) =>
      [0.14, 0.36, 0.58, 0.8].map((y, i) => ({
        id: `b${i}`,
        text: texts[i] ?? "",
        x: 0.62,
        y,
        fontSize: 0.058,
        maxWidth: 0.72,
        align: "center" as CanvasTextAlign,
      })),
  },
  subtitle: {
    id: "subtitle",
    layers: (texts) => [
      { id: "sub", text: texts[0] ?? "", x: 0.5, y: 0.82, fontSize: 0.06, maxWidth: 0.9, align: "center" },
    ],
  },
  label: {
    id: "label",
    layers: (texts) => [
      { id: "lbl", text: texts[0] ?? "", x: 0.65, y: 0.35, fontSize: 0.07, maxWidth: 0.5, align: "left" },
    ],
  },
  speech: {
    id: "speech",
    layers: (texts) => [
      { id: "say", text: texts[0] ?? "", x: 0.5, y: 0.22, fontSize: 0.065, maxWidth: 0.75, align: "center" },
    ],
  },
};

function drawStickers(ctx: CanvasRenderingContext2D, w: number, h: number, stickers: StickerPlacement[]) {
  for (const s of stickers) {
    const size = Math.max(20, 48 * s.scale);
    ctx.font = `${size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.emoji, s.x * w, s.y * h);
  }
}

export function drawMeme(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  image: HTMLImageElement,
  template: TemplateId,
  texts: string[],
  stickers: StickerPlacement[] = [],
  textOffsets: TextOffset[] = [],
  scene: SceneId = "none",
) {
  ctx.clearRect(0, 0, w, h);
  drawSceneBackground(ctx, w, h, scene);

  if (template === "drake") {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);
    const half = w * 0.52;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, half, h / 2);
    ctx.clip();
    ctx.drawImage(image, 0, 0, half, h / 2);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, h / 2, half, h / 2);
    ctx.clip();
    ctx.drawImage(image, 0, h / 2, half, h / 2);
    ctx.restore();
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(half, 0, w - half, h);
  } else if (template === "brain") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    const rows = 4;
    const rh = h / rows;
    for (let i = 0; i < rows; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, i * rh, w * 0.44, rh);
      ctx.clip();
      const sy = (image.height / rows) * i;
      ctx.drawImage(image, 0, sy, image.width, image.height / rows, 0, i * rh, w * 0.44, rh);
      ctx.restore();
      ctx.fillStyle = `rgba(198,242,78,${0.06 + i * 0.04})`;
      ctx.fillRect(w * 0.44, i * rh, w * 0.56, rh);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(0, i * rh);
      ctx.lineTo(w, i * rh);
      ctx.stroke();
    }
  } else {
    ctx.drawImage(image, 0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0.45)");
    grad.addColorStop(0.25, "transparent");
    grad.addColorStop(0.75, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  if (template === "subtitle") {
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
  }

  if (template === "speech") {
    const caption = (texts[0] ?? "").trim();
    const lines = Math.max(1, Math.min(4, Math.ceil(caption.length / 22)));
    const bubbleH = Math.min(h * 0.22, h * (0.08 + lines * 0.045));
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(ctx, w * 0.1, h * 0.05, w * 0.8, bubbleH, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (template === "label") {
    ctx.strokeStyle = "#c6f24e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.42);
    ctx.lineTo(w * 0.58, h * 0.32);
    ctx.stroke();
  }

  const layout = TEMPLATES[template].layers(texts);
  layout.forEach((layer, i) => {
    const off = textOffsets[i];
    const adjusted = off
      ? { ...layer, x: off.x, y: off.y }
      : layer;
    drawText(ctx, w, h, adjusted, template === "speech");
  });

  if (stickers.length) drawStickers(ctx, w, h, stickers);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: TextLayer,
  darkText = false,
) {
  const size = Math.max(14, layer.fontSize * w);
  const x = layer.x * w;
  const y = layer.y * h;
  const maxW = (layer.maxWidth ?? 0.9) * w;

  ctx.font = `800 ${size}px Impact, Haettenschweiler, "Arial Black", sans-serif`;
  ctx.textAlign = layer.align ?? "center";
  ctx.textBaseline = "middle";

  const lines = wrapText(ctx, layer.text.toUpperCase(), maxW);
  const lineH = size * 1.15;
  const startY = y - ((lines.length - 1) * lineH) / 2;

  for (let i = 0; i < lines.length; i++) {
    const ly = startY + i * lineH;
    if (!darkText) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = Math.max(3, size / 10);
      ctx.lineJoin = "round";
      ctx.strokeText(lines[i], x, ly, maxW);
      ctx.fillStyle = "#fff";
    } else {
      ctx.fillStyle = "#111";
    }
    ctx.fillText(lines[i], x, ly, maxW);
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}
