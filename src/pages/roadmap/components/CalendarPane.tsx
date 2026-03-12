import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useShallow } from "zustand/react/shallow";
import { DAY_LABELS, EASE, MONTH_NAMES, ROADMAP_INDICATOR_COLOR, ROADMAP_INDICATOR_LABEL } from "@/pages/roadmap/constants";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import { buildCalendarRows, getCellBarsForDate } from "@/pages/roadmap/utils";
import type { DayCell } from "@/pages/roadmap/types";

const calendarGridVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.22, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: EASE } },
};

export function CalendarPane() {
  const { viewYear, viewMonth, navDir, shiftView, goToday } = useRoadmapStore(
    useShallow((s) => ({
      viewYear: s.viewYear,
      viewMonth: s.viewMonth,
      navDir: s.navDir,
      shiftView: s.shiftView,
      goToday: s.goToday,
    }))
  );

  const { selectedYear, selectedMonth, selectedDay, selectDate } = useRoadmapStore(
    useShallow((s) => ({
      selectedYear: s.selectedYear,
      selectedMonth: s.selectedMonth,
      selectedDay: s.selectedDay,
      selectDate: s.selectDate,
    }))
  );

  const events = useRoadmapStore((s) => s.events);

  const isCurrentMonth = viewYear === dayjs().year() && viewMonth === dayjs().month();
  const rows = buildCalendarRows(viewYear, viewMonth);

  // Helper functions defined within component but not triggering state updates
  const getCellDate = (cell: DayCell): [number, number, number] => {
    let y = viewYear, m = viewMonth;
    if (cell.kind === "prev") { m -= 1; if (m < 0) { m = 11; y -= 1; } }
    if (cell.kind === "next") { m += 1; if (m > 11) { m = 0; y += 1; } }
    return [y, m, cell.day];
  };

  const isSelectedCell = (cell: DayCell) => {
    const [y, m, d] = getCellDate(cell);
    return y === selectedYear && m === selectedMonth && d === selectedDay;
  };

  const isTodayCell = (cell: DayCell) => {
    const [y, m, d] = getCellDate(cell);
    const now = dayjs();
    return y === now.year() && m === now.month() && d === now.date();
  };

  const onSelect = (cell: DayCell) => {
    const [y, m, d] = getCellDate(cell);
    if (cell.kind === "prev") shiftView(-1);
    if (cell.kind === "next") shiftView(1);
    selectDate(y, m, d);
  };

  return (
    <section className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-[620px] lg:max-w-[540px] xl:max-w-[580px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-end justify-between sm:mb-4">
            <AnimatePresence mode="wait" custom={navDir}>
              <motion.div
                key={`title-${viewYear}-${viewMonth}`}
                custom={navDir}
                initial={{ opacity: 0, x: navDir * 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -navDir * 14 }}
                transition={{ duration: 0.16, ease: EASE }}
                className="ml-2 sm:ml-3"
              >
                <div className="text-[13px] font-medium leading-none tracking-[-0.02em] text-muted sm:text-[16px]">
                  {viewYear}
                </div>
                <div
                  className="mt-0.5 text-ink font-bold leading-none tracking-[-0.04em]"
                  style={{ fontSize: "clamp(22px, 5vw, 42px)" }}
                >
                  {MONTH_NAMES[viewMonth]}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mb-0.5 flex items-center gap-1.5 sm:gap-2">
              <AnimatePresence>
                {!isCurrentMonth && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.14 }}
                    onClick={goToday}
                    className="rounded-full border border-[#00204d]/30 bg-transparent px-2.5 py-1 text-[10px] font-semibold text-navy transition-all hover:bg-navy hover:text-white cursor-pointer sm:px-3 sm:text-[11px]"
                  >
                    오늘
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => shiftView(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 bg-white hover:bg-black/4 cursor-pointer sm:h-9 sm:w-9"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2.5L4 7L9 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => shiftView(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 bg-white hover:bg-black/4 cursor-pointer sm:h-9 sm:w-9"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2.5L10 7L5 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_12px_30px_rgba(12,12,13,0.05)] sm:rounded-2xl">
            <div className="grid grid-cols-7 border-b border-black/[0.05]">
              {DAY_LABELS.map((label, index) => (
                <div key={index} className="flex h-8 items-center justify-center text-[10px] font-medium text-[#bbb] sm:h-9 sm:text-[11px]">
                  {label}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={navDir}>
              <motion.div
                key={`grid-${viewYear}-${viewMonth}`}
                variants={calendarGridVariants}
                initial="enter" animate="center" exit="exit"
                className="py-1"
              >
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-7">
                    {row.map((cell, cellIndex) => {
                      const selected = isSelectedCell(cell);
                      const today = isTodayCell(cell);
                      const isDimmed = cell.kind !== "cur";
                      const [cy, cm, cd] = getCellDate(cell);
                      const bars = getCellBarsForDate(events, cy, cm, cd);
                      const hasEvent = bars.length > 0;
                      const eventColor = bars[0]?.color ?? "#1a7aff";
                      const textColor = selected ? "#fff" : today ? "#00204d" : isDimmed ? "#ccc" : "#222";

                      return (
                        <button
                          key={cellIndex}
                          onClick={() => onSelect(cell)}
                          className="relative flex h-12 flex-col items-center border-0 bg-transparent hover:bg-black/[0.025] cursor-pointer sm:h-[58px]"
                        >
                          <div
                            className="mt-1.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] sm:mt-2 sm:h-8 sm:w-8 sm:text-[13px]"
                            style={{
                              background: selected
                                ? "#00204d"
                                : hasEvent ? `${eventColor}${isDimmed ? "22" : "28"}` : "transparent",
                              outline: today && !selected ? "2px solid #00204d" : "none",
                              outlineOffset: "-2px",
                              color: textColor,
                              fontWeight: selected || today || (hasEvent && !isDimmed) ? 600 : 400,
                            }}
                          >
                            {cell.day}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="mt-3 flex flex-col gap-2 px-0.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium tracking-wide text-[#ccc] select-none">← → ↑ ↓ 탐색</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:justify-end">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ROADMAP_INDICATOR_COLOR }} />
                <span className="text-[10px] text-[#bbb] font-medium">{ROADMAP_INDICATOR_LABEL}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
