import { NextResponse } from "next/server";
import { storageMode } from "@/lib/store";

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    ok: true,
    anthropicKey: key?.trim() ? "configured" : "missing",
    storage: storageMode(),
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514 (default)",
  });
}
