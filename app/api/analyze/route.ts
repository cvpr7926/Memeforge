import { NextResponse } from "next/server";
import { z } from "zod";
import { explainAnthropicError, getAnthropicClient } from "@/lib/anthropic-client";
import { HUMOR_STYLES } from "@/lib/humor-styles";
import { normalizeSuggestions } from "@/lib/normalize-suggestions";
import { parseImageDataUrl } from "@/lib/parse-image-data-url";
import { parseJsonFromModelText } from "@/lib/parse-json-response";
import { buildVisionSystem } from "@/lib/prompts";
import type { AnalyzeResult, HumorStyle } from "@/lib/types";

const DEMO_SUGGESTIONS: AnalyzeResult = {
  image_vibe: "demo mode — add ANTHROPIC_API_KEY to .env.local",
  detected_irony: "placeholder",
  suggestions: [
    {
      id: "relatable",
      humor_style: "relatable",
      template: "classic",
      format: "Top/Bottom",
      texts: ["ME READING THE BRIEF", "ME IGNORING THE BRIEF"],
      why_funny: "dev energy",
    },
    {
      id: "absurdist",
      humor_style: "absurdist",
      template: "brain",
      format: "Brain",
      texts: ["Open IDE", "npm install", "Ctrl+Z install", "Ship to prod"],
      why_funny: "escalation",
    },
    {
      id: "corporate",
      humor_style: "corporate",
      template: "subtitle",
      format: "Subtitle",
      texts: ["*per my last meme about synergy*"],
      why_funny: "linkedin",
    },
    {
      id: "dramatic",
      humor_style: "dramatic",
      template: "speech",
      format: "Speech",
      texts: ["TO MEME OR NOT TO MEME"],
      why_funny: "theater",
    },
    {
      id: "brainrot",
      humor_style: "brainrot",
      template: "drake",
      format: "Drake",
      texts: ["sleeping 8 hours", "one more git push"],
      why_funny: "gen z",
    },
    {
      id: "savage",
      humor_style: "savage",
      template: "label",
      format: "Label",
      texts: ["THE ACTUAL BUG"],
      why_funny: "arrow",
    },
  ],
};

const SuggestionSchema = z.object({
  id: z.string(),
  humor_style: z.enum(HUMOR_STYLES as [HumorStyle, ...HumorStyle[]]).optional(),
  template: z.enum(["classic", "drake", "brain", "subtitle", "label", "speech"]),
  format: z.string(),
  texts: z.array(z.string()),
  why_funny: z.string(),
});

const ResultSchema = z.object({
  image_vibe: z.string(),
  detected_irony: z.string().optional(),
  suggestions: z.array(SuggestionSchema).min(6),
});

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageDataUrl?: string;
      userContext?: string;
      spice?: number;
      shuffle?: boolean;
    };
    const { imageDataUrl, userContext, spice = 0, shuffle = false } = body;

    if (!imageDataUrl?.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(DEMO_SUGGESTIONS satisfies AnalyzeResult);
    }

    const { mediaType, data } = parseImageDataUrl(imageDataUrl);
    const anthropic = getAnthropicClient();
    const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
    const system = buildVisionSystem({ userContext, spice, shuffle });

    const message = await anthropic.messages.create({
      model,
      max_tokens: 3200,
      system: `${system}\n\nRespond with ONLY valid JSON. No markdown fences, no commentary.`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data,
              },
            },
            {
              type: "text",
              text: "Analyze this photo. Return exactly 6 meme suggestions (one per humor_style) as JSON.",
            },
          ],
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock?.type === "text" ? textBlock.text : "{}";
    const parsed = ResultSchema.parse(parseJsonFromModelText(raw));
    const suggestions = normalizeSuggestions(parsed.suggestions);

    return NextResponse.json({
      image_vibe: parsed.image_vibe,
      detected_irony: parsed.detected_irony,
      suggestions,
    } satisfies AnalyzeResult);
  } catch (err) {
    console.error("[analyze]", err);
    return NextResponse.json({ error: explainAnthropicError(err) }, { status: 500 });
  }
}
