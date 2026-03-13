import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { MONTH_NAMES, EASE } from "@/pages/roadmap/constants";
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

  const selectedEvents = getEventsOn(events, year, month, day);
  const monthName = MONTH_NAMES[month];

  return (
    <div className="relative h-full w-full flex flex-col items-stretch pr-0">
      
      {/* Main Panel Content: Responsive rounding and height */}
      <div 
        className="relative z-20 flex flex-col w-full px-8 lg:px-12 pt-12 pb-10 rounded-[20px] lg:rounded-l-[20px] lg:rounded-r-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] lg:shadow-[-30px_0_80px_rgba(0,0,0,0.3)] min-h-[500px] h-[640px] lg:h-[720px]"
        style={{ background: "#23344d" }}
      >
        {/* Date Header */}
        <div className="mb-6 flex flex-col items-start gap-1">
          <div className="text-[52px] lg:text-[64px] font-bold leading-none text-white tracking-tighter">
            {day}
          </div>
          <div className="text-[24px] lg:text-[32px] font-medium leading-none tracking-tight text-white/90">
            {monthName}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 lg:mb-10 h-[2px] w-full bg-white/20" />

        {/* Event Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${year}-${month}-${day}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full w-full flex flex-col gap-4 lg:gap-5 overflow-y-auto pr-2 custom-scrollbar"
            >
              {selectedEvents.length === 0 ? (
                <div className="flex flex-col gap-2 opacity-25">
                  <div className="h-[120px] lg:h-[140px] w-full rounded-[20px] border-2 border-dashed border-white/20 flex items-center justify-center text-white/60 font-medium text-[18px] lg:text-[24px]">
                    일정이 없습니다
                  </div>
                </div>
              ) : (
                selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col justify-center rounded-[20px] bg-white/[0.12] p-6 lg:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border border-white/10 group hover:bg-white/[0.16] transition-all duration-300 shrink-0"
                  >
                    <div className="text-[18px] lg:text-[28px] font-bold tracking-tight text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </div>
                    <div className="text-[14px] lg:text-[20px] font-medium text-white/60">
                      {fmtRange(event)}
                    </div>
                  </div>
                ))
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
