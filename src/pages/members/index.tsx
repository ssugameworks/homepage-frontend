import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Header } from "@/pages/homepage/components";

import imgExec1 from "@/assets/exec-img-1.webp";
import imgExec2 from "@/assets/exec-img-2.webp";
import imgExec3 from "@/assets/exec-img-3.webp";
import imgExec4 from "@/assets/exec-img-4.webp";
import imgExec5 from "@/assets/exec-img-5.webp";
import imgExec6 from "@/assets/exec-img-6.webp";
import imgExec7 from "@/assets/exec-img-7.webp";

const logoSrc = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
const NAV_ITEMS = [{ label: "홈으로", id: "back" }];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Member = {
  id: string;
  name: string;
  role: string;
  intro: string;
  summary: string;
  strengths: string[];
  img: string;
  imgStyle: React.CSSProperties;
  accent: string;
};

const MEMBERS: Member[] = [
  {
    id: "jangyuna",
    name: "장윤아",
    role: "회장",
    intro: "팀의 방향을 먼저 정리하고, 사람이 움직이게 만드는 리더입니다.",
    summary: "기획과 디자인을 중심으로 팀의 톤과 흐름을 잡습니다. 프로젝트 초반 구조를 설계하고, 실행이 이어지도록 연결하는 역할을 맡고 있습니다.",
    strengths: ["2026 GAMEWORKS 회장", "기획 / 디자인 파트 리드", "프로젝트 PM 경험 다수", "브랜딩과 UX 설계 중심 운영"],
    img: imgExec1,
    imgStyle: { position: "absolute", width: "107%", height: "112%", left: "-4%", top: "-4%" },
    accent: "#4aa3ff",
  },
  {
    id: "joyoungchan",
    name: "조영찬",
    role: "회장",
    intro: "구조를 빠르게 읽고, 제품으로 바로 이어 붙이는 개발형 리더입니다.",
    summary: "프론트엔드 구현과 개발 운영에 강점이 있습니다. 기술적인 판단을 빠르게 내리고, 팀이 실제 결과물까지 도달하도록 속도를 만드는 역할을 맡고 있습니다.",
    strengths: ["2026 GAMEWORKS 회장", "개발 파트 리드", "프론트엔드 프로젝트 다수", "해커톤 / 제품 개발 경험"],
    img: imgExec2,
    imgStyle: { position: "absolute", width: "110%", height: "116%", left: "-5%", top: "-5%" },
    accent: "#67b0ff",
  },
  {
    id: "parkseoyeong",
    name: "박서영",
    role: "총무",
    intro: "운영이 매끄럽게 돌아가도록 뒤에서 흐름을 단단하게 붙잡습니다.",
    summary: "일정과 운영, 행사 준비를 꼼꼼하게 관리합니다. 팀이 흔들리지 않도록 실무를 챙기고, 필요한 순간에 가장 먼저 움직이는 타입입니다.",
    strengths: ["2026 GAMEWORKS 총무", "행사 운영 및 일정 관리", "내부 커뮤니케이션 정리", "소모임 운영 실무 담당"],
    img: imgExec3,
    imgStyle: { position: "absolute", width: "116%", height: "121%", left: "-11%", top: "-7%" },
    accent: "#8cbcff",
  },
  {
    id: "yudaeun",
    name: "유다은",
    role: "부회장",
    intro: "사용자 관점에서 팀의 결과물을 더 선명하게 만드는 디자이너입니다.",
    summary: "기획과 디자인 운영을 함께 담당합니다. 화면의 완성도뿐 아니라, 사용자가 이해하기 쉬운 흐름까지 함께 보는 시야가 강점입니다.",
    strengths: ["2026 GAMEWORKS 부회장", "UX / UI 디자인 운영", "기획-디자인 협업 조율", "디자인 프로젝트 경험 다수"],
    img: imgExec4,
    imgStyle: { position: "absolute", width: "106%", height: "112%", left: "-3%", top: "-6%" },
    accent: "#78b5ff",
  },
  {
    id: "choiseojeong",
    name: "최서정",
    role: "부회장",
    intro: "개발이 복잡해질수록 더 차분하게 정리하는 타입의 메이커입니다.",
    summary: "백엔드와 개발 운영을 중심으로 팀을 보조합니다. 기술 구조를 정리하고, 구현이 끊기지 않도록 안정적인 기반을 만드는 데 강점이 있습니다.",
    strengths: ["2026 GAMEWORKS 부회장", "백엔드 개발 중심", "개발 파트 운영 보조", "서비스 구조 설계 경험"],
    img: imgExec5,
    imgStyle: { position: "absolute", width: "106%", height: "112%", left: "-3%", top: "-6%" },
    accent: "#5f9dff",
  },
  {
    id: "choijiwon",
    name: "최지원",
    role: "부회장",
    intro: "사람과 메시지를 연결해 팀의 에너지를 바깥으로 확장합니다.",
    summary: "홍보와 운영 기획을 맡고 있습니다. 팀이 가진 분위기와 강점을 외부에 자연스럽게 전달하고, 내부 활동도 더 잘 보이게 만드는 역할을 합니다.",
    strengths: ["2026 GAMEWORKS 부회장", "마케팅 / 운영 파트", "콘텐츠 기획 및 홍보", "행사 브랜딩 경험"],
    img: imgExec6,
    imgStyle: { position: "absolute", width: "105%", height: "110%", left: "-2%", top: "-5%" },
    accent: "#8aaeff",
  },
  {
    id: "hongjunwoo",
    name: "홍준우",
    role: "부회장",
    intro: "실제 제품을 끝까지 밀어본 경험으로 팀의 기준을 끌어올립니다.",
    summary: "프론트엔드와 제품 구현 경험을 바탕으로 팀에 실전 감각을 더합니다. 빠른 실행과 완성도 사이의 균형을 잘 맞추는 편입니다.",
    strengths: ["전 GAMEWORKS 부회장", "IT지원위원회 Frontend", "또랑 Frontend Lead", "UMC 9기 데모데이 최우수상", "2024 연합해커톤 WISH 우수상", "2024 IT 프로젝트 장려상"],
    img: imgExec7,
    imgStyle: { position: "absolute", width: "125%", height: "103%", left: "-13%", top: "-3%" },
    accent: "#9dc2ff",
  },
];

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function clampIndex(index: number) {
  return (index + MEMBERS.length) % MEMBERS.length;
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function MemberStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-white">{value}</div>
    </div>
  );
}

export function MembersPage() {
  const reducedMotion = !!useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const member = MEMBERS[selectedIndex]!;

  function goTo(index: number) {
    const next = clampIndex(index);
    setDirection(next > selectedIndex ? 1 : next < selectedIndex ? -1 : direction);
    setSelectedIndex(next);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(selectedIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(selectedIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, direction]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[520px] w-[520px] rounded-full bg-[#1a7aff]/16 blur-[130px]" />
        <div className="absolute right-[-10%] top-[18%] h-[460px] w-[460px] rounded-full bg-[#78b5ff]/10 blur-[150px]" />
        <div className="absolute bottom-[-14%] left-[28%] h-[400px] w-[400px] rounded-full bg-[#0d56c9]/18 blur-[160px]" />
      </div>

      <Header
        activeSection="history"
        heroReady={true}
        logoSrc={logoSrc}
        navItems={NAV_ITEMS}
        onScrollTop={goHome}
        onNavigate={() => goHome()}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-10 pt-28 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-end">
          <div className="max-w-[760px]">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55"
            >
              2026 Executive Members
            </motion.div>
            <motion.h1
              className="mt-5 text-[clamp(46px,8vw,108px)] font-semibold leading-[0.94] tracking-[-0.06em] text-white"
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            >
              게임웍스를
              <br />
              움직이는 7명
            </motion.h1>
            <motion.p
              className="mt-6 max-w-[640px] text-[clamp(18px,2.2vw,24px)] leading-[1.6] tracking-[-0.03em] text-white/68"
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            >
              누가 어떤 역할을 맡고 있는지, 무엇을 잘하는지 한 번에 이해되도록 정리했습니다.
              카드를 넘기면서 2026 GAMEWORKS를 만드는 사람들을 살펴볼 수 있습니다.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-3 gap-3 self-start lg:self-end"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          >
            <MemberStat label="Current" value={`${formatIndex(selectedIndex)} / ${String(MEMBERS.length).padStart(2, "0")}`} />
            <MemberStat label="Roles" value="4 kinds" />
            <MemberStat label="Since" value="2026 lineup" />
          </motion.div>
        </div>

        <section className="mt-10 grid flex-1 gap-8 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1fr)] lg:gap-10">
          <div className="relative min-h-[420px] lg:min-h-[640px]">
            <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md" />
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={member.id}
                custom={direction}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction * 36, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -direction * 28, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0"
              >
                <div
                  className="absolute left-6 top-6 z-10 rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em]"
                  style={{ background: `${member.accent}18`, color: member.accent, border: `1px solid ${member.accent}40` }}
                >
                  {member.role}
                </div>
                <div
                  className="absolute right-6 top-6 z-10 rounded-full px-3 py-1.5 text-[12px] font-semibold tabular-nums tracking-[0.18em] text-white/55"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                >
                  {formatIndex(selectedIndex)}
                </div>
                <div className="absolute inset-[18px] overflow-hidden rounded-[24px] bg-[#0d1626]">
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{ background: `radial-gradient(circle at 50% 12%, ${member.accent}40 0%, rgba(7,17,31,0) 36%)` }}
                  />
                  <img
                    alt={member.name}
                    src={member.img}
                    loading="eager"
                    decoding="async"
                    className="absolute max-w-none"
                    style={member.imgStyle}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07111f] via-[#07111f]/75 to-transparent" />
                  <div className="absolute bottom-7 left-7 right-7">
                    <div className="text-[clamp(34px,4vw,56px)] font-semibold leading-none tracking-[-0.05em] text-white">
                      {member.name}
                    </div>
                    <div className="mt-3 text-[15px] leading-[1.6] tracking-[-0.02em] text-white/70">
                      {member.intro}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex min-h-[420px] flex-col rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-md lg:min-h-[640px] lg:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${member.id}-content`}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-full flex-col"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/38">
                      Profile
                    </div>
                    <h2 className="mt-3 text-[clamp(34px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
                      {member.name}
                    </h2>
                    <p className="mt-4 max-w-[560px] text-[clamp(17px,2vw,22px)] leading-[1.7] tracking-[-0.03em] text-white/74">
                      {member.summary}
                    </p>
                  </div>
                  <div
                    className="hidden rounded-[24px] px-4 py-3 text-right text-[13px] font-semibold uppercase tracking-[0.18em] lg:block"
                    style={{ background: `${member.accent}12`, color: member.accent, border: `1px solid ${member.accent}33` }}
                  >
                    {member.role}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {member.strengths.map((item, index) => (
                    <motion.div
                      key={item}
                      className="rounded-[22px] border border-white/8 bg-[#0b1524]/86 px-4 py-4"
                      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: reducedMotion ? 0 : 0.06 * index, ease: EASE }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: member.accent, boxShadow: `0 0 0 6px ${member.accent}18` }}
                        />
                        <p className="text-[15px] leading-[1.65] tracking-[-0.02em] text-white/78">
                          {item}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/38">
                      Carousel
                    </div>
                    <div className="hidden text-[12px] font-medium tracking-[0.08em] text-white/34 md:block">
                      키보드 화살표로도 탐색할 수 있습니다
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => goTo(selectedIndex - 1)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                      aria-label="이전 임원"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <div className="min-w-0 flex-1 overflow-hidden">
                      <motion.div
                        className="flex gap-3"
                        animate={{ x: `calc(50% - ${selectedIndex * 112 + 52}px)` }}
                        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 }}
                      >
                        {MEMBERS.map((item, index) => {
                          const active = index === selectedIndex;
                          return (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => goTo(index)}
                              aria-pressed={active}
                              className="relative h-[132px] w-[104px] shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-[#0b1524] text-left"
                            >
                              <img
                                alt=""
                                aria-hidden="true"
                                src={item.img}
                                loading="lazy"
                                decoding="async"
                                className="absolute max-w-none transition-transform duration-300"
                                style={item.imgStyle}
                              />
                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07111f] via-[#07111f]/80 to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3">
                                <div className="text-[12px] font-semibold leading-none tracking-[-0.03em] text-white">
                                  {item.name}
                                </div>
                                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
                                  {item.role}
                                </div>
                              </div>
                              {active && (
                                <motion.div
                                  layoutId="member-active-frame"
                                  className="absolute inset-0 rounded-[22px]"
                                  style={{ boxShadow: `inset 0 0 0 1.5px ${item.accent}, 0 18px 40px rgba(5,10,20,0.45)` }}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    </div>

                    <button
                      type="button"
                      onClick={() => goTo(selectedIndex + 1)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                      aria-label="다음 임원"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
