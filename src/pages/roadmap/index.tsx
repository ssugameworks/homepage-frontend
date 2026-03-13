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

      <main className="flex min-h-screen w-full justify-center bg-white overflow-x-hidden">
        {/* Sync Container: This wrapper ensures both components stay together at 42px gap */}
        <div className="flex flex-col lg:flex-row w-full max-w-[1440px] min-h-screen items-center lg:items-start justify-center lg:gap-[42px] px-6 lg:px-12">
          
          {/* Left Side: Calendar (Reduced top padding on mobile) */}
          <div className="w-full lg:flex-1 flex flex-col items-center lg:items-end justify-start pt-32 lg:pt-40 pb-12 lg:pb-20">
            <CalendarPane />
          </div>

          {/* Right Side: Event Detail (Full width on mobile, fixed width on desktop) */}
          <div className="w-full lg:w-[440px] xl:w-[480px] flex flex-col items-stretch pb-20 lg:pt-40">
            <EventPanel reducedMotion={!!reducedMotion} />
          </div>
          
        </div>
      </main>
    </div>
  );
}
