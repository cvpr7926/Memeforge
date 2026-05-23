"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

export function WebcamCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError("Camera blocked — allow permission or upload a file instead.");
      }
    })();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const snap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.88));
    onClose();
  }, [onCapture, onClose]);

  return (
    <div className="rounded-2xl border border-neon/30 bg-ink/90 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-display font-bold text-sm">Webcam</p>
        <button type="button" onClick={onClose} className="text-paper/50 hover:text-punch text-sm">
          ✕
        </button>
      </div>
      {error ? (
        <p className="text-sm text-punch">{error}</p>
      ) : (
        <>
          <video ref={videoRef} className="w-full rounded-xl bg-black aspect-[4/3] object-cover" muted playsInline />
          <button
            type="button"
            onClick={snap}
            className="w-full bg-neon text-ink font-bold py-3 rounded-full uppercase text-sm"
          >
            Snap photo 📸
          </button>
        </>
      )}
    </div>
  );
}
