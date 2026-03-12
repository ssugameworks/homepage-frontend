import { getAppBasePath, ROUTES } from "@/lib/routes";

export type GlobalNavId = "activity" | "history" | "people";

export const GLOBAL_NAV_ITEMS: Array<{ label: string; id: GlobalNavId }> = [
  { label: "활동", id: "activity" },
  { label: "연혁", id: "history" },
  { label: "임원진", id: "people" },
];

export function pushPath(path: string) {
  const nextPath = `${getAppBasePath()}${path}`;
  window.history.pushState({}, "", nextPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateHome() {
  pushPath(ROUTES.home);
}

export function navigateActivity() {
  pushPath(ROUTES.activity);
}

export function navigateHistory() {
  pushPath(ROUTES.history);
}

export function navigateMembers() {
  pushPath(ROUTES.members);
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
