import { describe, expect, it } from "vitest";
import {
  checkInSchema,
  completePlanDaySchema,
  enterDemoSchema,
  LIMITS,
  normalizeMultiline,
  normalizeText,
  toFieldErrors,
} from "@/lib/domain/validation";

const repeat = (length: number, char = "a") => char.repeat(length);

describe("normalização de texto", () => {
  it("remove espaços extras nas pontas e no meio", () => {
    expect(normalizeText("   Ana    Clara  ")).toBe("Ana Clara");
    expect(normalizeText("\t\n Ana \n")).toBe("Ana");
  });

  it("valores que não são texto viram string vazia", () => {
    expect(normalizeText(null)).toBe("");
    expect(normalizeText(42)).toBe("");
  });

  it("texto multilinha preserva parágrafos mas limita linhas em branco", () => {
    expect(normalizeMultiline("  linha 1  \r\n\r\n\r\n\r\n   linha 2   ")).toBe("linha 1\n\nlinha 2");
  });
});

describe("enterDemoSchema (nome do visitante)", () => {
  it("nome vazio ou só espaços vira 'Visitante'", () => {
    expect(enterDemoSchema.parse({ displayName: "" }).displayName).toBe("Visitante");
    expect(enterDemoSchema.parse({ displayName: "     " }).displayName).toBe("Visitante");
    expect(enterDemoSchema.parse({ displayName: null }).displayName).toBe("Visitante");
  });

  it("aceita nomes com acento, apóstrofo e hífen", () => {
    for (const name of ["Ana", "João Pedro", "Maria-Luísa", "D'Ávila", "Zoë", "Ana 2"]) {
      expect(enterDemoSchema.parse({ displayName: name }).displayName).toBe(name);
    }
  });

  it(`aceita exatamente ${LIMITS.displayName} caracteres e recusa ${LIMITS.displayName + 1}`, () => {
    expect(enterDemoSchema.safeParse({ displayName: repeat(LIMITS.displayName) }).success).toBe(true);
    const tooLong = enterDemoSchema.safeParse({ displayName: repeat(LIMITS.displayName + 1) });
    expect(tooLong.success).toBe(false);
    if (!tooLong.success) {
      expect(toFieldErrors(tooLong.error)).toEqual({ displayName: `Use até ${LIMITS.displayName} caracteres.` });
    }
  });

  it("recusa HTML, emojis e símbolos", () => {
    for (const name of ["<script>alert(1)</script>", "Ana 🌸", "ana@email.com", "{{nome}}"]) {
      expect(enterDemoSchema.safeParse({ displayName: name }).success).toBe(false);
    }
  });
});

describe("checkInSchema", () => {
  it("exige uma emoção", () => {
    const result = checkInSchema.safeParse({ emotion: undefined, note: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).emotion).toBe("Escolha o que está mais presente em você agora.");
    }
  });

  it("recusa emoções fora do catálogo", () => {
    expect(checkInSchema.safeParse({ emotion: "euforia", note: "" }).success).toBe(false);
  });

  it("nota é opcional e vazia vira null", () => {
    expect(checkInSchema.parse({ emotion: "ansiedade", note: "   " })).toEqual({ emotion: "ansiedade", note: null });
  });

  it(`nota com ${LIMITS.checkInNote} caracteres passa; com ${LIMITS.checkInNote + 1} não`, () => {
    expect(checkInSchema.safeParse({ emotion: "paz", note: repeat(LIMITS.checkInNote) }).success).toBe(true);
    const result = checkInSchema.safeParse({ emotion: "paz", note: repeat(LIMITS.checkInNote + 1) });
    expect(result.success).toBe(false);
  });

  it("'Outro' exige descrever o que sente", () => {
    for (const note of ["", "   ", "a"]) {
      const result = checkInSchema.safeParse({ emotion: "outro", note });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(toFieldErrors(result.error).note).toBe("Conte em poucas palavras o que você está sentindo.");
      }
    }
    expect(checkInSchema.parse({ emotion: "outro", note: "saudade" })).toEqual({ emotion: "outro", note: "saudade" });
  });

  it("aceita texto com emojis, acentos e quebras de linha na nota", () => {
    const note = "Hoje foi intenso 😮‍💨\nMas estou aqui.";
    expect(checkInSchema.parse({ emotion: "cansaco", note }).note).toBe(note);
  });
});

describe("completePlanDaySchema", () => {
  it("reflexão é opcional", () => {
    expect(completePlanDaySchema.parse({ planSlug: "voz-e-limites", dayNumber: "1", reflection: "" })).toEqual({
      planSlug: "voz-e-limites",
      dayNumber: 1,
      reflection: null,
    });
  });

  it(`reflexão longa até ${LIMITS.reflection} caracteres`, () => {
    const ok = completePlanDaySchema.safeParse({ planSlug: "x", dayNumber: 1, reflection: repeat(LIMITS.reflection) });
    const tooLong = completePlanDaySchema.safeParse({
      planSlug: "x",
      dayNumber: 1,
      reflection: repeat(LIMITS.reflection + 1),
    });
    expect(ok.success).toBe(true);
    expect(tooLong.success).toBe(false);
  });

  it("recusa dia inválido", () => {
    for (const dayNumber of ["0", "-1", "abc", "1.5"]) {
      expect(completePlanDaySchema.safeParse({ planSlug: "x", dayNumber, reflection: "" }).success).toBe(false);
    }
  });
});
