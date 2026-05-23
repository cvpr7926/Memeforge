/**
 * Background Removal Utility
 * Integrates with remove.bg API to remove backgrounds from images
 * Free tier: 50 images per month
 */

export interface BackgroundRemovalOptions {
  type?: "auto" | "person" | "product";
  format?: "PNG" | "ZIP";
  quality?: "preview" | "regular" | "hd";
}

/**
 * Remove background from image using remove.bg API
 * Requires REMOVEBG_API_KEY environment variable
 */
export async function removeBackground(
  imageDataUrl: string,
  options: BackgroundRemovalOptions = {}
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY;

  if (!apiKey) {
    throw new Error(
      "REMOVEBG_API_KEY not configured. Sign up at https://remove.bg/api"
    );
  }

  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append("image_file", blob);
    formData.append("format", options.format || "PNG");
    formData.append("type", options.type || "auto");
    formData.append("quality", options.quality || "regular");

    // Call remove.bg API
    const result = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!result.ok) {
      const error = await result.text();
      throw new Error(`Remove.bg API error: ${result.statusText} - ${error}`);
    }

    // Convert result blob to data URL
    const resultBlob = await result.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });
  } catch (error) {
    console.error("Background removal failed:", error);
    throw error;
  }
}

/**
 * Check if remove.bg API is available (API key configured)
 */
export function isBackgroundRemovalAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_REMOVEBG_API_KEY;
}

/**
 * Get remaining API credits (requires separate API call)
 */
export async function getRemoveBgCredits(): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.remove.bg/v1.0/account", {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { credits: { remaining: number } };
    return data.credits.remaining;
  } catch (error) {
    console.error("Failed to fetch credits:", error);
    return null;
  }
}
