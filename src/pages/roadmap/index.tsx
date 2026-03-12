import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { navigateByNavId, navigateHome } from "@/lib/navigation";
import { Header } from "@/pages/homepage/components";
import { NAV_ITEMS, logoSrc } from "@/pages/roadmap/constants";
import { CalendarPane } from "@/pages/roadmap/components/CalendarPane";
import { EventPanel } from "@/pages/roadmap/components/EventPanel";
import { useRoadmapStore } from "@/pages/roadmap/store/roadmap-store";
import type { GameEvent } from "@/pages/roadmap/types";

export function RoadmapPage() {
  const reducedMotion = useReducedMotion();
  const setEvents = useRoadmapStore((s) => s.setEvents);

  const { data, isLoading, error } = useQuery({
    queryKey: ["roadmap-events"],
    queryFn: async () => {
      const response = await api.get<GameEvent[]>("/roadmap");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data, setEvents]);

  return (
    <div className="min-h-screen bg-white relative font-pretendard overflow-x-hidden">
      {/* Header Container */}
      <div className="fixed top-0 inset-x-0 z-[100] bg-white/80 backdrop-blur-md">
        <Header
          activeSection="roadmap"
          heroReady={true}
          logoSrc={logoSrc}
          navItems={NAV_ITEMS}
          pageTitle="다가오는 일정"
          onScrollTop={navigateHome}
          onNavigate={navigateByNavId}
          darkHero={false}
        />
      </div>

      <main className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Side: Calendar */}
        <div className="flex-[1.2] flex flex-col items-center justify-center pt-40 pb-20 px-8 lg:px-12">
          {isLoading ? (
            <div className="text-black/20 font-medium">일정을 불러오는 중...</div>
          ) : error ? (
            <div className="text-red-400 font-medium">일정을 불러오지 못했습니다.</div>
          ) : (
            <CalendarPane />
          )}
        </div>

        {/* Right Side: Event Detail (Touches the right wall) */}
        {/* Increased top margin to LG (Header height) to prevent overlap */}
        <div className="w-full lg:w-[42%] xl:w-[38%] relative z-10 pt-24 lg:pt-32">
          <EventPanel reducedMotion={!!reducedMotion} />
        </div>
      </main>
    </div>
  );
}
