import { AnimatePresence, motion } from "framer-motion";
import { CAT_COLOR, CAT_LABEL, DAY_LABELS, EASE, MONTH_NAMES } from "@/pages/roadmap/constants";
import type { Category } from "@/pages/roadmap/types";
import type { useRoadmapCalendar } from "@/pages/roadmap/hooks/useRoadmapCalendar";

type CalendarState = ReturnType<typeof useRoadmapCalendar>;

type CalendarPaneProps = {
  state: CalendarState;
};

const calendarGridVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: EASE,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: EASE,
    },
  },
};

export function CalendarPane({ state }: CalendarPaneProps) {
  return (
    <div className="flex-1 flex items-start justify-center pt-12 px-8 min-w-0">
      <div className="flex items-center gap-4 w-full max-w-[540px]">
        <button
          onClick={() => state.shiftView(-1)}
          aria-label="이전 달"
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-black/8 hover:bg-black/4 active:scale-95 transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4 7L9 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-end justify-between mb-4">
            <AnimatePresence mode="wait" custom={state.navDir}>
              <motion.div
                key={`title-${state.viewYear}-${state.viewMonth}`}
                custom={state.navDir}
                initial={{ opacity: 0, x: state.navDir * 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -state.navDir * 14 }}
                transition={{ duration: 0.16, ease: EASE }}
              >
                <div className="text-[#aaa] font-medium text-[16px] tracking-[-0.02em] leading-none">
                  {state.viewYear}
                </div>
                <div
                  className="text-[#111] font-bold leading-none mt-0.5 tracking-[-0.04em]"
                  style={{ fontSize: "clamp(24px, 3.5vw, 42px)" }}
                >
                  {MONTH_NAMES[state.viewMonth]}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {!state.isCurrentMonth && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.14 }}
                  onClick={state.goToday}
                  className="mb-1 px-3 py-1 rounded-full border border-[#00204d]/30 text-[#00204d] text-[11px] font-semibold cursor-pointer bg-transparent hover:bg-[#00204d] hover:text-white transition-all"
                >
                  오늘
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-black/[0.05]">
              {DAY_LABELS.map((label, index) => (
                <div key={index} className="flex items-center justify-center h-9 text-[#bbb] font-medium text-[11px] tracking-wide">
                  {label}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={state.navDir}>
              <motion.div
                key={`grid-${state.viewYear}-${state.viewMonth}`}
                variants={calendarGridVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-1"
              >
                {state.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-7">
                    {row.map((cell, cellIndex) => {
                      const isSelected = state.isSelectedCell(cell);
                      const isToday = state.isTodayCell(cell);
                      const isDimmed = cell.kind !== "cur";
                      const bars = state.getCellBars(cell);
                      const textColor = isSelected ? "#fff" : isToday ? "#00204d" : isDimmed ? "#ccc" : "#222";

                      return (
                        <button
                          key={cellIndex}
                          onClick={() => state.selectCell(cell)}
                          className="relative flex flex-col items-center cursor-pointer border-0 bg-transparent hover:bg-black/[0.025] transition-colors"
                          style={{ height: 58 }}
                          aria-label={`${cell.day}일`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className="mt-2 w-8 h-8 flex items-center justify-center rounded-full text-[13px] transition-all duration-150"
                            style={{
                              background: isSelected ? "#00204d" : "transparent",
                              outline: isToday && !isSelected ? "2px solid #00204d" : "none",
                              outlineOffset: "-2px",
                              color: textColor,
                              fontWeight: isSelected || isToday ? 700 : 400,
                            }}
                          >
                            {cell.day}
                          </div>

                          <div className="absolute bottom-1.5 left-0 right-0 flex flex-col-reverse gap-[2px] px-0">
                            {bars.slice(0, 2).map((bar, barIndex) =>
                              bar.role === "solo" ? (
                                <div key={barIndex} className="flex justify-center">
                                  <div
                                    className="w-[5px] h-[5px] rounded-full"
                                    style={{ background: bar.color, opacity: isDimmed ? 0.35 : 1 }}
                                  />
                                </div>
                              ) : (
                                <div
                                  key={barIndex}
                                  className="h-[4px]"
                                  style={{
                                    background: bar.color,
                                    opacity: isDimmed ? 0.25 : isSelected ? 0.55 : 0.85,
                                    marginLeft: bar.role === "start" ? "50%" : "0",
                                    marginRight: bar.role === "end" ? "50%" : "0",
                                    borderRadius:
                                      bar.role === "start" ? "3px 0 0 3px" :
                                      bar.role === "end" ? "0 3px 3px 0" :
                                      "0",
                                  }}
                                />
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-3 flex items-center justify-between px-0.5">
            <p className="text-[10px] text-[#ccc] font-medium tracking-wide select-none">
              ← → ↑ ↓ 탐색
            </p>
            <div className="flex items-center gap-3">
              {(Object.entries(CAT_COLOR) as [Category, string][]).map(([category, color]) => (
                <div key={category} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] text-[#bbb] font-medium">{CAT_LABEL[category]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => state.shiftView(1)}
          aria-label="다음 달"
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-black/8 hover:bg-black/4 active:scale-95 transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2.5L10 7L5 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
