import type { HumorStyle, TemplateId } from "./types";

export const HUMOR_STYLE_LABELS: Record<HumorStyle, string> = {
  relatable: "Relatable",
  absurdist: "Absurdist",
  corporate: "Corporate",
  dramatic: "Dramatic",
  brainrot: "Brainrot",
  savage: "Savage",
};

export const HUMOR_STYLE_EMOJI: Record<HumorStyle, string> = {
  relatable: "😮‍💨",
  absurdist: "🌀",
  corporate: "📧",
  dramatic: "🎭",
  brainrot: "💀",
  savage: "🔥",
};

/** One humor style → one template (hackathon live previews). */
export const STYLE_TO_TEMPLATE: Record<HumorStyle, TemplateId> = {
  relatable: "classic",
  absurdist: "brain",
  corporate: "subtitle",
  dramatic: "speech",
  brainrot: "drake",
  savage: "label",
};

export const HUMOR_STYLES: HumorStyle[] = [
  "relatable",
  "absurdist",
  "corporate",
  "dramatic",
  "brainrot",
  "savage",
];
