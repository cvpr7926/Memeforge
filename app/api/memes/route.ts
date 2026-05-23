import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { listMemesForWall, saveMeme } from "@/lib/store";
import type { MemeRecord } from "@/lib/types";

export async function GET() {
  const memes = await listMemesForWall(40);
  return NextResponse.json({ memes });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = nanoid(10);
    const meme: MemeRecord = {
      id,
      imageDataUrl: body.imageDataUrl,
      suggestion: body.suggestion,
      captionTexts: body.captionTexts,
      template: body.template,
      pngDataUrl: body.pngDataUrl,
      stickers: body.stickers,
      scene: body.scene,
      reactions: {},
      createdAt: Date.now(),
    };
    await saveMeme(meme);
    return NextResponse.json({ id, url: `/m/${id}?creator=1` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 },
    );
  }
}
