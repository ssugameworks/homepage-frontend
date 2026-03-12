import { create } from "zustand";
import { devtools } from "zustand/middleware";
import dayjs from "dayjs";
import type { GameEvent } from "@/pages/roadmap/types";
import {
  buildCalendarRows,
  toKey,
} from "@/pages/roadmap/utils";

interface RoadmapState {
  viewYear: number;
  viewMonth: number;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  navDir: 1 | -1;
  dateDir: number;
  events: GameEvent[];
  
  // Actions
  setView: (year: number, month: number, dir?: 1 | -1) => void;
  shiftView: (dir: 1 | -1) => void;
  selectDate: (year: number, month: number, day: number, deltaHint?: number) => void;
  goToday: () => void;
  setEvents: (events: GameEvent[]) => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  (set, get) => {
    const now = dayjs();
    
    return {
      viewYear: now.year(),
      viewMonth: now.month(),
      selectedYear: now.year(),
      selectedMonth: now.month(),
      selectedDay: now.date(),
      navDir: 1,
      dateDir: 0,
      events: [],

      setEvents: (newEvents) => {
        const { events } = get();
        // 간단한 비교로 불필요한 상태 업데이트 방지
        if (JSON.stringify(events) === JSON.stringify(newEvents)) return;
        set({ events: newEvents });
      },

      setView: (year, month, dir) => 
        set((state) => ({ 
          viewYear: year, 
          viewMonth: month, 
          navDir: dir ?? (year > state.viewYear || (year === state.viewYear && month > state.viewMonth) ? 1 : -1)
        })),

      shiftView: (direction) => {
        const { viewYear, viewMonth } = get();
        let nextYear = viewYear;
        let nextMonth = viewMonth + direction;
        if (nextMonth < 0) { nextMonth = 11; nextYear -= 1; }
        else if (nextMonth > 11) { nextMonth = 0; nextYear += 1; }
        set({ viewYear: nextYear, viewMonth: nextMonth, navDir: direction });
      },

      selectDate: (year, month, day) => {
        const { selectedYear, selectedMonth, selectedDay } = get();
        const currentKey = toKey(selectedYear, selectedMonth, selectedDay);
        const nextKey = toKey(year, month, day);
        set({
          selectedYear: year,
          selectedMonth: month,
          selectedDay: day,
          dateDir: nextKey > currentKey ? 1 : nextKey < currentKey ? -1 : 0
        });
      },

      goToday: () => {
        const now = dayjs();
        const tYear = now.year();
        const tMonth = now.month();
        const tDay = now.date();
        const { viewYear, viewMonth } = get();
        const direction = tYear > viewYear || (tYear === viewYear && tMonth > viewMonth) ? 1 : -1;
        set({
          viewYear: tYear, viewMonth: tMonth,
          selectedYear: tYear, selectedMonth: tMonth, selectedDay: tDay,
          navDir: direction, dateDir: direction
        });
      },
    };
  }
);
