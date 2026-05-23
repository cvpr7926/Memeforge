"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EmojiSuggest } from "@/components/EmojiSuggest";
import { MemeEditor } from "@/components/MemeEditor";
import { ScenePicker } from "@/components/ScenePicker";
import { SiteHeader } from "@/components/SiteHeader";
import { StickerBar } from "@/components/StickerBar";
import { TemplatePicker } from "@/components/TemplatePicker";
import { TextFormatPanel } from "@/components/TextFormatPanel";
import { TEMPLATE_LABELS, TEMPLATES } from "@/lib/templates";
import { useEditKeyboardShortcuts } from "@/lib/keyboard-shortcuts";
import type { MemeSuggestion, SceneId, StickerPlacement, TemplateId, TextOffset, TextStyle } from "@/lib/types";

function EditInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTemplate = (params.get("template") ?? "classic") as TemplateId;
  const [template, setTemplate] = useState<TemplateId>(initialTemplate);
  const [image, setImage] = useState<string | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [stickers, setStickers] = useState<StickerPlacement[]>([]);
  const [textOffsets, setTextOffsets] = useState<TextOffset[]>([]);
  const [scene, setScene] = useState<SceneId>("none");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const img = sessionStorage.getItem("roastcam-image");
    const raw = sessionStorage.getItem("roastcam-suggestion");
    if (img) setImage(img);
    if (raw) {
      const s = JSON.parse(raw) as MemeSuggestion;
      setTexts(s.texts.length ? [...s.texts] : ["TOP", "BOTTOM"]);
      setTemplate(s.template);
    } else {
      try {
        const parsed = JSON.parse(params.get("texts") ?? "[]");
        setTexts(Array.isArray(parsed) && parsed.length ? parsed : ["CAPTION"]);
      } catch {
        setTexts(["CAPTION"]);
      }
    }
  }, [params]);

  const updateText = (i: number, val: string) => {
    setTexts((t) => {
      const next = [...t];
      next[i] = val;
      return next;
    });
  };

  const insertEmoji = (emoji: string) => {
    const el = inputRefs.current[activeLine];
    if (!el) {
      updateText(activeLine, (texts[activeLine] ?? "") + emoji);
      return;
    }
    const start = el.selectionStart ?? texts[activeLine]?.length ?? 0;
    const end = el.selectionEnd ?? start;
    const cur = texts[activeLine] ?? "";
    const next = cur.slice(0, start) + emoji + cur.slice(end);
    updateText(activeLine, next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const exportPng = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return null;
    return canvas.toDataURL("image/png");
  }, [image]);

  const share = async () => {
    setSaving(true);
    try {
      const png = await exportPng();
      const res = await fetch("/api/memes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: image,
          suggestion: JSON.parse(sessionStorage.getItem("roastcam-suggestion") ?? "{}"),
          captionTexts: texts,
          template,
          pngDataUrl: png,
          stickers,
          scene,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(data.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const download = async () => {
    const png = await exportPng();
    if (!png) return;
    const a = document.createElement("a");
    a.href = png;
    a.download = "memeforge.png";
    a.click();
  };

  const copyImage = async () => {
    const png = await exportPng();
    if (!png) return;
    const blob = await (await fetch(png)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    alert("Copied!");
  };

  const exportGif = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const { default: GIF } = await import("gif.js");
      const gif = new GIF({ workers: 2, quality: 10, width: canvas.width, height: canvas.height });
      for (let i = 0; i < 12; i++) {
        const frame = document.createElement("canvas");
        frame.width = canvas.width;
        frame.height = canvas.height;
        frame.getContext("2d")?.drawImage(canvas, 0, 0);
        gif.addFrame(frame, { delay: 120 });
      }
      gif.on("finished", (blob: Blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "memeforge.gif";
        a.click();
        setExporting(false);
      });
      gif.render();
    } catch {
      setExporting(false);
      alert("GIF export failed");
    }
  };

  useEditKeyboardShortcuts({ onSave: share, onGifExport: exportGif, onDownload: download, onCopy: copyImage });

  if (!image) {
    return (
      <p className="p-8 text-paper/50 text-center">
        No image — <Link href="/" className="text-neon hover:underline">go back</Link>
      </p>
    );
  }

  return (
    <main className="min-h-screen w-full bg-smoke">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="studio-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl">
            Edit · <span className="text-neon">{TEMPLATE_LABELS[template]}</span>
          </h1>

          <MemeEditor
            imageSrc={image}
            template={template}
            texts={texts}
            stickers={stickers}
            scene={scene}
            textOffsets={textOffsets}
            onTextOffsetsChange={setTextOffsets}
            width={640}
            height={640}
            className="w-full rounded-xl sm:rounded-2xl shadow-card"
            onCanvasReady={(c) => {
              canvasRef.current = c;
            }}
          />

          <TemplatePicker
            value={template}
            onChange={(t) => {
              setTemplate(t);
              setTexts((prev) => {
                const layers = TEMPLATES[t].layers(prev);
                const next = [...prev];
                while (next.length < layers.length) next.push("");
                return next.slice(0, layers.length);
              });
              setTextOffsets([]);
            }}
          />
          <ScenePicker value={scene} onChange={setScene} />
          <StickerBar stickers={stickers} onChange={setStickers} />

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-paper/40">
            Captions — keyboard friendly
          </p>
          <EmojiSuggest onInsert={insertEmoji} />
          <TextFormatPanel 
            activeLineIndex={activeLine} 
            styles={textStyles}
            onStyleChange={(idx, style) => {
              setTextStyles(prev => {
                const next = [...prev];
                while (next.length <= idx) next.push({});
                next[idx] = style;
                return next;
              });
            }}
          />
          {texts.map((t, i) => (
            <label key={i} className="block">
              <span className="text-[10px] text-paper/35 uppercase">Line {i + 1}</span>
              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={t}
                onFocus={() => setActiveLine(i)}
                onChange={(e) => updateText(i, e.target.value)}
                className={`mt-1 w-full meme-caption bg-ink/60 border rounded-xl px-3 py-2.5 text-base sm:text-lg focus:outline-none transition-colors ${
                  activeLine === i ? "border-neon" : "border-white/10"
                }`}
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={share}
            disabled={saving}
            className="sm:col-span-2 bg-gradient-to-r from-neon to-grape text-ink font-display font-extrabold uppercase py-3 px-4 rounded-full disabled:opacity-50 transition-all hover:shadow-neon"
          >
            {saving ? "Saving…" : "Share →"}
          </button>
          <button type="button" onClick={download} className="py-2.5 px-3 border border-white/15 rounded-full text-xs font-bold uppercase hover:border-neon/50 transition-colors">
            Download PNG
          </button>
          <button type="button" onClick={exportGif} disabled={exporting} className="py-2.5 px-3 border border-white/15 rounded-full text-xs font-bold uppercase hover:border-neon/50 transition-colors disabled:opacity-50">
            {exporting ? "GIF…" : "Export GIF"}
          </button>
          <button type="button" onClick={copyImage} className="sm:col-span-2 py-2.5 px-3 border border-white/15 rounded-full text-xs font-bold uppercase hover:border-neon/50 transition-colors">
            Copy
          </button>
        </div>
        </div>
      </div>
    </main>
  );
}

export default function EditPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<p className="p-8 text-center text-neon animate-pulse">Loading editor…</p>}>
        <EditInner />
      </Suspense>
    </>
  );
}
