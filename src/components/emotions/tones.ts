import type { EmotionTone } from "@/lib/domain/emotions";

type ToneStyle = {
  /** Gradiente do rosto */
  from: string;
  to: string;
  /** Fundo do tile/cartão quando a emoção está ativa */
  surface: string;
  /** Texto/ícones legíveis sobre o fundo (AA) */
  ink: string;
};

export const TONES: Record<EmotionTone, ToneStyle> = {
  peach: { from: "#fff3e6", to: "#f9cfb3", surface: "linear-gradient(160deg,#fdede3 0%,#fbe6ec 100%)", ink: "#9a4a1f" },
  sky: { from: "#eef4fc", to: "#bcd3f0", surface: "linear-gradient(160deg,#e3ecf8 0%,#cfe0f5 100%)", ink: "#2f5689" },
  lavender: { from: "#f3f0fb", to: "#c6b9ec", surface: "linear-gradient(160deg,#ece7f8 0%,#dcd3f3 100%)", ink: "#5b4a9e" },
  rose: { from: "#fdf0f3", to: "#f8bbcb", surface: "linear-gradient(160deg,#fbe6ec 0%,#f7d3dd 100%)", ink: "#9c3a5a" },
  blush: { from: "#fbeef4", to: "#e7c6e6", surface: "linear-gradient(160deg,#fbe6ec 0%,#ece7f8 100%)", ink: "#7a3f78" },
  sage: { from: "#eef8f2", to: "#b9e0cb", surface: "linear-gradient(160deg,#e2f3ea 0%,#e3ecf8 100%)", ink: "#1f6e4d" },
  aurora: { from: "#eef4fc", to: "#d6cbf2", surface: "linear-gradient(160deg,#e3ecf8 0%,#ece7f8 55%,#fbe6ec 100%)", ink: "#5b4a9e" },
  mist: { from: "#f7f8fc", to: "#dfe3ee", surface: "linear-gradient(160deg,#eff2f9 0%,#e8ecf5 100%)", ink: "#3a4566" },
};

/** Gradientes de capa dos planos (chave `palette` no banco). */
export const PLAN_PALETTES: Record<string, string> = {
  azul: "radial-gradient(120% 90% at 20% 10%, #cfe0f5 0%, transparent 60%), radial-gradient(100% 80% at 90% 90%, #dcd3f3 0%, transparent 55%), #e3ecf8",
  lavanda:
    "radial-gradient(120% 90% at 80% 0%, #f7d3dd 0%, transparent 55%), radial-gradient(110% 90% at 10% 100%, #c6b9ec 0%, transparent 60%), #ece7f8",
  rosa: "radial-gradient(120% 90% at 10% 0%, #fdede3 0%, transparent 55%), radial-gradient(110% 90% at 90% 100%, #f8bbcb 0%, transparent 60%), #fbe6ec",
  aurora:
    "radial-gradient(120% 80% at 15% 0%, #cfe0f5 0%, transparent 60%), radial-gradient(100% 70% at 100% 35%, #f7d3dd 0%, transparent 55%), radial-gradient(90% 60% at 50% 100%, #dcd3f3 0%, transparent 60%), #f7f8fc",
};

export function planPalette(key: string) {
  return PLAN_PALETTES[key] ?? PLAN_PALETTES.aurora;
}
