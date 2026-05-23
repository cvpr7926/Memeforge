import type { SceneId } from "./types";

export const SCENE_LABELS: Record<SceneId, string> = {
  none: "Original",
  void: "Void",
  sunset: "Sunset",
  office: "Corporate hell",
  matrix: "Matrix",
};

export function drawSceneBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scene: SceneId,
) {
  if (scene === "none") return;

  const g = ctx.createLinearGradient(0, 0, w, h);
  switch (scene) {
    case "void":
      g.addColorStop(0, "#0a0014");
      g.addColorStop(1, "#1a0030");
      break;
    case "sunset":
      g.addColorStop(0, "#ff6b35");
      g.addColorStop(0.5, "#ff2d6a");
      g.addColorStop(1, "#7c3aed");
      break;
    case "office":
      g.addColorStop(0, "#d4d4d8");
      g.addColorStop(1, "#a1a1aa");
      break;
    case "matrix":
      g.addColorStop(0, "#001a00");
      g.addColorStop(1, "#003300");
      break;
    default:
      return;
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
