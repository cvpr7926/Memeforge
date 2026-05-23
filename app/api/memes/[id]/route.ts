import { NextResponse } from "next/server";
import { getMeme } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meme);
}
