export const BASE_PATH = "/homepage-frontend";

export const ROUTES = {
  home: "/",
  activity: "/activity",
  activityLegacy: "/roadmap",
  history: "/history",
  members: "/members",
} as const;

export function getAppBasePath() {
  return window.location.hostname.endsWith("github.io") ? BASE_PATH : "";
}

export function normalizeAppPath(pathname: string) {
  return pathname.replace(new RegExp(`^${BASE_PATH}`), "") || ROUTES.home;
}

