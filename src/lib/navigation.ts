export type GlobalNavId = "activity" | "history" | "people";

export const GLOBAL_NAV_ITEMS: Array<{ label: string; id: GlobalNavId }> = [
  { label: "활동", id: "activity" },
  { label: "연혁", id: "history" },
  { label: "임원진", id: "people" },
];

function getBasePath() {
  return window.location.hostname.endsWith("github.io") ? "/homepage-frontend" : "";
}

export function pushPath(path: string) {
  const nextPath = `${getBasePath()}${path}`;
  window.history.pushState({}, "", nextPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateHome() {
  pushPath("/");
}

export function navigateActivity() {
  pushPath("/activity");
}

export function navigateHistory() {
  pushPath("/history");
}

export function navigateMembers() {
  pushPath("/members");
}

export function navigateByNavId(id: GlobalNavId) {
  if (id === "activity") {
    navigateActivity();
    return;
  }

  if (id === "history") {
    navigateHistory();
    return;
  }

  navigateMembers();
}
