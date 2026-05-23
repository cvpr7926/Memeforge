import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { MemeRecord, MemeWallItem } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "memes.json");

const REACTION_WEIGHT: Record<string, number> = {
  "😂": 3,
  "💀": 2,
  "🔥": 4,
  "👀": 1,
};

export function memeScore(reactions: Record<string, number>): number {
  return Object.entries(reactions).reduce(
    (sum, [emoji, n]) => sum + n * (REACTION_WEIGHT[emoji] ?? 1),
    0,
  );
}

function load(): Map<string, MemeRecord> {
  try {
    if (!existsSync(DATA_FILE)) return new Map();
    const raw = readFileSync(DATA_FILE, "utf-8");
    const arr: MemeRecord[] = JSON.parse(raw);
    return new Map(arr.map((m) => [m.id, m]));
  } catch {
    return new Map();
  }
}

function save(map: Map<string, MemeRecord>) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify([...map.values()], null, 0));
}

let cache: Map<string, MemeRecord> | null = null;

function db(): Map<string, MemeRecord> {
  if (!cache) cache = load();
  return cache;
}

export async function getMeme(id: string): Promise<MemeRecord | undefined> {
  return db().get(id);
}

export async function saveMeme(meme: MemeRecord): Promise<void> {
  db().set(meme.id, meme);
  save(db());
}

export async function addReaction(id: string, emoji: string): Promise<MemeRecord | undefined> {
  const meme = db().get(id);
  if (!meme) return undefined;
  meme.reactions[emoji] = (meme.reactions[emoji] ?? 0) + 1;
  save(db());
  return meme;
}

export async function listMemesForWall(limit = 50): Promise<MemeWallItem[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();

  return [...db().values()]
    .filter((m) => m.createdAt >= startOfDay)
    .map((m) => ({
      id: m.id,
      template: m.template,
      captionTexts: m.captionTexts,
      humor_style: m.suggestion?.humor_style,
      pngDataUrl: m.pngDataUrl,
      imageDataUrl: m.imageDataUrl,
      reactions: m.reactions,
      score: memeScore(m.reactions),
      createdAt: m.createdAt,
    }))
    .sort((a, b) => b.score - a.score || b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function storageMode(): string {
  return process.env.VERCEL ? "vercel-json-file" : "local-json-file";
}
