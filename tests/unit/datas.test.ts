import { describe, expect, it } from "vitest";
import {
  addDays,
  dayRange,
  formatMoment,
  greetingFor,
  lastDays,
  timeZoneOffsetMinutes,
  toDayKey,
  weekdayLabel,
} from "@/lib/domain/dates";

describe("toDayKey", () => {
  it("usa o dia civil de São Paulo, não o de UTC", () => {
    // 23:30 em SP = 02:30 do dia seguinte em UTC
    const lateNightInSaoPaulo = new Date("2026-10-20T02:30:00Z");
    expect(toDayKey(lateNightInSaoPaulo)).toBe("2026-10-19");
    expect(toDayKey(lateNightInSaoPaulo, "UTC")).toBe("2026-10-20");
  });
});

describe("timeZoneOffsetMinutes", () => {
  it("São Paulo está em UTC-3", () => {
    expect(timeZoneOffsetMinutes(new Date("2026-10-19T12:00:00Z"))).toBe(-180);
  });

  it("UTC tem deslocamento zero", () => {
    expect(timeZoneOffsetMinutes(new Date("2026-10-19T12:00:00Z"), "UTC")).toBe(0);
  });
});

describe("dayRange", () => {
  it("retorna o intervalo [00:00, 24:00) de São Paulo em UTC", () => {
    const { start, end } = dayRange(new Date("2026-10-19T15:00:00Z"));
    expect(start.toISOString()).toBe("2026-10-19T03:00:00.000Z");
    expect(end.toISOString()).toBe("2026-10-20T03:00:00.000Z");
  });

  it("um check-in às 23h59 de SP ainda pertence ao mesmo dia", () => {
    const { start, end } = dayRange(new Date("2026-10-19T12:00:00Z"));
    const lastMinute = new Date("2026-10-20T02:59:00Z");
    expect(lastMinute >= start && lastMinute < end).toBe(true);
  });
});

describe("addDays / lastDays", () => {
  it("atravessa fim de mês e de ano", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("lastDays retorna 7 dias em ordem, terminando hoje", () => {
    const week = lastDays("2026-10-19", 7);
    expect(week).toHaveLength(7);
    expect(week[0]).toBe("2026-10-13");
    expect(week.at(-1)).toBe("2026-10-19");
  });
});

describe("greetingFor", () => {
  it.each([
    ["2026-10-19T10:00:00Z", "Bom dia"], // 07h em SP
    ["2026-10-19T17:00:00Z", "Boa tarde"], // 14h em SP
    ["2026-10-19T23:00:00Z", "Boa noite"], // 20h em SP
    ["2026-10-19T06:00:00Z", "Boa noite"], // 03h em SP
  ])("%s → %s", (iso, expected) => {
    expect(greetingFor(new Date(iso))).toBe(expected);
  });
});

describe("weekdayLabel", () => {
  it("abrevia em português sem ponto", () => {
    expect(weekdayLabel("2026-10-19")).toBe("seg");
    expect(weekdayLabel("2026-10-25")).toBe("dom");
  });
});

describe("formatMoment", () => {
  const now = new Date("2026-10-19T15:00:00Z"); // 12h em SP

  it("mostra 'Hoje' e 'Ontem' com o horário de SP", () => {
    expect(formatMoment("2026-10-19T13:05:00Z", now)).toBe("Hoje, 10:05");
    expect(formatMoment("2026-10-18T22:40:00Z", now)).toBe("Ontem, 19:40");
  });

  it("datas mais antigas mostram dia e mês", () => {
    expect(formatMoment("2026-10-12T21:40:00Z", now)).toBe("12 out, 18:40");
  });
});
