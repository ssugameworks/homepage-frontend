import { useEffect, useState } from "react";
import { Homepage } from "@/pages/homepage";
import { MembersPage } from "@/pages/members";
import { RoadmapPage } from "@/pages/roadmap";

function normalizePath(pathname: string) {
  return pathname.replace(/^\/homepage-frontend/, "") || "/";
}

function useRoute() {
  const [path, setPath] = useState(normalizePath(window.location.pathname));
  useEffect(() => {
    const handler = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  return path;
}

export function App() {
  const path = useRoute();
  if (path === "/members")  return <MembersPage />;
  if (path === "/roadmap")  return <RoadmapPage />;
  return <Homepage />;
}

export default App;
