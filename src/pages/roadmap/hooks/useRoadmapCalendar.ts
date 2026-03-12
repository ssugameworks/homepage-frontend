import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { DayCell } from "@/pages/roadmap/types";
import {
  buildCalendarRows,
  createDayjsDate,
  diffDays,
  getCellBarsForDate,
  getEventsOn,
  getNearestUpcoming,
  toKey,
} from "@/pages/roadmap/utils";

type CalendarDirection = 1 | -1;

export function useRoadmapCalendar() {
  const now = dayjs();
  const todayYear = now.year();
  const todayMonth = now.month();
  const todayDay = now.date();
  const todayKey = toKey(todayYear, todayMonth, todayDay);

  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth);
  const [selectedYear, setSelectedYear] = useState(todayYear);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [selectedDay, setSelectedDay] = useState(todayDay);
  const [navDir, setNavDir] = useState<CalendarDirection>(1);
  const [dateDir, setDateDir] = useState(0);

  function getCellDate(cell: DayCell): [number, number, number] {
    let year = viewYear;
    let month = viewMonth;

    if (cell.kind === "prev") {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
    }

    if (cell.kind === "next") {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    return [year, month, cell.day];
  }

  function isSelectedCell(cell: DayCell) {
    const [year, month, day] = getCellDate(cell);
    return year === selectedYear && month === selectedMonth && day === selectedDay;
  }

  function isTodayCell(cell: DayCell) {
    const [year, month, day] = getCellDate(cell);
    return year === todayYear && month === todayMonth && day === todayDay;
  }

  function getCellBars(cell: DayCell) {
    const [year, month, day] = getCellDate(cell);
    return getCellBarsForDate(year, month, day);
  }

  function shiftView(direction: CalendarDirection) {
    setNavDir(direction);

    if (direction === -1) {
      if (viewMonth === 0) {
        setViewYear((year) => year - 1);
        setViewMonth(11);
        return;
      }

      setViewMonth((month) => month - 1);
      return;
    }

    if (viewMonth === 11) {
      setViewYear((year) => year + 1);
      setViewMonth(0);
      return;
    }

    setViewMonth((month) => month + 1);
  }

  function selectDate(year: number, month: number, day: number, deltaHint?: number) {
    const nextKey = toKey(year, month, day);
    const currentKey = toKey(selectedYear, selectedMonth, selectedDay);
    void (deltaHint ?? diffDays(currentKey, nextKey));

    setDateDir(nextKey > currentKey ? 1 : nextKey < currentKey ? -1 : 0);
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
  }

  function selectCell(cell: DayCell) {
    const [year, month, day] = getCellDate(cell);

    if (cell.kind === "prev") shiftView(-1);
    if (cell.kind === "next") shiftView(1);

    const nextKey = toKey(year, month, day);
    const currentKey = toKey(selectedYear, selectedMonth, selectedDay);
    selectDate(year, month, day, diffDays(currentKey, nextKey));
  }

  function goToday() {
    const direction: CalendarDirection =
      todayYear > viewYear || (todayYear === viewYear && todayMonth > viewMonth) ? 1 : -1;

    setNavDir(direction);
    setViewYear(todayYear);
    setViewMonth(todayMonth);
    selectDate(todayYear, todayMonth, todayDay);
  }

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const deltaByKey: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: 7,
        ArrowUp: -7,
      };

      const delta = deltaByKey[event.key];
      if (delta === undefined) return;

      event.preventDefault();
      const next = createDayjsDate(selectedYear, selectedMonth, selectedDay).add(delta, "day");
      const nextYear = next.year();
      const nextMonth = next.month();
      const nextDay = next.date();

      if (nextMonth !== viewMonth || nextYear !== viewYear) {
        const direction: CalendarDirection =
          nextYear > viewYear || (nextYear === viewYear && nextMonth > viewMonth) ? 1 : -1;
        setNavDir(direction);
        setViewYear(nextYear);
        setViewMonth(nextMonth);
      }

      selectDate(nextYear, nextMonth, nextDay, delta);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedYear, selectedMonth, selectedDay, viewYear, viewMonth]);

  const rows = buildCalendarRows(viewYear, viewMonth);
  const selectedEvents = getEventsOn(selectedYear, selectedMonth, selectedDay);
  const nearestEvent =
    selectedEvents.length === 0 ? getNearestUpcoming(selectedYear, selectedMonth, selectedDay) : null;

  return {
    todayKey,
    todayYear,
    todayMonth,
    todayDay,
    viewYear,
    viewMonth,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedDow: createDayjsDate(selectedYear, selectedMonth, selectedDay).day(),
    navDir,
    rows,
    selectedEvents,
    nearestEvent,
    isCurrentMonth: viewYear === todayYear && viewMonth === todayMonth,
    effectiveDateDir: dateDir === 0 ? 1 : dateDir,
    getCellDate,
    getCellBars,
    isSelectedCell,
    isTodayCell,
    shiftView,
    selectCell,
    goToday,
  };
}
