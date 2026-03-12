import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import dayjs from "dayjs";
import { useShallow } from "zustand/react/shallow";
import { DAY_KO, EASE } from "@/pages/roadmap/constants";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import { daysUntil, durationDays, fmtRange, getEventsOn, getNearestUpcoming, getStatus, toKey } from "@/pages/roadmap/utils";

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
  digit, digitKey, direction, reducedMotion, widthClass = "w-[0.62em]",
}: {
  digit: string; digitKey: string; direction: number; reducedMotion: boolean; widthClass?: string;
}) {
  return (
    <span className={`relative inline-flex h-[1em] ${widthClass} overflow-hidden align-middle leading-none`}>
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

export function EventPanel({ reducedMotion }: { reducedMotion: boolean }) {
  const { year, month, day, dateDir, events } = useRoadmapStore(
    useShallow((s) => ({
      year: s.selectedYear,
      month: s.selectedMonth,
      day: s.selectedDay,
      dateDir: s.dateDir,
      events: s.events,
    }))
  );

  const dow = dayjs(new Date(year, month, day)).day();
  const selectedDayText = String(day).padStart(2, "0");
  const selectedDayLabel = DAY_KO[dow] ?? "";
  
  const [prevDayLabel, setPrevDayLabel] = useState(selectedDayLabel);
  const shouldAnimateWeekday = prevDayLabel !== selectedDayLabel;

  useEffect(() => {
    if (selectedDayLabel !== prevDayLabel) {
      setPrevDayLabel(selectedDayLabel);
    }
  }, [selectedDayLabel, prevDayLabel]);

  const selectedEvents = getEventsOn(events, year, month, day);
  const nearestEvent = selectedEvents.length === 0 ? getNearestUpcoming(events, year, month, day) : null;
  const todayKey = dayjs().format("YYYY-MM-DD");
  const effectiveDateDir = dateDir === 0 ? 1 : dateDir;

  return (
    <div
      className="mt-2 mb-4 mx-auto flex w-full min-w-0 max-w-[620px] flex-col self-stretch overflow-hidden rounded-[28px] px-5 pt-6 pb-5 lg:mt-4 lg:mb-4 lg:mx-0 lg:ml-auto lg:min-h-[600px] lg:w-[clamp(500px,43vw,720px)] lg:min-w-[500px] lg:max-w-none lg:flex-none lg:self-start lg:rounded-tl-[24px] lg:rounded-bl-[24px] lg:rounded-tr-none lg:rounded-br-none lg:px-10 lg:pt-5 lg:pb-10 xl:px-12 xl:pb-12"
      style={{ background: "linear-gradient(150deg, #0d1e3a 0%, #00204d 55%, #010f28 100%)" }}
    >
      <div className="mb-5 shrink-0 lg:pt-3">
        <div className="mb-0.5 ml-3 flex items-center text-[14px] font-medium tracking-[0.02em] text-white">
          <RollingDigit
            digit={selectedDayLabel}
            digitKey={`weekday-${year}-${month}-${day}-${selectedDayLabel}`}
            direction={shouldAnimateWeekday ? effectiveDateDir : 0}
            reducedMotion={reducedMotion || !shouldAnimateWeekday}
            widthClass="w-[0.9em]"
          />
          <span className="leading-none">요일</span>
        </div>
        <div className="overflow-hidden">
          <div className="flex text-white font-bold leading-none tracking-[-0.05em] tabular-nums" style={{ fontSize: "clamp(44px, 12vw, 84px)" }}>
            {selectedDayText.split("").map((digit, index) => (
              <RollingDigit
                key={`digit-slot-${index}`}
                digit={digit}
                digitKey={`${selectedDayText}-${index}-${digit}`}
                direction={effectiveDateDir}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
      <LayoutGroup id="roadmap-event-flow">
        <div className="flex min-h-[188px] flex-1 flex-col lg:min-h-[248px]">
          {selectedEvents.length === 0 ? (
            <div className="flex min-h-full flex-col">
              <p className="ml-3 text-[14px] font-medium leading-relaxed text-white/30">이 날에는 일정이 없어요</p>
              {nearestEvent && (
                <div className="mt-auto pt-5">
                  <div className="mb-3 ml-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">다음 일정</div>
                  <motion.div layoutId={`event-card-${nearestEvent.id}`} transition={{ duration: 0.34, ease: EASE }} className="min-h-[108px] rounded-2xl px-4 py-4" style={{ background: "#16335c" }}>
                    <div className="mb-2">
                      {(() => {
                        const delta = daysUntil(nearestEvent, toKey(year, month, day));
                        return delta > 0 ? <div className="text-[11px] font-medium text-white/30">D-{delta}</div> : null;
                      })()}
                    </div>
                    <div className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white/80">{nearestEvent.title}</div>
                    <div className="mt-1.5 text-[11px] font-medium text-white/34">{fmtRange(nearestEvent)}</div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3">
              {selectedEvents.map((event, index) => {
                const status = getStatus(event, todayKey);
                const duration = durationDays(event);
                return (
                  <motion.div key={event.id} layoutId={`event-card-${event.id}`} initial={index === 0 ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: index === 0 ? 0 : index * 0.04, ease: EASE }} className="min-h-[108px] rounded-2xl px-5 py-4" style={{ background: "#16335c" }}>
                    <div className="mb-2.5 flex items-center gap-1.5">
                      {(status === "ongoing" || status === "upcoming") && <><LiveDot /><span className="text-[#1a7aff] text-[11px] font-semibold">진행중</span></>}
                      {status === "completed" && <span className="text-white/25 text-[11px] font-medium">완료</span>}
                    </div>
                    <div className="text-[17px] font-semibold leading-snug tracking-[-0.03em] text-white">{event.title}</div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-white/38">{fmtRange(event)}</span>
                      {duration > 1 && <><span className="text-white/15 text-[12px]">·</span><span className="text-white/24 text-[11px] font-medium">{duration}일간</span></>}
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
