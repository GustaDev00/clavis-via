import type { Database } from "@/lib/supabase/database.types";

export type Emotion = Database["public"]["Enums"]["emotion"];

export type EmotionTone = "peach" | "sky" | "lavender" | "rose" | "blush" | "sage" | "aurora" | "mist";

export type EmotionMeta = {
  id: Emotion;
  /** Rótulo exibido no seletor (substantivo, neutro em gênero) */
  label: string;
  /** Frase usada em "Você chegou com ___" */
  phrase: string;
  tone: EmotionTone;
};

/**
 * Catálogo de emoções do check-in. A ordem é a ordem de exibição.
 * Usamos substantivos ("Ansiedade", "Cansaço") para não presumir gênero de quem usa o app.
 */
export const EMOTIONS: readonly EmotionMeta[] = [
  { id: "ansiedade", label: "Ansiedade", phrase: "ansiedade", tone: "peach" },
  { id: "cansaco", label: "Cansaço", phrase: "cansaço", tone: "sky" },
  { id: "desanimo", label: "Desânimo", phrase: "desânimo", tone: "lavender" },
  { id: "irritacao", label: "Irritação", phrase: "irritação", tone: "rose" },
  { id: "sensibilidade", label: "Sensibilidade", phrase: "sensibilidade", tone: "blush" },
  { id: "paz", label: "Paz", phrase: "paz", tone: "sage" },
  { id: "esperanca", label: "Esperança", phrase: "esperança", tone: "aurora" },
  { id: "outro", label: "Outro", phrase: "algo que é só seu", tone: "mist" },
] as const;

export const EMOTION_IDS = EMOTIONS.map((emotion) => emotion.id) as [Emotion, ...Emotion[]];

const EMOTIONS_BY_ID = new Map(EMOTIONS.map((emotion) => [emotion.id, emotion]));

export function getEmotion(id: Emotion): EmotionMeta {
  const emotion = EMOTIONS_BY_ID.get(id);
  if (!emotion) throw new Error(`Emoção desconhecida: ${id}`);
  return emotion;
}
