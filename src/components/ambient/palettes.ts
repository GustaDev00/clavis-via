import type { EmotionTone } from "@/lib/domain/emotions";

/** Quatro cores (hex) que a aurora mistura. "aurora" é o padrão da marca. */
const AURORA: [string, string, string, string] = ["#cfe0f5", "#dcd3f3", "#f7d3dd", "#e3ecf8"];

export const AMBIENT_PALETTES: Record<EmotionTone | "brand", [string, string, string, string]> = {
  /** Tom da marca = a aurora padrão (sem emoção registrada) */
  brand: AURORA,
  aurora: AURORA,
  peach: ["#fde3d3", "#f9cfb3", "#f7d3dd", "#fdede3"],
  sky: ["#cfe0f5", "#bcd3f0", "#dcd3f3", "#e3ecf8"],
  lavender: ["#dcd3f3", "#c6b9ec", "#cfe0f5", "#ece7f8"],
  rose: ["#f7d3dd", "#f8bbcb", "#fdede3", "#fbe6ec"],
  blush: ["#f7d3dd", "#e7c6e6", "#dcd3f3", "#fbe6ec"],
  sage: ["#cfeadb", "#b9e0cb", "#cfe0f5", "#e2f3ea"],
  mist: ["#e3e7f1", "#dcd3f3", "#cfe0f5", "#eff2f9"],
};

export type AmbientTone = keyof typeof AMBIENT_PALETTES;

export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
