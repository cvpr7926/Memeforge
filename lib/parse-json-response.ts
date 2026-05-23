/** Strip optional markdown fences Claude sometimes wraps around JSON. */
export function parseJsonFromModelText(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const text = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(text);
}
