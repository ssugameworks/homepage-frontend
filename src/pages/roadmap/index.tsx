import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/pages/homepage/components";

const logoSrc = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
const NAV_ITEMS = [{ label: "홈으로", id: "back" }];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MONTH_NAMES = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
];
const DAY_LABELS   = ["S","M","T","W","T","F","S"];
const DAY_KO       = ["일","월","화","수","목","금","토"];

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

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
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
// 선택일 이후 가장 가까운 일정 (빈 날 empty state용)
function getNearestUpcoming(y: number, m: number, d: number): GameEvent | null {
  const k = toKey(y, m, d);
  return (
    EVENTS
      .filter((e) => e.end >= k)
      .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null
  );
}

/* ── Calendar grid builder ───────────────────────────────────────────────────── */
type DayCell = { day: number; kind: "prev" | "cur" | "next" };

function buildGrid(year: number, month: number): DayCell[] {
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
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

/* ── Navigation ──────────────────────────────────────────────────────────────── */
function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/* ── Page ────────────────────────────────────────────────────────────────────── */
export function RoadmapPage() {
  const now        = new Date();
  const todayY     = now.getFullYear();
  const todayM     = now.getMonth();
  const todayD     = now.getDate();

  const [viewYear,  setViewYear]  = useState(todayY);
  const [viewMonth, setViewMonth] = useState(todayM);
  const [selY, setSelY]           = useState(todayY);
  const [selM, setSelM]           = useState(todayM);
  const [selD, setSelD]           = useState(todayD);
  const [navDir, setNavDir]       = useState(1);

  /* ── Cell helpers ── */
  function getCellDate(cell: DayCell): [number, number, number] {
    let y = viewYear, m = viewMonth;
    if (cell.kind === "prev") { m--; if (m < 0)  { m = 11; y--; } }
    if (cell.kind === "next") { m++; if (m > 11) { m = 0;  y++; } }
    return [y, m, cell.day];
  }
  function isSel(cell: DayCell)   { const [y, m, d] = getCellDate(cell); return y === selY && m === selM && d === selD; }
  function isTodayCell(cell: DayCell) { const [y, m, d] = getCellDate(cell); return y === todayY && m === todayM && d === todayD; }
  function cellHasEvent(cell: DayCell) { const [y, m, d] = getCellDate(cell); return getEventsOn(y, m, d).length > 0; }

  /* ── Month navigation ── */
  function shiftView(dir: 1 | -1) {
    setNavDir(dir);
    if (dir === -1) {
      if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
      else setViewMonth(m => m - 1);
    } else {
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
      else setViewMonth(m => m + 1);
    }
  }

  /* ── Date selection — clicking overflow cells also shifts the view ── */
  function select(cell: DayCell) {
    const [y, m, d] = getCellDate(cell);
    if (cell.kind === "prev") shiftView(-1);
    if (cell.kind === "next") shiftView(1);
    setSelY(y); setSelM(m); setSelD(d);
  }

  /* ── Jump to today ── */
  function goToday() {
    const dir: 1 | -1 =
      todayY > viewYear || (todayY === viewYear && todayM > viewMonth) ? 1 : -1;
    setNavDir(dir);
    setViewYear(todayY); setViewMonth(todayM);
    setSelY(todayY);     setSelM(todayM);     setSelD(todayD);
  }

  /* ── Keyboard navigation: ←→ ±1일, ↑↓ ±7일 ── */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const delta: Record<string, number> = {
        ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7,
      };
      const d = delta[e.key];
      if (d === undefined) return;
      e.preventDefault();

      const next = new Date(selY, selM, selD + d);
      const ny = next.getFullYear(), nm = next.getMonth(), nd = next.getDate();

      if (nm !== viewMonth || ny !== viewYear) {
        const dir: 1 | -1 =
          ny > viewYear || (ny === viewYear && nm > viewMonth) ? 1 : -1;
        setNavDir(dir);
        setViewYear(ny); setViewMonth(nm);
      }
      setSelY(ny); setSelM(nm); setSelD(nd);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selY, selM, selD, viewYear, viewMonth]);

  /* ── Derived ── */
  const grid = buildGrid(viewYear, viewMonth);
  const rows: DayCell[][] = [];
  for (let i = 0; i < grid.length; i += 7) rows.push(grid.slice(i, i + 7));

  const selEvents     = getEventsOn(selY, selM, selD);
  const nearestEvent  = selEvents.length === 0 ? getNearestUpcoming(selY, selM, selD) : null;
  const selDayOfWeek  = new Date(selY, selM, selD).getDay();
  const isViewingToday = viewYear === todayY && viewMonth === todayM;

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

        {/* LEFT: Calendar */}
        <div className="flex-1 flex items-start pt-10 px-10 min-w-0">
          <div className="flex items-center gap-6 w-full max-w-[600px]">

            {/* Prev */}
            <button
              onClick={() => shiftView(-1)}
              aria-label="이전 달"
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer border-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Calendar body */}
            <div className="flex-1 min-w-0">

              {/* Title row: year / month / 오늘 button */}
              <div className="flex items-end justify-between px-1 mb-3">
                <AnimatePresence mode="wait" custom={navDir}>
                  <motion.div
                    key={`title-${viewYear}-${viewMonth}`}
                    custom={navDir}
                    initial={{ opacity: 0, x: navDir * 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -navDir * 16 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    <div className="text-[#999] font-medium text-[22px] tracking-[-0.03em] leading-none">{viewYear}</div>
                    <div className="text-black font-bold leading-none mt-0.5" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.04em" }}>
                      {MONTH_NAMES[viewMonth]}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 오늘로 이동 — 이번 달 볼 때는 숨김 */}
                <AnimatePresence>
                  {!isViewingToday && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.15 }}
                      onClick={goToday}
                      className="mb-1 px-3 py-1 rounded-full border border-[#003580] text-[#003580] text-[12px] font-semibold cursor-pointer bg-transparent hover:bg-[#003580] hover:text-white transition-colors"
                    >
                      오늘
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Calendar card */}
              <div className="rounded-[20px] bg-white p-2 border border-black/8">
                {/* Day labels */}
                <div className="grid grid-cols-7 border-b border-[#e8e9eb]">
                  {DAY_LABELS.map((label, i) => (
                    <div key={i} className="flex items-center justify-center h-10 text-[#999] font-medium text-[13px]">
                      {label}
                    </div>
                  ))}
                </div>

                {/* Date grid */}
                <AnimatePresence mode="wait" custom={navDir}>
                  <motion.div
                    key={`grid-${viewYear}-${viewMonth}`}
                    custom={navDir}
                    initial={{ opacity: 0, x: navDir * 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -navDir * 12 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="pt-1"
                  >
                    {rows.map((row, ri) => (
                      <div key={ri} className="grid grid-cols-7">
                        {row.map((cell, ci) => {
                          const active  = isSel(cell);
                          const isToday = isTodayCell(cell);
                          const hasEv   = cellHasEvent(cell);
                          const dim     = cell.kind !== "cur";

                          // 오늘이면서 선택된 경우: filled blue
                          // 오늘이지만 미선택: ring 스타일
                          // 그 외 선택: filled blue
                          const bg      = active ? "#003580" : "transparent";
                          const ring    = isToday && !active ? "2px solid #003580" : "none";
                          const textClr = active ? "#fff"
                            : isToday ? "#003580"
                            : dim     ? "#bbbec4"
                            : "#3d3f42";
                          const fw      = active || isToday ? 700 : 500;

                          return (
                            <button
                              key={ci}
                              onClick={() => select(cell)}
                              className="relative flex flex-col items-center justify-center cursor-pointer border-0 bg-transparent hover:bg-black/[0.04] rounded-xl transition-colors"
                              style={{ height: 64 }}
                              aria-label={`${cell.day}일`}
                              aria-pressed={active}
                            >
                              <div
                                className="w-9 h-9 flex items-center justify-center rounded-full text-[14px] transition-all duration-150"
                                style={{
                                  background: bg,
                                  outline: ring,
                                  outlineOffset: "-2px",
                                  color: textClr,
                                  fontWeight: fw,
                                }}
                              >
                                {cell.day}
                              </div>
                              {/* 이벤트 도트 */}
                              {hasEv && (
                                <div
                                  className="absolute bottom-2 w-1 h-1 rounded-full"
                                  style={{ background: active ? "#fff" : isToday ? "#003580" : "#4a7fd4" }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 키보드 힌트 */}
              <div className="mt-3 text-center text-[11px] text-[#bbb] font-medium tracking-wide select-none">
                ← → ↑ ↓ 키로 날짜를 탐색할 수 있어요
              </div>
            </div>

            {/* Next */}
            <button
              onClick={() => shiftView(1)}
              aria-label="다음 달"
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer border-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT: Dark navy event panel */}
        <div
          className="shrink-0 w-[48%] pt-10 pb-10 px-14 rounded-tl-[20px] rounded-bl-[20px]"
          style={{
            background: "linear-gradient(76deg, rgba(255,255,255,0.12) 0%, rgba(102,102,102,0) 50%), linear-gradient(212deg, rgba(255,255,255,0.12) 0%, rgba(102,102,102,0) 50%), #00204d",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selY}-${selM}-${selD}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="h-full flex flex-col"
            >
              {/* 선택된 날짜 */}
              <div className="mb-6">
                {/* 요일 */}
                <div className="text-white/45 font-medium text-[15px] tracking-[-0.02em] mb-1">
                  {DAY_KO[selDayOfWeek]}요일
                </div>
                <div
                  className="text-white font-bold leading-none"
                  style={{ fontSize: 72, letterSpacing: "-0.04em" }}
                >
                  {selD}
                </div>
                <div
                  className="text-white font-medium leading-none mt-1"
                  style={{ fontSize: 36, letterSpacing: "-0.03em", opacity: 0.85 }}
                >
                  {MONTH_NAMES[selM]}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20 w-full mb-7" />

              {/* Event cards or empty state */}
              {selEvents.length === 0 ? (
                <div>
                  <p className="text-white/40 font-medium text-[17px] leading-relaxed">
                    이 날에는 일정이 없어요
                  </p>

                  {/* 가장 가까운 다음 일정 */}
                  {nearestEvent && (
                    <div className="mt-6">
                      <div className="text-white/30 text-[11px] font-semibold uppercase tracking-[0.14em] mb-3">
                        다음 일정
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: 0.08, ease: EASE }}
                        className="rounded-tl-[16px] rounded-bl-[16px] px-6 py-5"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <div className="text-white/80 font-medium text-[22px] leading-tight tracking-[-0.03em]">
                          {nearestEvent.title}
                        </div>
                        <div className="text-white/50 font-medium text-[15px] mt-1.5 tracking-[-0.02em]">
                          {fmtRange(nearestEvent)}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {selEvents.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: i * 0.06, ease: EASE }}
                      className="rounded-tl-[20px] rounded-bl-[20px] px-7 py-6"
                      style={{ background: "rgba(255,255,255,0.18)" }}
                    >
                      <div className="text-white font-semibold text-[24px] leading-tight tracking-[-0.03em]">
                        {e.title}
                      </div>
                      <div className="text-white/65 font-medium text-[15px] mt-2 tracking-[-0.02em]">
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
