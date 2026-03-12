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

      <div className="flex min-h-[calc(100vh-4rem)] mt-16">
        <CalendarPane state={state} />
        <EventPanel reducedMotion={!!reducedMotion} state={state} />
      </div>
    </div>
  );
}
