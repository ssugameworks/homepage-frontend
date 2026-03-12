import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { DAY_KO, EASE, MONTH_NAMES } from "@/pages/roadmap/constants";
import type { useRoadmapCalendar } from "@/pages/roadmap/hooks/useRoadmapCalendar";
import { daysUntil, durationDays, fmtRange, getStatus, toKey } from "@/pages/roadmap/utils";

type CalendarState = ReturnType<typeof useRoadmapCalendar>;

type EventPanelProps = {
  reducedMotion: boolean;
  state: CalendarState;
};

function LiveDot() {
  return (
    <span className="relative inline-flex h-3 w-3 items-center justify-center">
      <motion.span
        className="absolute inline-block h-3 w-3 rounded-full bg-[#1a7aff]/30"
        animate={{ scale: [0.85, 1.45], opacity: [0.5, 0] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inline-block h-1.75 w-1.75 rounded-full bg-[#1a7aff] shadow-[0_0_10px_rgba(26,122,255,0.55)]"
        animate={{ scale: [1, 0.96, 1] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}

function RollingDigit({
  digit,
  digitKey,
  direction,
  reducedMotion,
  widthClass = "w-[0.62em]",
  offsetClass = "",
}: {
  digit: string;
  digitKey: string;
  direction: number;
  reducedMotion: boolean;
  widthClass?: string;
  offsetClass?: string;
}) {
  return (
    <span className={`relative inline-flex h-[1em] ${widthClass} ${offsetClass} overflow-hidden align-middle leading-none`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digitKey}
          initial={reducedMotion ? false : { y: direction > 0 ? "110%" : "-110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { y: direction > 0 ? "-110%" : "110%", opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function EventPanel({ reducedMotion, state }: EventPanelProps) {
  const selectedDayText = String(state.selectedDay).padStart(2, "0");
  const selectedKey = toKey(state.selectedYear, state.selectedMonth, state.selectedDay);
  const selectedDayLabel = DAY_KO[state.selectedDow] ?? "";
  const [prevDayLabel, setPrevDayLabel] = useState(selectedDayLabel);
  const shouldAnimateWeekday = prevDayLabel !== selectedDayLabel;

  useEffect(() => {
    setPrevDayLabel(selectedDayLabel);
  }, [selectedDayLabel]);

  return (
    <div
      className="mt-2 mb-4 mx-auto flex w-full min-w-0 max-w-[620px] flex-col self-stretch overflow-hidden rounded-[28px] px-5 pt-6 pb-6 sm:mt-3 sm:mb-6 sm:min-h-[505px] sm:px-6 sm:pt-5 sm:pb-5 md:px-7 lg:mt-4 lg:mb-4 lg:ml-auto lg:min-h-[600px] lg:w-[clamp(500px,43vw,720px)] lg:min-w-[500px] lg:max-w-none lg:flex-none lg:self-start lg:rounded-tl-[24px] lg:rounded-bl-[24px] lg:rounded-tr-none lg:rounded-br-none lg:px-10 lg:pt-5 lg:pb-5 xl:px-12"
      style={{
        background: "linear-gradient(150deg, #0d1e3a 0%, #00204d 55%, #010f28 100%)",
      }}
    >
      <div className="mb-5 shrink-0">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
          {state.selectedYear} ·{" "}
          <RollingDigit
            digit={selectedDayLabel}
            digitKey={
              shouldAnimateWeekday
                ? `weekday-${state.selectedYear}-${state.selectedMonth}-${state.selectedDay}-${selectedDayLabel}`
                : `weekday-static-${selectedDayLabel}`
            }
            direction={shouldAnimateWeekday ? state.effectiveDateDir : 0}
            reducedMotion={reducedMotion || !shouldAnimateWeekday}
            widthClass="w-[0.95em]"
            offsetClass="top-[-0.02em]"
          />
          요일
        </div>

        <div className="overflow-hidden">
          <div
            className="flex text-white font-bold leading-none tracking-[-0.05em] tabular-nums"
            style={{ fontSize: "clamp(44px, 12vw, 84px)" }}
          >
            {selectedDayText.split("").map((digit, index) => (
              <RollingDigit
                key={`digit-slot-${index}`}
                digit={digit}
                digitKey={`${selectedDayText}-${index}-${digit}`}
                direction={state.effectiveDateDir}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>

        <div className="overflow-hidden mt-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${state.selectedYear}-${state.selectedMonth}`}
              initial={reducedMotion ? false : {
                y: state.effectiveDateDir > 0 ? "100%" : "-100%",
                opacity: 0,
              }}
              animate={{ y: 0, opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : {
                y: state.effectiveDateDir > 0 ? "-100%" : "100%",
                opacity: 0,
              }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-white/65 font-semibold leading-none tracking-[-0.03em]"
              style={{ fontSize: "clamp(16px, 4vw, 28px)" }}
            >
              {MONTH_NAMES[state.selectedMonth]}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={reducedMotion ? false : { scaleX: 0.2, opacity: 0.4 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.08, ease: EASE }}
          className="mt-5 h-px origin-left bg-gradient-to-r from-white/70 via-white/25 to-transparent"
        />
      </div>
      <LayoutGroup id="roadmap-event-flow">
        <div className="flex min-h-[188px] flex-1 flex-col sm:min-h-[220px] lg:min-h-[248px]">
          {state.selectedEvents.length === 0 ? (
            <div className="flex-1 flex flex-col">
              <p className="text-[14px] font-medium leading-relaxed text-white/30 sm:text-[15px]">
                이 날에는 일정이 없어요
              </p>

              {state.nearestEvent && (
                <div className="mt-5 min-h-[148px] sm:min-h-[168px]">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                    다음 일정
                  </div>
                  <motion.div
                    layoutId={`event-card-${state.nearestEvent.id}`}
                    transition={{ duration: 0.34, ease: EASE }}
                    className="min-h-[108px] rounded-2xl px-4 py-4 sm:min-h-[120px] sm:px-5"
                    style={{ background: "#16335c" }}
                  >
                    <div className="mb-2">
                      {(() => {
                        const delta = daysUntil(
                          state.nearestEvent,
                          toKey(state.selectedYear, state.selectedMonth, state.selectedDay)
                        );
                        return delta > 0
                          ? <div className="text-[12px] font-medium text-white/35">D-{delta}</div>
                          : null;
                      })()}
                    </div>
                    <div className="text-[16px] font-semibold tracking-[-0.02em] text-white/65 sm:text-[17px]">
                      {state.nearestEvent.title}
                    </div>
                    <div className="mt-1.5 text-[12px] font-medium text-white/30">
                      {fmtRange(state.nearestEvent)}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3">
              {state.selectedEvents.map((event, index) => {
                const status = getStatus(event, state.todayKey);
                const duration = durationDays(event);

                return (
                  <motion.div
                    key={event.id}
                    layoutId={`event-card-${event.id}`}
                    initial={index === 0 ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index === 0 ? 0 : index * 0.04, ease: EASE }}
                    className="min-h-[108px] rounded-2xl px-5 py-4 sm:min-h-[120px] sm:px-6 sm:py-5"
                    style={{ background: "#16335c" }}
                  >
                    <div className="mb-3 flex items-center gap-1.5">
                      {status === "ongoing" && (
                        <>
                          <LiveDot />
                          <span className="text-[#1a7aff] text-[12px] font-semibold">진행중</span>
                        </>
                      )}
                      {status === "completed" && (
                        <span className="text-white/25 text-[12px] font-medium">완료</span>
                      )}
                      {status === "upcoming" && (
                        <>
                          <LiveDot />
                          <span className="text-[#1a7aff] text-[12px] font-semibold">진행중</span>
                        </>
                      )}
                    </div>

                    <div className="text-[18px] font-bold leading-tight tracking-[-0.03em] text-white sm:text-[20px]">
                      {event.title}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[12px] font-medium text-white/40 sm:text-[13px]">
                        {fmtRange(event)}
                      </span>
                      {duration > 1 && (
                        <>
                          <span className="text-white/15 text-[12px]">·</span>
                          <span className="text-white/25 text-[12px] font-medium">{duration}일간</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </LayoutGroup>
    </div>
  );
}
