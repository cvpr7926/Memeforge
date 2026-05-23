import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new Error("MISSING_KEY");
  }
  if (!client) {
    client = new Anthropic({
      apiKey: key,
      maxRetries: 2,
      timeout: 90_000,
    });
  }
  return client;
}

export function explainAnthropicError(err: unknown): string {
  if (err instanceof Error && err.message === "MISSING_KEY") {
    return "Add ANTHROPIC_API_KEY to .env.local (get one at console.anthropic.com)";
  }

  if (err && typeof err === "object" && "status" in err) {
    const e = err as { status?: number; message?: string };
    if (e.status === 401) return "Invalid API key — check ANTHROPIC_API_KEY in .env.local";
    if (e.status === 404) return "Model not found — set ANTHROPIC_MODEL=claude-3-5-sonnet-20241022 in .env.local";
    if (e.status === 429) return "Rate limited — wait 30 seconds and try again";
    if (e.status === 529) return "Claude is overloaded — try again in a moment";
  }

  const msg = err instanceof Error ? err.message : String(err);
  const cause =
    err && typeof err === "object" && "cause" in err
      ? String((err as { cause?: unknown }).cause)
      : "";

  if (
    msg.includes("Connection error") ||
    msg.includes("fetch failed") ||
    cause.includes("ETIMEDOUT") ||
    cause.includes("ECONNREFUSED") ||
    cause.includes("ENOTFOUND")
  ) {
    return "Can't reach Claude (network timeout). Your key is probably fine — check Wi‑Fi/VPN/firewall, or retry. WSL users: try from Windows PowerShell if this keeps failing.";
  }

  return msg || "Analyze failed";
}
