import { useEffect, useState } from "react";
import { Homepage } from "@/pages/homepage";
import { MembersPage } from "@/pages/members";
import { RoadmapPage } from "@/pages/roadmap";

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
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
