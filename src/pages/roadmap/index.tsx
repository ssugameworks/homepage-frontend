import { useReducedMotion } from "framer-motion";
import { Header } from "@/pages/homepage/components";
import { NAV_ITEMS, logoSrc } from "@/pages/roadmap/constants";
import { CalendarPane } from "@/pages/roadmap/components/CalendarPane";
import { EventPanel } from "@/pages/roadmap/components/EventPanel";
import { useRoadmapCalendar } from "@/pages/roadmap/hooks/useRoadmapCalendar";

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/* ── Page ────────────────────────────────────────────────────────────────────── */
export function RoadmapPage() {
  const reducedMotion = useReducedMotion();
  const state = useRoadmapCalendar();

  return (
    <div className="min-h-screen bg-[#f7f8fa] relative overflow-x-hidden">
      <Header
        activeSection="people"
        heroReady={true}
        logoSrc={logoSrc}
        navItems={NAV_ITEMS}
        onScrollTop={goHome}
        onNavigate={() => goHome()}
        darkHero={false}
      />

      <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col gap-4 px-4 pb-6 pt-20 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:pl-8 lg:pr-0 lg:pt-24 xl:gap-8 xl:pl-10">
        <div className="order-2 w-full lg:order-1 lg:flex-1 lg:self-center">
          <CalendarPane state={state} />
        </div>
        <div className="order-1 w-full lg:order-2 lg:w-auto">
          <EventPanel reducedMotion={!!reducedMotion} state={state} />
        </div>
      </main>
    </div>
  );
}
