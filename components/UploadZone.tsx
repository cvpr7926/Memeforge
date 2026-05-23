"use client";

import { useCallback, useRef, useState } from "react";
import { WebcamCapture } from "./WebcamCapture";

type Props = {
  onImage: (dataUrl: string) => void;
  disabled?: boolean;
};

export function UploadZone({ onImage, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [webcam, setWebcam] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file?.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onImage(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [onImage],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = [...e.clipboardData.items]
        .find((i) => i.type.startsWith("image/"))
        ?.getAsFile();
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (webcam) {
    return <WebcamCapture onCapture={onImage} onClose={() => setWebcam(false)} />;
  }

  return (
    <div
      onPaste={onPaste}
      tabIndex={0}
      className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 outline-none ${
        dragging
          ? "border-neon bg-neon/10 scale-[1.01] shadow-neon"
          : "border-white/15 hover:border-neon/40 hover:bg-white/[0.02]"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-punch/30 to-grape/30 flex items-center justify-center text-3xl border border-white/10">
        📷
      </div>
      <p className="font-display font-bold text-xl sm:text-2xl">Drop your photo here</p>
      <p className="text-paper/50 mt-2 text-sm">drag · paste · or use buttons below</p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="px-5 py-2.5 rounded-full bg-neon text-ink font-bold text-xs uppercase tracking-wide hover:shadow-neon transition-all"
        >
          Upload file
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setWebcam(true)}
          className="px-5 py-2.5 rounded-full border border-white/20 font-bold text-xs uppercase tracking-wide hover:border-neon transition-colors"
        >
          Webcam
        </button>
      </div>
    </div>
  );
}
