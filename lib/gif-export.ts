/**
 * GIF Export Utility
 * Provides functionality to export memes as animated GIFs
 * Uses gif.js library for encoding
 */

export async function exportMemeAsGif(
  canvas: HTMLCanvasElement,
  options: {
    filename?: string;
    frameCount?: number;
    frameDelay?: number;
  } = {}
) {
  const {
    filename = `meme-${Date.now()}.gif`,
    frameCount = 20,
    frameDelay = 100,
  } = options;

  try {
    // Dynamically import gif.js to keep bundle size down
    const GIFModule = await import("gif.js");
    const GIF = GIFModule.default;

    return new Promise<Blob>((resolve, reject) => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: undefined, // Uses default
      });

      // Create animation frames with fade-in and scale effect
      for (let i = 0; i < frameCount; i++) {
        const progress = i / frameCount;
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const ctx = frameCanvas.getContext("2d");
        if (!ctx) continue;

        // Draw base canvas
        ctx.drawImage(canvas, 0, 0);

        // Add subtle animation effect (fade glow)
        const alpha = Math.sin(progress * Math.PI) * 0.15;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        gif.addFrame(frameCanvas, { delay: frameDelay });
      }

      gif.on("finished", (blob: Blob) => {
        resolve(blob);
      });

      gif.on("error", reject);

      gif.render();
    });
  } catch (error) {
    console.error("GIF export failed:", error);
    throw new Error(
      "GIF export requires gif.js library. Make sure it's installed: npm install gif.js"
    );
  }
}

/**
 * Download GIF blob to user's computer
 */
export function downloadGif(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy GIF blob to clipboard
 */
export async function copyGifToClipboard(blob: Blob) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/gif": blob }),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
