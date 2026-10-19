import { describe, expect, it } from "vitest";
import { EMOTION_IDS, type Emotion } from "@/lib/domain/emotions";
import { computePlanProgress } from "@/lib/domain/progress";
import { FALLBACK_PRACTICE_SLUG, pickPlan, pickPractice, stableHash } from "@/lib/domain/recommendation";

// Espelho reduzido do seed (supabase/migrations/*_seed_content.sql)
const practices = [
  { slug: "respiracao-quadrada", emotions: ["ansiedade"], sort_order: 10 },
  { slug: "cinco-sentidos", emotions: ["ansiedade", "sensibilidade"], sort_order: 20 },
  { slug: "pausa-sem-culpa", emotions: ["cansaco"], sort_order: 30 },
  { slug: "respiracao-alongada", emotions: ["irritacao", "cansaco"], sort_order: 40 },
  { slug: "um-pequeno-passo", emotions: ["desanimo"], sort_order: 50 },
  { slug: "nomear-e-soltar", emotions: ["irritacao", "desanimo"], sort_order: 60 },
  { slug: "mao-no-coracao", emotions: ["sensibilidade"], sort_order: 70 },
  { slug: "tres-coisas-boas", emotions: ["paz", "esperanca"], sort_order: 80 },
  { slug: "intencao-do-dia", emotions: ["esperanca"], sort_order: 90 },
  { slug: "minuto-de-silencio", emotions: ["paz", "cansaco", "esperanca"], sort_order: 100 },
  { slug: FALLBACK_PRACTICE_SLUG, emotions: ["outro"], sort_order: 110 },
] satisfies { slug: string; emotions: Emotion[]; sort_order: number }[];

const plans = [
  { slug: "quando-a-ansiedade-aperta", emotions: ["ansiedade", "sensibilidade"], sort_order: 10 },
  { slug: "voz-e-limites", emotions: ["irritacao", "cansaco"], sort_order: 20 },
  { slug: "recomecar-com-leveza", emotions: ["desanimo", "cansaco"], sort_order: 30 },
  { slug: "fe-em-dias-cansados", emotions: ["paz", "esperanca", "cansaco"], sort_order: 40 },
] satisfies { slug: string; emotions: Emotion[]; sort_order: number }[];

const DAY = "2026-10-19";

describe("pickPractice", () => {
  it.each(EMOTION_IDS)("a prática recomendada para '%s' é indicada para essa emoção", (emotion) => {
    const practice = pickPractice(practices, emotion, DAY);
    expect(practice?.emotions).toContain(emotion);
  });

  it("a recomendação varia conforme o check-in", () => {
    const anxious = pickPractice(practices, "ansiedade", DAY);
    const peaceful = pickPractice(practices, "paz", DAY);
    expect(anxious?.slug).not.toBe(peaceful?.slug);
  });

  it("é determinística: o mesmo dia e emoção sempre retornam a mesma prática", () => {
    const first = pickPractice(practices, "cansaco", DAY);
    for (let attempt = 0; attempt < 20; attempt++) {
      expect(pickPractice(practices, "cansaco", DAY)?.slug).toBe(first?.slug);
    }
  });

  it("alterna entre as opções ao longo dos dias quando há mais de uma", () => {
    const slugs = new Set(
      Array.from({ length: 30 }, (_, day) =>
        pickPractice(practices, "cansaco", `2026-10-${String(day + 1).padStart(2, "0")}`)?.slug,
      ),
    );
    expect(slugs.size).toBeGreaterThan(1);
  });

  it("não depende da ordem em que as práticas chegam do banco", () => {
    const reversed = [...practices].reverse();
    expect(pickPractice(reversed, "ansiedade", DAY)?.slug).toBe(pickPractice(practices, "ansiedade", DAY)?.slug);
  });

  it("sem check-in, usa a prática de presença", () => {
    expect(pickPractice(practices, null, DAY)?.slug).toBe(FALLBACK_PRACTICE_SLUG);
  });

  it("sem prática para a emoção, cai na prática de presença", () => {
    const onlyAnxiety = practices.filter((practice) => practice.slug !== "tres-coisas-boas" && practice.slug !== "minuto-de-silencio");
    expect(pickPractice(onlyAnxiety, "paz", DAY)?.slug).toBe(FALLBACK_PRACTICE_SLUG);
  });

  it("lista vazia retorna null", () => {
    expect(pickPractice([], "ansiedade", DAY)).toBeNull();
  });
});

describe("pickPlan", () => {
  const noProgress = new Map();

  it("sugere um plano ligado à emoção", () => {
    expect(pickPlan(plans, "ansiedade", noProgress)?.slug).toBe("quando-a-ansiedade-aperta");
    expect(pickPlan(plans, "desanimo", noProgress)?.slug).toBe("recomecar-com-leveza");
  });

  it("prioriza um plano já começado", () => {
    const started = new Map([
      ["fe-em-dias-cansados", computePlanProgress([{ id: "d1", day_number: 1 }], [], true)],
    ]);
    expect(pickPlan(plans, "cansaco", started)?.slug).toBe("fe-em-dias-cansados");
  });

  it("não sugere planos concluídos", () => {
    const done = new Map([
      [
        "quando-a-ansiedade-aperta",
        computePlanProgress([{ id: "d1", day_number: 1 }], [{ plan_day_id: "d1", completed_at: "x" }], true),
      ],
    ]);
    expect(pickPlan(plans, "ansiedade", done)).toBeNull();
  });

  it("sem emoção, não sugere plano", () => {
    expect(pickPlan(plans, null, noProgress)).toBeNull();
  });
});

describe("stableHash", () => {
  it("é estável e não negativo", () => {
    expect(stableHash("clavis")).toBe(stableHash("clavis"));
    expect(stableHash("clavis")).toBeGreaterThanOrEqual(0);
    expect(stableHash("clavis")).not.toBe(stableHash("via"));
  });
});
