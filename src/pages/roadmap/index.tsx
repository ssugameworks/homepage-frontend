import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/pages/homepage/components";

const logoSrc = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
const NAV_ITEMS = [{ label: "홈으로", id: "back" }];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MONTH_NAMES = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
];
const DAY_LABELS = ["S","M","T","W","T","F","S"];

/* ── Events ─────────────────────────────────────────────────────────────────── */
type GameEvent = {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  end: string;
};

const EVENTS: GameEvent[] = [
  { id: "e1",  title: "신입부원 모집",    start: "2026-02-06", end: "2026-03-10" },
  { id: "e2",  title: "개강총회 (OT)",   start: "2026-03-18", end: "2026-03-18" },
  { id: "e3",  title: "봄나들이",         start: "2026-04-04", end: "2026-04-04" },
  { id: "e4",  title: "멘토링",           start: "2026-04-20", end: "2026-06-30" },
  { id: "e5",  title: "짝선짝후",         start: "2026-05-09", end: "2026-05-09" },
  { id: "e6",  title: "커피챗",           start: "2026-05-23", end: "2026-05-23" },
  { id: "e7",  title: "아이디어톤",       start: "2026-06-13", end: "2026-06-14" },
  { id: "e8",  title: "MT",              start: "2026-07-03", end: "2026-07-05" },
  { id: "e9",  title: "2학기 신입 모집", start: "2026-08-17", end: "2026-09-07" },
  { id: "e10", title: "2학기 개강총회",  start: "2026-09-10", end: "2026-09-10" },
  { id: "e11", title: "해커톤",           start: "2026-10-10", end: "2026-10-11" },
  { id: "e12", title: "종강파티",         start: "2026-12-05", end: "2026-12-05" },
];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function getEventsOn(y: number, m: number, d: number) {
  const k = toKey(y, m, d);
  return EVENTS.filter((e) => e.start <= k && k <= e.end);
}
function fmtRange(e: GameEvent) {
  return e.start === e.end
    ? e.start.replaceAll("-", ".")
    : `${e.start.replaceAll("-", ".")} ~ ${e.end.replaceAll("-", ".")}`;
}

/* ── Calendar grid builder ──────────────────────────────────────────────────── */
type DayCell = { day: number; kind: "prev" | "cur" | "next" };

function buildGrid(year: number, month: number): DayCell[] {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMon   = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, kind: "prev" });
  for (let i = 1; i <= daysInMon; i++)
    cells.push({ day: i, kind: "cur" });
  const rem = cells.length % 7;
  if (rem > 0)
    for (let i = 1; i <= 7 - rem; i++)
      cells.push({ day: i, kind: "next" });

  return cells;
}

/* ── Navigation helpers ─────────────────────────────────────────────────────── */
function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export function RoadmapPage() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selY, setSelY]           = useState(today.getFullYear());
  const [selM, setSelM]           = useState(today.getMonth());
  const [selD, setSelD]           = useState(today.getDate());
  const [navDir, setNavDir]       = useState(1);

  function prevMonth() {
    setNavDir(-1);
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    setNavDir(1);
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }
  function select(cell: DayCell) {
    let y = viewYear, m = viewMonth;
    if (cell.kind === "prev") { m--; if (m < 0)  { m = 11; y--; } }
    if (cell.kind === "next") { m++; if (m > 11) { m = 0;  y++; } }
    setSelY(y); setSelM(m); setSelD(cell.day);
  }
  function isSel(cell: DayCell) {
    let y = viewYear, m = viewMonth;
    if (cell.kind === "prev") { m--; if (m < 0)  { m = 11; y--; } }
    if (cell.kind === "next") { m++; if (m > 11) { m = 0;  y++; } }
    return y === selY && m === selM && cell.day === selD;
  }
  function cellHasEvent(cell: DayCell) {
    let y = viewYear, m = viewMonth;
    if (cell.kind === "prev") { m--; if (m < 0)  { m = 11; y--; } }
    if (cell.kind === "next") { m++; if (m > 11) { m = 0;  y++; } }
    return getEventsOn(y, m, cell.day).length > 0;
  }

  const grid = buildGrid(viewYear, viewMonth);
  const rows: DayCell[][] = [];
  for (let i = 0; i < grid.length; i += 7) rows.push(grid.slice(i, i + 7));

  const selEvents = getEventsOn(selY, selM, selD);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <Header
        activeSection="people"
        heroReady={true}
        logoSrc={logoSrc}
        navItems={NAV_ITEMS}
        onScrollTop={goHome}
        onNavigate={() => goHome()}
        darkHero={false}
      />

      {/* ── Split layout ── */}
      <div className="flex min-h-[calc(100vh-4rem)] mt-16">

        {/* LEFT: Calendar area */}
        <div className="flex-1 flex items-start pt-10 px-10 min-w-0">
          <div className="flex items-center gap-8 w-full max-w-[600px]">

            {/* Prev arrow */}
            <button
              onClick={prevMonth}
              aria-label="이전 달"
              className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer border-0"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Calendar */}
            <div className="flex-1 min-w-0">
              {/* Year + Month title */}
              <AnimatePresence mode="wait" custom={navDir}>
                <motion.div
                  key={`title-${viewYear}-${viewMonth}`}
                  custom={navDir}
                  initial={{ opacity: 0, x: navDir * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -navDir * 20 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="px-2 mb-2"
                >
                  <div className="text-[#888] font-medium text-[28px] tracking-[-0.03em] leading-none">{viewYear}</div>
                  <div className="text-black font-bold leading-none mt-1" style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.04em" }}>
                    {MONTH_NAMES[viewMonth]}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Glass calendar card */}
              <div className="rounded-[20px] bg-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-2 border border-black/5">
                {/* Day labels */}
                <div className="grid grid-cols-7 border-b border-[#bdbec2]">
                  {DAY_LABELS.map((d, i) => (
                    <div key={i} className="flex items-center justify-center h-11 text-[#3d3f42] font-medium text-[15px]">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Date grid */}
                <AnimatePresence mode="wait" custom={navDir}>
                  <motion.div
                    key={`grid-${viewYear}-${viewMonth}`}
                    custom={navDir}
                    initial={{ opacity: 0, x: navDir * 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -navDir * 16 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="pt-2"
                  >
                    {rows.map((row, ri) => (
                      <div key={ri} className="grid grid-cols-7">
                        {row.map((cell, ci) => {
                          const active = isSel(cell);
                          const hasEv  = cellHasEvent(cell);
                          const dim    = cell.kind !== "cur";
                          return (
                            <button
                              key={ci}
                              onClick={() => select(cell)}
                              className="relative flex flex-col items-center pt-2 pb-4 cursor-pointer border-0 bg-transparent hover:bg-black/[0.03] rounded-lg transition-colors"
                              style={{ height: 72 }}
                              aria-label={`${cell.day}일`}
                              aria-pressed={active}
                            >
                              <div
                                className="w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-medium transition-all duration-150"
                                style={{
                                  background: active ? "#003580" : "transparent",
                                  color: active ? "#fff"
                                    : dim ? "#888b91"
                                    : "#3d3f42",
                                  fontWeight: active ? 700 : 500,
                                }}
                              >
                                {cell.day}
                              </div>
                              {hasEv && (
                                <div className="absolute bottom-1.5 w-1 h-1 rounded-full" style={{ background: active ? "#fff" : "#003580" }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={nextMonth}
              aria-label="다음 달"
              className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer border-0"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT: Dark navy event panel — left side rounded only */}
        <div
          className="shrink-0 w-[48%] pt-10 pb-10 px-14 rounded-tl-[20px] rounded-bl-[20px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            background: "linear-gradient(76deg, rgba(255,255,255,0.15) 0%, rgba(102,102,102,0) 50%), linear-gradient(212deg, rgba(255,255,255,0.15) 0%, rgba(102,102,102,0) 50%), linear-gradient(90deg, #00204d, #00204d)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selY}-${selM}-${selD}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="h-full flex flex-col"
            >
              {/* Selected date */}
              <div className="mb-6">
                <div
                  className="text-white font-medium leading-none"
                  style={{ fontSize: 72, letterSpacing: "-0.03em" }}
                >
                  {selD}
                </div>
                <div
                  className="text-white font-medium leading-none mt-1"
                  style={{ fontSize: 44, letterSpacing: "-0.03em" }}
                >
                  {MONTH_NAMES[selM]}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white w-full mb-8" />

              {/* Event cards */}
              {selEvents.length === 0 ? (
                <div className="py-10 text-white/40 font-medium text-[18px]">
                  이 날에는 일정이 없어요
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {selEvents.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.07, ease: EASE }}
                      className="rounded-tl-[20px] rounded-bl-[20px] px-8 py-7"
                      style={{
                        background: "rgba(255,255,255,0.3)",
                        boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div className="text-white font-medium text-[28px] leading-tight tracking-[-0.03em]">
                        {e.title}
                      </div>
                      <div className="text-white font-medium text-[22px] mt-1 tracking-[-0.02em]">
                        {fmtRange(e)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
