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

/* ── Page ────────────────────────────────────────────────────────────────────── */
export function RoadmapPage() {
  const reducedMotion = useReducedMotion();
  const setEvents = useRoadmapStore((s) => s.setEvents);

  const { data, isLoading, error } = useQuery({
    queryKey: ["roadmap-events"],
    queryFn: async () => {
      const response = await api.get<GameEvent[]>("/roadmap");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync data to store only when it changes
  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data, setEvents]);

  useEffect(() => {
    const prev = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "auto";
    return () => {
      document.documentElement.style.scrollbarGutter = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface relative overflow-x-hidden">
      <Header
        activeSection="people"
        heroReady={true}
        logoSrc={logoSrc}
        navItems={NAV_ITEMS}
        pageTitle="다가오는 일정"
        onScrollTop={navigateHome}
        onNavigate={navigateByNavId}
        darkHero={false}
      />

      <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col gap-4 px-4 pb-6 pt-20 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:pl-8 lg:pr-0 lg:pt-24 xl:gap-8 xl:pl-10">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-ink/40 font-medium">
            일정을 불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-red-500 font-medium">
            일정을 불러오지 못했습니다.
          </div>
        ) : (
          <>
            <div className="order-2 w-full lg:order-1 lg:flex-1 lg:self-center">
              <CalendarPane />
            </div>
            <div className="order-1 w-full lg:order-2 lg:w-auto">
              <EventPanel reducedMotion={!!reducedMotion} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
