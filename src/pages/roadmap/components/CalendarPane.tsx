import { AnimatePresence, motion } from "framer-motion";
import { DAY_LABELS, EASE, MONTH_NAMES, ROADMAP_INDICATOR_COLOR, ROADMAP_INDICATOR_LABEL } from "@/pages/roadmap/constants";
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
    <section className="min-w-0 flex-1">
      <div className="mx-auto flex w-full max-w-[620px] items-start gap-2 sm:gap-3 lg:max-w-[540px] xl:max-w-[580px]">
        <button
          onClick={() => state.shiftView(-1)}
          aria-label="이전 달"
          className="mt-[78px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white transition-all hover:bg-black/4 active:scale-95 cursor-pointer sm:mt-[86px] sm:h-10 sm:w-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4 7L9 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-end justify-between sm:mb-4">
            <AnimatePresence mode="wait" custom={state.navDir}>
              <motion.div
                key={`title-${state.viewYear}-${state.viewMonth}`}
                custom={state.navDir}
                initial={{ opacity: 0, x: state.navDir * 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -state.navDir * 14 }}
                transition={{ duration: 0.16, ease: EASE }}
              >
                <div className="text-[13px] font-medium leading-none tracking-[-0.02em] text-[#aaa] sm:text-[16px]">
                  {state.viewYear}
                </div>
                <div
                  className="mt-0.5 text-[#111] font-bold leading-none tracking-[-0.04em]"
                  style={{ fontSize: "clamp(22px, 5vw, 42px)" }}
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
                  className="mb-1 rounded-full border border-[#00204d]/30 bg-transparent px-2.5 py-1 text-[10px] font-semibold text-[#00204d] transition-all hover:bg-[#00204d] hover:text-white cursor-pointer sm:px-3 sm:text-[11px]"
                >
                  오늘
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_12px_30px_rgba(12,12,13,0.05)] sm:rounded-2xl">
            <div className="grid grid-cols-7 border-b border-black/[0.05]">
              {DAY_LABELS.map((label, index) => (
                <div key={index} className="flex h-8 items-center justify-center text-[10px] font-medium tracking-wide text-[#bbb] sm:h-9 sm:text-[11px]">
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
                          className="relative flex h-12 flex-col items-center border-0 bg-transparent transition-colors hover:bg-black/[0.025] cursor-pointer sm:h-[58px]"
                          aria-label={`${cell.day}일`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className="mt-1.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] transition-all duration-150 sm:mt-2 sm:h-8 sm:w-8 sm:text-[13px]"
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

                          <div className="absolute bottom-1 left-0 right-0 flex flex-col-reverse gap-[2px] px-0 sm:bottom-1.5">
                            {bars.slice(0, 2).map((bar, barIndex) =>
                              bar.role === "solo" ? (
                                <div key={barIndex} className="flex justify-center">
                                  <div
                                    className="h-1 w-1 rounded-full sm:h-[5px] sm:w-[5px]"
                                    style={{ background: bar.color, opacity: isDimmed ? 0.35 : 1 }}
                                  />
                                </div>
                              ) : (
                                <div
                                  key={barIndex}
                                  className="h-[3px] sm:h-[4px]"
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

          <div className="mt-3 flex flex-col gap-2 px-0.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium tracking-wide text-[#ccc] select-none">
              ← → ↑ ↓ 탐색
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:justify-end">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ROADMAP_INDICATOR_COLOR }} />
                <span className="text-[10px] text-[#bbb] font-medium">{ROADMAP_INDICATOR_LABEL}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => state.shiftView(1)}
          aria-label="다음 달"
          className="mt-[78px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white transition-all hover:bg-black/4 active:scale-95 cursor-pointer sm:mt-[86px] sm:h-10 sm:w-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2.5L10 7L5 11.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
