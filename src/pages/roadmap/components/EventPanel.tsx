import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import dayjs from "dayjs";
import { MONTH_NAMES, EASE, EVENT_COLORS, CAT_COLOR, ROADMAP_INDICATOR_COLOR } from "@/pages/roadmap/constants";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import { fmtRange, getEventsOn } from "@/pages/roadmap/utils";

export function EventPanel({ reducedMotion }: { reducedMotion: boolean }) {
  const { year, month, day, events } = useRoadmapStore(
    useShallow((s) => ({
      year: s.selectedYear,
      month: s.selectedMonth,
      day: s.selectedDay,
      events: s.events,
    }))
  );

  const rawSelectedEvents = getEventsOn(events, year, month, day);
  
  // Sort events: those with links first
  const selectedEvents = [...rawSelectedEvents].sort((a, b) => {
    const hasLinkA = !!(a.link || a["링크"] || a.url || a.URL);
    const hasLinkB = !!(b.link || b["링크"] || b.url || b.URL);
    if (hasLinkA && !hasLinkB) return -1;
    if (!hasLinkA && hasLinkB) return 1;
    return 0;
  });

  const monthName = MONTH_NAMES[month];
  const todayKey = dayjs().format("YYYY-MM-DD");

  return (
    <div className="relative h-full w-full flex flex-col items-stretch pr-0">
      
      {/* Stacked Paper Effect - Background Layer (Desktop only) */}
      <div 
        className="hidden lg:block absolute inset-y-4 left-0 right-0 z-10 rounded-l-[20px] rounded-r-none"
        style={{ 
          background: "linear-gradient(73deg, rgba(255, 255, 255, 0.50) -26.79%, rgba(102, 102, 102, 0.00) 74.1%), linear-gradient(207deg, rgba(255, 255, 255, 0.50) -10.35%, rgba(102, 102, 102, 0.00) 52.35%), #00204D",
          boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
          transform: "translateX(-20px) rotate(-1.2deg)",
          transformOrigin: "center right",
          pointerEvents: "none"
        }}
      />
      
      {/* Main Panel Content: Responsive rounding and height */}
      <div 
        className="relative z-20 flex flex-col w-full pl-8 pr-8 pt-12 pb-10 lg:pl-[56px] lg:pr-0 lg:pt-[47px] lg:pb-[47px] rounded-[20px] lg:rounded-l-[20px] lg:rounded-r-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] lg:shadow-[-30px_0_80px_rgba(0,0,0,0.3)] min-h-[500px] h-[640px] lg:h-[867px]"
        style={{ background: "linear-gradient(73deg, rgba(255, 255, 255, 0.50) -26.79%, rgba(102, 102, 102, 0.00) 74.1%), linear-gradient(207deg, rgba(255, 255, 255, 0.50) -10.35%, rgba(102, 102, 102, 0.00) 52.35%), #00204D" }}
      >
        {/* Date Header */}
        <div className="mb-6 flex flex-row lg:flex-col items-baseline lg:items-start gap-3 lg:gap-1 pr-0 lg:pr-[56px]">
          <div className="text-[38px] lg:text-[50px] font-medium leading-none text-white tracking-tighter">
            {day}
          </div>
          <div className="text-[22px] lg:text-[32px] font-medium leading-none tracking-tight text-white/90">
            {monthName}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 lg:mb-10 h-[4px] w-full bg-white rounded-full lg:rounded-none lg:rounded-l-full" style={{ borderRadius: undefined }} />

        {/* Event Area */}
        <div className="flex-1 relative overflow-hidden pr-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${year}-${month}-${day}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full w-full flex flex-col gap-4 lg:gap-5 overflow-y-auto pr-0 lg:pr-0 custom-scrollbar"
            >
              {selectedEvents.length === 0 ? (
                <div className="flex flex-col gap-2 opacity-25 pr-8 lg:pr-[56px]">
                  <div className="h-[120px] lg:h-[140px] w-full rounded-[20px] border-2 border-dashed border-white/20 flex items-center justify-center text-white/60 font-medium text-[18px] lg:text-[24px]">
                    일정이 없습니다
                  </div>
                </div>
              ) : (
                selectedEvents.map((event) => {
                  const applyLink = event.link || event["링크"] || event.url || event.URL;
                  const isPast = todayKey > event.end;
                  const isUpcoming = todayKey < event.start;

                  return (
                    <div
                      key={event.id}
                      className="relative flex flex-col justify-center p-6 lg:p-8 transition-all duration-300 shrink-0 rounded-[20px] lg:rounded-l-[20px] lg:rounded-r-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.30)",
                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-end lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-[18px] lg:text-[28px] font-normal tracking-tight text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                            {event.title}
                          </div>
                          <div className="text-[18px] lg:text-[25px] font-normal text-white">
                            {fmtRange(event)}
                          </div>
                        </div>
                        
                        {applyLink ? (
                          isPast ? (
                            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full bg-white/[0.1] text-white/40 border border-white/10 text-[14px] lg:text-[16px] font-bold shrink-0 cursor-not-allowed">
                              <span>신청 마감</span>
                            </div>
                          ) : isUpcoming ? (
                            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full bg-white/[0.1] text-white/40 border border-white/10 text-[14px] lg:text-[16px] font-bold shrink-0 cursor-not-allowed">
                              <span>모집 예정</span>
                            </div>
                          ) : (
                            <motion.a 
                              href={applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full text-white shadow-[0_4px_15px_rgba(0,75,178,0.4)] transition-all text-[14px] lg:text-[16px] font-bold shrink-0"
                              style={{ backgroundColor: "#004BB2" }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0059D6")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#004BB2")}
                              onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#003D8F")}
                              onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#0059D6")}
                            >
                              <span>신청하기</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="lg:w-[20px] lg:h-[20px]">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.a>
                          )
                        ) : (
                          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-full bg-white/[0.05] text-white/20 border border-white/5 text-[14px] lg:text-[16px] font-bold shrink-0 cursor-not-allowed">
                            <span>준비 중</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}
