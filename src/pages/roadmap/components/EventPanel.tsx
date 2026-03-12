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
      className="shrink-0 self-center min-h-[620px] mt-4 mb-4 flex flex-col rounded-tl-[24px] rounded-bl-[24px] overflow-hidden pt-7 pb-7 px-12"
      style={{
        width: "clamp(500px, 43vw, 720px)",
        background: "linear-gradient(150deg, #0d1e3a 0%, #00204d 55%, #010f28 100%)",
      }}
    >
      <div className="mb-7 shrink-0">
        <div className="text-white/35 text-[11px] font-semibold uppercase tracking-[0.14em] mb-3">
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
            style={{ fontSize: "clamp(52px, 6.5vw, 84px)" }}
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
              style={{ fontSize: "clamp(18px, 2.2vw, 28px)" }}
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
        <div className="flex-1 flex flex-col">
          {state.selectedEvents.length === 0 ? (
            <div className="flex-1 flex flex-col">
              <p className="text-white/30 font-medium text-[15px] leading-relaxed">
                이 날에는 일정이 없어요
              </p>

              {state.nearestEvent && (
                <div className="mt-5 min-h-[168px]">
                  <div className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.18em] mb-3">
                    다음 일정
                  </div>
                  <motion.div
                    layoutId={`event-card-${state.nearestEvent.id}`}
                    transition={{ duration: 0.34, ease: EASE }}
                    className="min-h-[120px] rounded-2xl px-5 py-4"
                    style={{ background: "#16335c" }}
                  >
                    {(() => {
                      const delta = daysUntil(
                        state.nearestEvent,
                        toKey(state.selectedYear, state.selectedMonth, state.selectedDay)
                      );
                      return delta > 0
                        ? <div className="text-white/35 text-[12px] font-medium mb-2">D-{delta}</div>
                        : null;
                    })()}
                    <div className="text-white/65 font-semibold text-[17px] tracking-[-0.02em]">
                      {state.nearestEvent.title}
                    </div>
                    <div className="text-white/30 text-[12px] mt-1.5 font-medium">
                      {fmtRange(state.nearestEvent)}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1">
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
                    className="min-h-[120px] rounded-2xl px-6 py-5"
                    style={{ background: "#16335c" }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
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

                    <div className="text-white font-bold text-[20px] leading-tight tracking-[-0.03em]">
                      {event.title}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white/40 text-[13px] font-medium">
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
