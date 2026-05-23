const DATA_URL_RE = /^data:(image\/[^;]+);base64,(.+)$/;

export function parseImageDataUrl(dataUrl: string): { mediaType: string; data: string } {
  const match = dataUrl.match(DATA_URL_RE);
  if (!match) throw new Error("Invalid image data URL");
  return { mediaType: match[1], data: match[2] };
}
