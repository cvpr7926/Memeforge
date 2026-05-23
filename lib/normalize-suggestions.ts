import { HUMOR_STYLES, STYLE_TO_TEMPLATE } from "./humor-styles";
import type { HumorStyle, MemeSuggestion, TemplateId } from "./types";

type RawSuggestion = {
  id: string;
  humor_style?: string;
  template?: string;
  format?: string;
  texts: string[];
  why_funny?: string;
};

/** Enforce style↔template pairing if the model drifts. */
export function normalizeSuggestions(raw: RawSuggestion[]): MemeSuggestion[] {
  return HUMOR_STYLES.map((style, i) => {
    const match =
      raw.find((s) => s.humor_style === style) ??
      raw[i];
    const template = (STYLE_TO_TEMPLATE[style] ??
      match?.template ??
      "classic") as TemplateId;
    return {
      id: match?.id ?? `${style}-${i}`,
      humor_style: style,
      template,
      format: match?.format ?? style,
      texts: match?.texts ?? [],
      why_funny: match?.why_funny ?? "",
    };
  });
}
