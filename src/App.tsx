import { useState, useCallback } from "react";
import { normalizeAppPath, ROUTES } from "@/lib/routes";
import { navigateByNavId, navigateHome, GLOBAL_NAV_ITEMS } from "@/lib/navigation";
import { Header } from "@/pages/homepage/components";
import { logoSrc } from "@/pages/roadmap/constants";
import type { HeaderConfig } from "@/lib/header-config";
import { HistoryPage } from "@/pages/history";
import { Homepage } from "@/pages/homepage";
import { MembersPage } from "@/pages/members";
import { RoadmapPage } from "@/pages/roadmap";
import { NotFoundPage } from "@/pages/not-found";
import { useEffect } from "react";

function useRoute() {
  const [path, setPath] = useState(normalizeAppPath(window.location.pathname));
  useEffect(() => {
    const handler = () => setPath(normalizeAppPath(window.location.pathname));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  return path;
}

export function App() {
  const path = useRoute();
  const [heroReady, setHeroReady] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    activeSection: "home",
    darkHero: true,
  });

  const isHome = path === ROUTES.home;
  const isKnownRoute = isHome
    || path === ROUTES.history
    || path === ROUTES.members
    || path === ROUTES.activity
    || path === ROUTES.activityLegacy;
  const onScrollTop = isHome
    ? () => window.scrollTo({ top: 0, behavior: "smooth" })
    : navigateHome;

  const onHeroReady = useCallback(() => setHeroReady(true), []);
  const onHeaderConfig = useCallback((cfg: HeaderConfig) => setHeaderConfig(cfg), []);

  return (
    <>
      <Header
        activeSection={headerConfig.activeSection}
        heroReady={heroReady}
        logoSrc={logoSrc}
        navItems={GLOBAL_NAV_ITEMS}
        pageTitle={headerConfig.pageTitle}
        darkHero={headerConfig.darkHero ?? true}
        onScrollTop={onScrollTop}
        onNavigate={navigateByNavId}
      />
      {isHome && (
        <Homepage onHeaderConfig={onHeaderConfig} onHeroReady={onHeroReady} />
      )}
      {path === ROUTES.history && (
        <HistoryPage onHeaderConfig={onHeaderConfig} onHeroReady={onHeroReady} />
      )}
      {path === ROUTES.members && (
        <MembersPage onHeaderConfig={onHeaderConfig} onHeroReady={onHeroReady} />
      )}
      {(path === ROUTES.activity || path === ROUTES.activityLegacy) && (
        <RoadmapPage onHeaderConfig={onHeaderConfig} onHeroReady={onHeroReady} />
      )}
      {!isKnownRoute && (
        <NotFoundPage onHeaderConfig={onHeaderConfig} onHeroReady={onHeroReady} />
      )}
    </>
  );
}

export default App;
