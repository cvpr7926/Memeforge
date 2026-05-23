/**
 * Keyboard Shortcuts Handler
 * Add this to your app/edit/page.tsx EditInner component
 * 
 * Shortcuts:
 * Ctrl/Cmd + S = Save/Share
 * Ctrl/Cmd + G = Export as GIF  
 * Ctrl/Cmd + E = Download PNG
 * Ctrl/Cmd + Shift + C = Copy to Clipboard
 * Ctrl/Cmd + Z = Undo (if you implement history)
 */

import { useEffect } from "react";

export function useEditKeyboardShortcuts({
  onSave,
  onGifExport,
  onDownload,
  onCopy,
  onUndo,
  onRedo,
}: {
  onSave: () => Promise<void>;
  onGifExport: () => Promise<void>;
  onDownload: () => Promise<void>;
  onCopy: () => Promise<void>;
  onUndo?: () => void;
  onRedo?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (!isCtrlOrCmd) return;

      // Ctrl/Cmd + S = Save/Share
      if (e.key === "s") {
        e.preventDefault();
        onSave().catch(console.error);
      }
      // Ctrl/Cmd + G = Export GIF
      else if (e.key === "g") {
        e.preventDefault();
        onGifExport().catch(console.error);
      }
      // Ctrl/Cmd + E = Download PNG
      else if (e.key === "e") {
        e.preventDefault();
        onDownload().catch(console.error);
      }
      // Ctrl/Cmd + Shift + C = Copy to Clipboard
      else if (e.key === "c" && e.shiftKey) {
        e.preventDefault();
        onCopy().catch(console.error);
      }
      // Ctrl/Cmd + Z = Undo
      else if (e.key === "z" && !e.shiftKey && onUndo) {
        e.preventDefault();
        onUndo();
      }
      // Ctrl/Cmd + Shift + Z = Redo
      else if ((e.key === "z" && e.shiftKey) || (e.key === "y" && isCtrlOrCmd)) {
        if (onRedo) {
          e.preventDefault();
          onRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onGifExport, onDownload, onCopy, onUndo, onRedo]);
}

/**
 * Usage in EditInner component:
 * 
 * useEditKeyboardShortcuts({
 *   onSave: share,
 *   onGifExport: exportGif,
 *   onDownload: download,
 *   onCopy: copyImage,
 * });
 */
