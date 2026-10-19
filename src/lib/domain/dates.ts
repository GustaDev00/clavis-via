/**
 * Datas do app são calculadas no fuso de São Paulo: "hoje" é o dia civil de quem usa,
 * não o dia em UTC (às 22h em SP já é o dia seguinte em UTC).
 */
export const APP_TIME_ZONE = "America/Sao_Paulo";

/** Chave de dia no formato YYYY-MM-DD, no fuso informado. */
export function toDayKey(date: Date, timeZone: string = APP_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Deslocamento do fuso em minutos para um instante (ex.: São Paulo = -180). */
export function timeZoneOffsetMinutes(date: Date, timeZone: string = APP_TIME_ZONE): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  // "GMT" (UTC) ou "GMT-03:00"
  const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes);
  return sign === "-" ? -total : total;
}

/** Intervalo [início, fim) em UTC do dia civil que contém `date` no fuso informado. */
export function dayRange(date: Date, timeZone: string = APP_TIME_ZONE): { start: Date; end: Date } {
  const dayKey = toDayKey(date, timeZone);
  const start = startOfDayKey(dayKey, timeZone);
  const end = startOfDayKey(addDays(dayKey, 1), timeZone);
  return { start, end };
}

function startOfDayKey(dayKey: string, timeZone: string): Date {
  const utcMidnight = new Date(`${dayKey}T00:00:00Z`);
  // O offset é avaliado ao meio-dia para não cair em transições de horário de verão
  const offset = timeZoneOffsetMinutes(new Date(`${dayKey}T12:00:00Z`), timeZone);
  return new Date(utcMidnight.getTime() - offset * 60_000);
}

/** Soma (ou subtrai) dias a uma chave YYYY-MM-DD. */
export function addDays(dayKey: string, amount: number): string {
  const date = new Date(`${dayKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** Últimos `count` dias terminando em `todayKey` (inclusive), do mais antigo para o mais recente. */
export function lastDays(todayKey: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => addDays(todayKey, index - (count - 1)));
}

/** Saudação conforme a hora local. */
export function greetingFor(date: Date, timeZone: string = APP_TIME_ZONE): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }).format(date),
  );
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" });

/** Rótulo curto do dia da semana ("seg", "ter"...) para uma chave de dia. */
export function weekdayLabel(dayKey: string): string {
  return weekdayFormatter.format(new Date(`${dayKey}T12:00:00Z`)).replace(".", "");
}

/** "Hoje, 14:32", "Ontem, 09:10" ou "12 out, 18:40". */
export function formatMoment(iso: string, now: Date = new Date(), timeZone: string = APP_TIME_ZONE): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat("pt-BR", { timeZone, hour: "2-digit", minute: "2-digit" }).format(date);
  const dayKey = toDayKey(date, timeZone);
  const todayKey = toDayKey(now, timeZone);

  if (dayKey === todayKey) return `Hoje, ${time}`;
  if (dayKey === addDays(todayKey, -1)) return `Ontem, ${time}`;

  const day = new Intl.DateTimeFormat("pt-BR", { timeZone, day: "numeric", month: "short" })
    .format(date)
    .replace(".", "")
    .replace(" de ", " ");
  return `${day}, ${time}`;
}
