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
      
      {/* 겹쳐진 카드 효과 (Diagonal Stacked Layers - Sticking out from the TOP-LEFT) */}
      {/* Back Layer: Furthest offset */}
      <div 
        className="absolute inset-0 z-0 bg-[#2d3d5a] rounded-l-[40px] rounded-r-0 opacity-30 shadow-lg -translate-x-6 -translate-y-6 scale-95 mt-16"
        style={{ transformOrigin: 'bottom right' }}
      />
      {/* Middle Layer: Slight offset */}
      <div 
        className="absolute inset-0 z-10 bg-[#324563] rounded-l-[40px] rounded-r-0 opacity-60 shadow-lg -translate-x-3 -translate-y-3 scale-98 mt-16"
        style={{ transformOrigin: 'bottom right' }}
      />
      
      {/* Main Panel Content: Rounded only on the LEFT, Flat on the RIGHT (Wall) */}
      <div 
        className="relative z-20 flex-1 flex flex-col px-12 pt-16 pb-12 rounded-l-[40px] rounded-r-0 shadow-[-30px_0_80px_rgba(0,0,0,0.4)] min-h-[calc(100vh-80px)] mt-16"
        style={{ background: "#23344d" }}
      >
        {/* Date Header */}
        <div className="mb-6 flex flex-col items-start gap-1">
          <div className="text-[64px] font-bold leading-none text-white tracking-tighter">
            {day}
          </div>
          <div className="text-[36px] font-medium leading-none tracking-tight text-white/90">
            {monthName}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 h-[2px] w-full bg-white/20" />

        {/* Event List */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {selectedEvents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2 opacity-25"
              >
                <div className="h-[140px] w-full rounded-[24px] border-2 border-dashed border-white/20 flex items-center justify-center text-white/60 font-medium text-[20px]">
                  일정이 없습니다
                </div>
              </motion.div>
            ) : (
              selectedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: EASE }}
                  className="flex flex-col justify-center rounded-[24px] bg-white/[0.12] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border border-white/10 group hover:bg-white/[0.16] transition-all duration-300"
                >
                  <div className="text-[26px] font-bold tracking-tight text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                    {event.title}
                  </div>
                  <div className="text-[20px] font-medium text-white/60">
                    {fmtRange(event)}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 10px; }
      `}</style>
    </div>
  );
}
