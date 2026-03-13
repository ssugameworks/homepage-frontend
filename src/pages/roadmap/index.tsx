import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarPane } from "@/pages/roadmap/components/CalendarPane";
import { EventPanel } from "@/pages/roadmap/components/EventPanel";
import { useRoadmapCalendar } from "@/pages/roadmap/hooks/useRoadmapCalendar";
import type { PageProps } from "@/lib/header-config";
import { Footer } from "@/components/Footer";

/* ── Page ────────────────────────────────────────────────────────────────────── */
export function RoadmapPage({ onHeaderConfig, onHeroReady }: PageProps) {
  const reducedMotion = useReducedMotion();
  const state = useRoadmapCalendar();

  useEffect(() => {
    onHeaderConfig({ activeSection: "people", pageTitle: "다가오는 일정", darkHero: false });
    onHeroReady();
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "auto";
    return () => {
      document.documentElement.style.scrollbarGutter = prev;
    };
  }, []);

  return (
    <div className="bg-surface relative overflow-x-hidden">
      <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col gap-4 px-4 pb-6 pt-20 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:pl-8 lg:pr-0 lg:pt-24 xl:gap-8 xl:pl-10">
        <div className="order-2 w-full lg:order-1 lg:flex-1 lg:self-center">
          <CalendarPane state={state} />
        </div>
        <div className="order-1 w-full lg:order-2 lg:w-auto">
          <EventPanel reducedMotion={!!reducedMotion} state={state} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
