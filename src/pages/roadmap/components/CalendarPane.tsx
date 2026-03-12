import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useShallow } from "zustand/react/shallow";
import { DAY_LABELS, EASE, MONTH_NAMES } from "@/pages/roadmap/constants";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import { buildCalendarRows, getCellBarsForDate } from "@/pages/roadmap/utils";
import type { DayCell } from "@/pages/roadmap/types";

const calendarGridVariants = {
  enter: { opacity: 0, scale: 0.98 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: EASE } },
};

export function CalendarPane() {
  const { viewYear, viewMonth, navDir, shiftView } = useRoadmapStore(
    useShallow((s) => ({
      viewYear: s.viewYear,
      viewMonth: s.viewMonth,
      navDir: s.navDir,
      shiftView: s.shiftView,
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
  const rows = buildCalendarRows(viewYear, viewMonth);

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
    <div className="relative flex items-center justify-center w-full max-w-[640px]">

      {/* Main Content */}
      <div className="relative flex flex-col w-full max-w-[420px]">

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-[-74px] right-[-74px] top-[60%] flex items-center justify-between pointer-events-none" style={{ height: "fit-content" }}>
          <button 
            onClick={() => shiftView(-1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#9da1ab] shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button 
            onClick={() => shiftView(1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#9da1ab] shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {/* Typography Header */}
        <div className="mb-8 px-2">
          <AnimatePresence mode="wait" custom={navDir}>
            <motion.div
              key={`title-${viewYear}-${viewMonth}`}
              custom={navDir}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="text-[32px] font-medium leading-none tracking-tight text-black">
                {viewYear}
              </div>
              <div className="mt-2 text-[56px] font-extrabold leading-none tracking-tight text-black uppercase">
                {MONTH_NAMES[viewMonth]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Calendar Card */}
        <div className="rounded-[24px] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.12)] border border-[#f0f2f5]">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-4 border-b border-[#f3f4f6] pb-3">
            {DAY_LABELS.map((label, index) => (
              <div key={index} className="flex h-8 items-center justify-center text-[18px] font-semibold text-black/60">
                {label}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={navDir}>
            <motion.div
              key={`grid-${viewYear}-${viewMonth}`}
              variants={calendarGridVariants}
              initial="enter" animate="center" exit="exit"
              className="flex flex-col gap-1"
            >
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7">
                  {row.map((cell, cellIndex) => {
                    const selected = isSelectedCell(cell);
                    const today = isTodayCell(cell);
                    const isDimmed = cell.kind !== "cur";
                    const [cy, cm, cd] = getCellDate(cell);
                    const bars = getCellBarsForDate(events, cy, cm, cd);

                    return (
                      <button
                        key={cellIndex}
                        onClick={() => onSelect(cell)}
                        className="relative flex flex-col items-center pt-2 pb-2 bg-transparent hover:bg-black/[0.01] transition-colors rounded-lg cursor-pointer"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center text-[18px] transition-all`}
                          style={{
                            // 오늘 날짜: 배경 #003580, 글자 흰색
                            // 선택된 날짜: 테두리 #003580, 배경 없음
                            background: today ? "#003580" : "transparent",
                            color: today ? "#fff" : selected ? "#003580" : isDimmed ? "#bbb" : "#000",
                            boxShadow: selected && !today ? "inset 0 0 0 2px #003580" : "none",
                            fontWeight: selected || today ? 700 : 500,
                            borderRadius: "50%",
                          }}
                        >
                          {cell.day}
                        </div>
                        
                        {/* Event Bars */}
                        <div className="mt-1 flex w-full flex-col gap-[2px] px-1 h-[18px]">
                          {bars.slice(0, 3).map((bar, i) => (
                            <div
                              key={i}
                              className="h-[3.5px] w-full"
                              style={{
                                backgroundColor: bar.color,
                                opacity: isDimmed ? 0.3 : 1,
                                borderRadius: "1.5px"
                              }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
