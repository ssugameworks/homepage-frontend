import { useEffect, useState } from "react";
import { normalizeAppPath, ROUTES } from "@/lib/routes";
import { HistoryPage } from "@/pages/history";
import { Homepage } from "@/pages/homepage";
import { MembersPage } from "@/pages/members";
import { RoadmapPage } from "@/pages/roadmap";

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
  if (path === ROUTES.history) return <HistoryPage />;
  if (path === ROUTES.members) return <MembersPage />;
  if (path === ROUTES.activity || path === ROUTES.activityLegacy) return <RoadmapPage />;
  return <Homepage />;
}

export default App;
