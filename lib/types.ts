export type TemplateId =
  | "classic"
  | "drake"
  | "brain"
  | "subtitle"
  | "label"
  | "speech";

export type HumorStyle =
  | "relatable"
  | "absurdist"
  | "corporate"
  | "dramatic"
  | "brainrot"
  | "savage";

export type SceneId = "none" | "void" | "sunset" | "office" | "matrix";

/** Normalized 0–1 position override for caption drag */
export interface TextOffset {
  x: number;
  y: number;
}

/** Text styling options for individual lines */
export interface TextStyle {
  fontSize?: number; // relative scale: 0.8 to 1.5
  color?: string; // hex color or named
}

export interface StickerPlacement {
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

export interface MemeSuggestion {
  id: string;
  template: TemplateId;
  humor_style: HumorStyle;
  format: string;
  texts: string[];
  why_funny: string;
}

export interface AnalyzeResult {
  image_vibe: string;
  detected_irony?: string;
  suggestions: MemeSuggestion[];
}

export interface MemeRecord {
  id: string;
  imageDataUrl: string;
  suggestion: MemeSuggestion;
  captionTexts: string[];
  template: TemplateId;
  pngDataUrl?: string;
  stickers?: StickerPlacement[];
  scene?: SceneId;
  reactions: Record<string, number>;
  createdAt: number;
}

export interface MemeWallItem {
  id: string;
  template: TemplateId;
  captionTexts: string[];
  humor_style?: HumorStyle;
  pngDataUrl?: string;
  imageDataUrl: string;
  reactions: Record<string, number>;
  score: number;
  createdAt: number;
}
