/**
 * Extrai a melhor cor de fundo para uma logo.
 *
 * Estratégia (colorthief v3):
 *  1. Pega swatches semânticos (Vibrant / DarkVibrant / Muted / DarkMuted / LightVibrant / LightMuted)
 *  2. Pega também a cor dominante
 *  3. Decide a melhor com base na "logo":
 *     - se a logo já é dominantemente escura, prefere DarkMuted / DarkVibrant
 *     - senão, prefere Vibrant > DarkVibrant > Muted > dominante
 *     - descarta cores quase-brancas
 *
 * Roda só no client.
 */

import { getSwatchesSync, getColorSync, type Color } from "colorthief";

export async function extractLogoBgFromUrl(
  url: string
): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(extractFromImg(img));
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function extractLogoBgFromFile(
  file: File
): Promise<string | null> {
  const objUrl = URL.createObjectURL(file);
  try {
    return await extractLogoBgFromUrl(objUrl);
  } finally {
    URL.revokeObjectURL(objUrl);
  }
}

function extractFromImg(img: HTMLImageElement): string | null {
  try {
    const swatches = getSwatchesSync(img, { colorCount: 8 });
    const dominant = getColorSync(img);

    const order: (keyof typeof swatches)[] = [
      "Vibrant",
      "DarkVibrant",
      "Muted",
      "DarkMuted",
      "LightVibrant",
      "LightMuted",
    ];

    const candidates: Color[] = [];
    for (const role of order) {
      const s = swatches[role];
      if (s) candidates.push(s.color);
    }
    if (dominant) candidates.push(dominant);

    const filtered = candidates.filter((c) => !isNearWhite(c));
    const pool = filtered.length ? filtered : candidates;

    const dominantIsDark = dominant?.isDark ?? false;

    pool.sort((a, b) => score(b, dominantIsDark) - score(a, dominantIsDark));
    const best = pool[0];
    return best ? best.hex() : dominant ? dominant.hex() : null;
  } catch {
    return null;
  }
}

function isNearWhite(c: Color): boolean {
  const { r, g, b } = c.rgb();
  return r > 240 && g > 240 && b > 240;
}

function score(c: Color, dominantIsDark: boolean): number {
  const { s, l } = c.hsl();
  const sat = s / 100;
  const light = l / 100;
  let total = 0;
  total += sat * 60;
  if (dominantIsDark) {
    total += (1 - light) * 40;
  } else {
    total += (light > 0.2 && light < 0.85 ? 1 : 0) * 30;
  }
  total += c.proportion * 20;
  return total;
}
