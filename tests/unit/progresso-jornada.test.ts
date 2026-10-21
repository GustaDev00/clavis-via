import { describe, expect, it } from "vitest";
import { buildWeek, computeStreak } from "@/lib/domain/journey";
import { computePlanProgress } from "@/lib/domain/progress";

const days = [
  { id: "d3", day_number: 3 },
  { id: "d1", day_number: 1 },
  { id: "d2", day_number: 2 },
];

describe("computePlanProgress", () => {
  it("plano não iniciado: só o dia 1 está disponível", () => {
    const progress = computePlanProgress(days, [], false);
    expect(progress).toMatchObject({
      totalDays: 3,
      completedDays: 0,
      percent: 0,
      isStarted: false,
      isComplete: false,
      nextDayNumber: 1,
    });
    expect([...progress.statusByDay.entries()]).toEqual([
      [1, "available"],
      [2, "locked"],
      [3, "locked"],
    ]);
  });

  it("depois de concluir o dia 1, o dia 2 é liberado", () => {
    const progress = computePlanProgress(days, [{ plan_day_id: "d1", completed_at: "2026-10-19T12:00:00Z" }], true);
    expect(progress.completedDays).toBe(1);
    expect(progress.percent).toBe(33);
    expect(progress.nextDayNumber).toBe(2);
    expect(progress.statusByDay.get(1)).toBe("done");
    expect(progress.statusByDay.get(2)).toBe("available");
    expect(progress.statusByDay.get(3)).toBe("locked");
  });

  it("inscrito sem nenhum dia concluído conta como iniciado", () => {
    expect(computePlanProgress(days, [], true).isStarted).toBe(true);
  });

  it("todos os dias concluídos → plano completo", () => {
    const completions = days.map((day) => ({ plan_day_id: day.id, completed_at: "x" }));
    const progress = computePlanProgress(days, completions, true);
    expect(progress.isComplete).toBe(true);
    expect(progress.percent).toBe(100);
    expect(progress.nextDayNumber).toBeNull();
  });

  it("ignora conclusões de dias que não são do plano", () => {
    const progress = computePlanProgress(days, [{ plan_day_id: "outro-plano", completed_at: "x" }], true);
    expect(progress.completedDays).toBe(0);
  });

  it("plano sem dias não quebra", () => {
    expect(computePlanProgress([], [], false)).toMatchObject({ percent: 0, isComplete: false, nextDayNumber: null });
  });
});

describe("computeStreak", () => {
  const today = "2026-10-19";
  const at = (dayKey: string, time = "15:00:00") => ({ emotion: "paz" as const, created_at: `${dayKey}T${time}Z` });

  it("conta dias consecutivos até hoje", () => {
    expect(computeStreak([at("2026-10-19"), at("2026-10-18"), at("2026-10-17")], today)).toBe(3);
  });

  it("vários check-ins no mesmo dia contam uma vez", () => {
    expect(computeStreak([at("2026-10-19"), at("2026-10-19", "18:00:00")], today)).toBe(1);
  });

  it("a sequência continua se o último check-in foi ontem", () => {
    expect(computeStreak([at("2026-10-18"), at("2026-10-17")], today)).toBe(2);
  });

  it("um dia sem check-in quebra a sequência", () => {
    expect(computeStreak([at("2026-10-19"), at("2026-10-17")], today)).toBe(1);
    expect(computeStreak([at("2026-10-16")], today)).toBe(0);
  });

  it("respeita o fuso: 23h30 de SP conta para o dia de SP", () => {
    // 2026-10-19 02:30Z = 18/10 23:30 em São Paulo
    expect(computeStreak([{ emotion: "paz", created_at: "2026-10-19T02:30:00Z" }], today)).toBe(1);
  });

  it("sem check-ins → zero", () => {
    expect(computeStreak([], today)).toBe(0);
  });
});

describe("buildWeek", () => {
  it("monta 7 dias, marca hoje e usa a emoção mais recente de cada dia", () => {
    const week = buildWeek(
      [
        { emotion: "ansiedade", created_at: "2026-10-19T12:00:00Z" },
        { emotion: "paz", created_at: "2026-10-19T20:00:00Z" },
        { emotion: "cansaco", created_at: "2026-10-15T12:00:00Z" },
      ],
      "2026-10-19",
    );

    expect(week).toHaveLength(7);
    expect(week.at(-1)).toMatchObject({ dayKey: "2026-10-19", isToday: true, emotion: "paz", label: "seg" });
    expect(week.find((day) => day.dayKey === "2026-10-15")?.emotion).toBe("cansaco");
    expect(week.filter((day) => day.emotion === null)).toHaveLength(5);
  });
});
