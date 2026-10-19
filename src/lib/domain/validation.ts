import { z } from "zod";
import { EMOTION_IDS } from "./emotions";

/**
 * Regras de entrada compartilhadas entre o formulário (feedback imediato)
 * e as Server Actions (fonte da verdade). O banco tem CHECKs equivalentes.
 */

export const LIMITS = {
  displayName: 40,
  checkInNote: 280,
  otherEmotionMin: 2,
  reflection: 1000,
} as const;

/** Remove espaços nas pontas e colapsa espaços internos repetidos. */
export function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Igual a normalizeText, mas preserva quebras de linha (textos longos). */
export function normalizeMultiline(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const NAME_PATTERN = /^[\p{L}\p{M}\p{N} .'’-]+$/u;

export const displayNameSchema = z
  .preprocess(normalizeText, z.string())
  .pipe(
    z
      .string()
      .max(LIMITS.displayName, `Use até ${LIMITS.displayName} caracteres.`)
      .refine((value) => value === "" || NAME_PATTERN.test(value), {
        message: "Use apenas letras, números, espaços, ponto, apóstrofo ou hífen.",
      }),
  )
  .transform((value) => value || "Visitante");

export const enterDemoSchema = z.object({
  displayName: displayNameSchema,
});

export const checkInSchema = z
  .object({
    emotion: z.enum(EMOTION_IDS, { error: "Escolha o que está mais presente em você agora." }),
    note: z
      .preprocess(normalizeMultiline, z.string())
      .pipe(z.string().max(LIMITS.checkInNote, `Use até ${LIMITS.checkInNote} caracteres.`)),
  })
  .superRefine((value, context) => {
    if (value.emotion === "outro" && value.note.length < LIMITS.otherEmotionMin) {
      context.addIssue({
        code: "custom",
        path: ["note"],
        message: "Conte em poucas palavras o que você está sentindo.",
      });
    }
  })
  .transform((value) => ({ emotion: value.emotion, note: value.note || null }));

export const reflectionSchema = z
  .preprocess(normalizeMultiline, z.string())
  .pipe(z.string().max(LIMITS.reflection, `Use até ${LIMITS.reflection} caracteres.`))
  .transform((value) => value || null);

export const completePlanDaySchema = z.object({
  planSlug: z.string().min(1).max(80),
  dayNumber: z.coerce.number().int().min(1).max(365),
  reflection: reflectionSchema,
});

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

/** Converte erros do Zod em um objeto { campo: primeira mensagem }. */
export function toFieldErrors<Field extends string>(error: z.ZodError): FieldErrors<Field> {
  const fieldErrors: FieldErrors<Field> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as Field | undefined;
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}
