/** Safe JSON body parse — avoids crashes on empty POST bodies. */
export async function parseRequestJson<T extends Record<string, unknown>>(
  req: Request,
): Promise<Partial<T>> {
  const text = await req.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as T;
  } catch {
    return {};
  }
}
