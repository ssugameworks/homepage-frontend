import dayjs from "dayjs";
import { EVENTS, ROADMAP_INDICATOR_COLOR } from "@/pages/roadmap/constants";
import type { CellBar, DayCell, EventStatus, GameEvent } from "@/pages/roadmap/types";

export function createDayjsDate(year: number, month: number, day: number) {
  return dayjs(new Date(year, month, day));
}

export function toKey(year: number, month: number, day: number) {
  return createDayjsDate(year, month, day).format("YYYY-MM-DD");
}

export function getEventsOn(year: number, month: number, day: number) {
  const key = toKey(year, month, day);
  return EVENTS.filter((event) => event.start <= key && key <= event.end);
}

export function fmtRange(event: GameEvent) {
  return event.start === event.end
    ? dayjs(event.start).format("YYYY.MM.DD")
    : `${dayjs(event.start).format("YYYY.MM.DD")} – ${dayjs(event.end).format("YYYY.MM.DD")}`;
}

export function getNearestUpcoming(year: number, month: number, day: number): GameEvent | null {
  const key = toKey(year, month, day);
  return EVENTS.filter((event) => event.end >= key).sort((a, b) => a.start.localeCompare(b.start))[0] ?? null;
}

export function getStatus(event: GameEvent, todayKey: string): EventStatus {
  if (todayKey > event.end) return "completed";
  if (todayKey >= event.start) return "ongoing";
  return "upcoming";
}

export function daysUntil(event: GameEvent, todayKey: string) {
  return dayjs(event.start).diff(dayjs(todayKey), "day");
}

export function durationDays(event: GameEvent) {
  return dayjs(event.end).diff(dayjs(event.start), "day") + 1;
}

export function diffDays(fromKey: string, toKeyValue: string) {
  return dayjs(toKeyValue).diff(dayjs(fromKey), "day");
}

export function buildGrid(year: number, month: number): DayCell[] {
  const firstOfMonth = createDayjsDate(year, month, 1);
  const firstDay = firstOfMonth.day();
  const daysInMonth = firstOfMonth.daysInMonth();
  const daysInPrevMonth = firstOfMonth.subtract(1, "month").daysInMonth();
  const cells: DayCell[] = [];

  for (let index = firstDay - 1; index >= 0; index--) {
    cells.push({ day: daysInPrevMonth - index, kind: "prev" });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, kind: "cur" });
  }

  const remainder = cells.length % 7;
  if (remainder > 0) {
    for (let day = 1; day <= 7 - remainder; day++) {
      cells.push({ day, kind: "next" });
    }
  }

  return cells;
}

export function buildCalendarRows(year: number, month: number) {
  const grid = buildGrid(year, month);
  const rows: DayCell[][] = [];

  for (let index = 0; index < grid.length; index += 7) {
    rows.push(grid.slice(index, index + 7));
  }

  return rows;
}

export function getCellBarsForDate(year: number, month: number, day: number): CellBar[] {
  const key = toKey(year, month, day);

  return EVENTS.filter((event) => event.start <= key && key <= event.end).map((event) => {
    const isStart = event.start === key;
    const isEnd = event.end === key;

    return {
      color: ROADMAP_INDICATOR_COLOR,
      role: isStart && isEnd ? "solo" : isStart ? "start" : isEnd ? "end" : "middle",
    };
  });
}
