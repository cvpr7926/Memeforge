import { NextResponse } from "next/server";
import { parseRequestJson } from "@/lib/parse-request-json";
import { addReaction } from "@/lib/store";

const ALLOWED = ["😂", "💀", "🔥", "👀"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { emoji } = await parseRequestJson<{ emoji?: string }>(req);
  if (!emoji || !ALLOWED.includes(emoji)) {
    return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
  }
  const meme = await addReaction(id, emoji);
  if (!meme) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reactions: meme.reactions });
}
