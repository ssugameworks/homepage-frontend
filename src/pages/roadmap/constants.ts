import type { Category, DateMotion, GameEvent } from "@/pages/roadmap/types";

export const logoSrc = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
export const NAV_ITEMS = [{ label: "홈으로", id: "back" }];
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const MONTH_NAMES = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
];

export const DAY_LABELS = ["S","M","T","W","T","F","S"];
export const DAY_KO = ["일","월","화","수","목","금","토"];

export const DATE_HEADER_VARIANTS = {
  enter: ({ axis, dir }: DateMotion) => ({
    opacity: 0,
    x: axis === "x" ? (dir > 0 ? 28 : -28) : 0,
    y: axis === "y" ? (dir > 0 ? 30 : -30) : 0,
    scale: 0.96,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: ({ axis, dir }: DateMotion) => ({
    opacity: 0,
    x: axis === "x" ? (dir > 0 ? -24 : 24) : 0,
    y: axis === "y" ? (dir > 0 ? -24 : 24) : 0,
    scale: 1.02,
    filter: "blur(4px)",
  }),
};

export const CAT_COLOR: Record<Category, string> = {
  recruitment: "#f59e0b",
  gathering: "#8b5cf6",
  social: "#ec4899",
  networking: "#0ea5e9",
  competition: "#10b981",
  trip: "#f97316",
};

export const CAT_LABEL: Record<Category, string> = {
  recruitment: "모집",
  gathering: "총회",
  social: "소셜",
  networking: "네트워킹",
  competition: "경연",
  trip: "여행",
};

export const EVENTS: GameEvent[] = [
  { id: "e1", category: "recruitment", title: "신입부원 모집", start: "2026-02-06", end: "2026-03-10" },
  { id: "e2", category: "gathering", title: "개강총회 (OT)", start: "2026-03-18", end: "2026-03-18" },
  { id: "e3", category: "social", title: "봄나들이", start: "2026-04-04", end: "2026-04-04" },
  { id: "e4", category: "networking", title: "멘토링", start: "2026-04-20", end: "2026-06-30" },
  { id: "e5", category: "social", title: "짝선짝후", start: "2026-05-09", end: "2026-05-09" },
  { id: "e6", category: "networking", title: "커피챗", start: "2026-05-23", end: "2026-05-23" },
  { id: "e7", category: "competition", title: "아이디어톤", start: "2026-06-13", end: "2026-06-14" },
  { id: "e8", category: "trip", title: "MT", start: "2026-07-03", end: "2026-07-05" },
  { id: "e9", category: "recruitment", title: "2학기 신입 모집", start: "2026-08-17", end: "2026-09-07" },
  { id: "e10", category: "gathering", title: "2학기 개강총회", start: "2026-09-10", end: "2026-09-10" },
  { id: "e11", category: "competition", title: "해커톤", start: "2026-10-10", end: "2026-10-11" },
  { id: "e12", category: "social", title: "종강파티", start: "2026-12-05", end: "2026-12-05" },
];
