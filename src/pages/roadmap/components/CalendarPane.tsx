import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useShallow } from "zustand/react/shallow";
import { DAY_LABELS, EASE, MONTH_NAMES } from "@/pages/roadmap/constants";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import { buildCalendarRows, getCellBarsForDate } from "@/pages/roadmap/utils";
import type { DayCell, GameEvent } from "@/pages/roadmap/types";

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

        {/* Desktop Navigation Buttons (Hidden on mobile) */}
        <div className="hidden lg:flex absolute inset-y-0 lg:left-[-74px] lg:right-[-74px] lg:top-[60%] items-center justify-between pointer-events-none" style={{ height: "fit-content" }}>
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
        <div className="mb-6 lg:mb-8 px-2">
          <AnimatePresence mode="wait" custom={navDir}>
            <motion.div
              key={`title-${viewYear}-${viewMonth}`}
              custom={navDir}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-col items-start"
            >
              <div className="text-[24px] lg:text-[32px] font-medium leading-none tracking-tight text-black/40">
                {viewYear}
              </div>
              <div className="mt-2 flex items-center justify-between w-full">
                <div className="text-[40px] lg:text-[56px] font-extrabold leading-none tracking-tight text-black uppercase">
                  {MONTH_NAMES[viewMonth]}
                </div>
                
                {/* Mobile Navigation Mini-Buttons (Reduced size & Pushed to right) */}
                <div className="flex lg:hidden items-center gap-1 mt-1">
                  <button 
                    onClick={() => shiftView(-1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f2f5] active:bg-[#e2e4e7] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => shiftView(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f2f5] active:bg-[#e2e4e7] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Calendar Card with Swipe (Drag) Functionality */}
        <motion.div 
          className="rounded-[24px] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.12)] border border-[#f0f2f5] touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            const threshold = 50;
            if (info.offset.x < -threshold) shiftView(1);
            else if (info.offset.x > threshold) shiftView(-1);
          }}
        >
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
              {rows.map((row, rowIndex) => {
                // 1. 해당 주(row)에 존재하는 모든 고유 이벤트 ID 수집
                const rowEventIdsSet = new Set<string>();
                row.forEach(cell => {
                  const [cy, cm, cd] = getCellDate(cell);
                  const bars = getCellBarsForDate(events, cy, cm, cd);
                  bars.forEach(b => rowEventIdsSet.add(b.eventId));
                });
                
                const uniqueEventsInRow = Array.from(rowEventIdsSet)
                  .map(id => events.find(e => e.id === id))
                  .filter(Boolean) as GameEvent[];

                // 2. 시작 날짜 순으로 정렬 (같으면 기간이 긴 것 우선)
                uniqueEventsInRow.sort((a, b) => {
                  if (a.start !== b.start) return a.start.localeCompare(b.start);
                  return b.end.localeCompare(a.end);
                });

                // 3. 슬롯 패킹 (3개 슬롯까지)
                const slots: string[][] = [[], [], []];
                uniqueEventsInRow.forEach(ev => {
                  for (let i = 0; i < 3; i++) {
                    const hasOverlap = slots[i].some(slotEvId => {
                      const slotEv = events.find(e => e.id === slotEvId)!;
                      return Math.max(dayjs(ev.start).unix(), dayjs(slotEv.start).unix()) <= Math.min(dayjs(ev.end).unix(), dayjs(slotEv.end).unix());
                    });
                    if (!hasOverlap) {
                      slots[i].push(ev.id);
                      break;
                    }
                  }
                });

                return (
                  <div key={rowIndex} className="grid grid-cols-7">
                    {row.map((cell, cellIndex) => {
                      const selected = isSelectedCell(cell);
                      const today = isTodayCell(cell);
                      const isDimmed = cell.kind !== "cur";
                      const [cy, cm, cd] = getCellDate(cell);
                      const dailyBars = getCellBarsForDate(events, cy, cm, cd);

                      return (
                        <button
                          key={cellIndex}
                          onClick={() => onSelect(cell)}
                          className="relative flex flex-col items-center pt-2 pb-2 bg-transparent hover:bg-black/[0.01] transition-colors rounded-lg cursor-pointer"
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center text-[18px] transition-all`}
                            style={{
                              background: today ? "#003580" : "transparent",
                              color: today ? "#fff" : selected ? "#003580" : isDimmed ? "#bbb" : "#000",
                              boxShadow: selected && !today ? "inset 0 0 0 2px #003580" : "none",
                              fontWeight: selected || today ? 700 : 500,
                              borderRadius: "50%",
                            }}
                          >
                            {cell.day}
                          </div>
                          
                          {/* Event Bars - Fixed Packed Slots per Week */}
                          <div className="mt-1 flex w-full flex-col gap-[2px] h-[32px]">
                            {slots.map((slotEventIds, i) => {
                              const eventIdInSlot = slotEventIds.find(id => dailyBars.some(b => b.eventId === id));
                              const bar = dailyBars.find(b => b.eventId === eventIdInSlot);

                              if (!bar) return <div key={i} className="h-[3.5px]" />; 

                              const isStart = bar.role === "start" || bar.role === "solo";
                              const isEnd = bar.role === "end" || bar.role === "solo";
                              
                              const isWeekStart = cellIndex === 0;
                              const isWeekEnd = cellIndex === 6;

                              const shouldRoundLeft = isStart || isWeekStart;
                              const shouldRoundRight = isEnd || isWeekEnd;

                              return (
                                <div
                                  key={i}
                                  className="h-[3.5px]"
                                  style={{
                                    backgroundColor: bar.color,
                                    opacity: isDimmed ? 0.3 : 1,
                                    borderRadius: `${shouldRoundLeft ? "100px" : "0"} ${shouldRoundRight ? "100px" : "0"} ${shouldRoundRight ? "100px" : "0"} ${shouldRoundLeft ? "100px" : "0"}`,
                                    marginLeft: shouldRoundLeft ? "4px" : "0",
                                    marginRight: shouldRoundRight ? "4px" : "0",
                                    width: (shouldRoundLeft && shouldRoundRight) ? "calc(100% - 8px)" : (shouldRoundLeft || shouldRoundRight) ? "calc(100% - 4px)" : "100%",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
