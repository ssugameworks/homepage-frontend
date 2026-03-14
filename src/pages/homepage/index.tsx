import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import { GameworksLogo } from "@/pages/homepage/components";
import type { PageProps } from "@/lib/header-config";
import { TimelineSection } from "@/pages/homepage/components/TimelineSection";
import { FadeUp, SlideIn } from "@/pages/homepage/components/motion";
import { TIMELINE } from "@/pages/homepage/content/homepage";
import {
  scrollTo,
  useCursorFollower,
  useParallaxEffect,
  useScrollProgress,
  useSectionBackground,
} from "@/pages/homepage/hooks/useHomepageEffects";
import { CTASection } from "@/pages/homepage/sections/CTASection";
import { StatsSection } from "@/pages/homepage/sections/StatsSection";
import { Footer } from "@/components/Footer";
import { navigateActivity } from "@/lib/navigation";

/* ─── Local assets ────────────────────────────────────────────────────── */
import imgFrame1    from "@/assets/layer-2-img-1.webp";
import imgFrame2    from "@/assets/layer-2-img-2.webp";
import imgDesktop26 from "@/assets/layer-3-img-1.webp";
import imgFrame7    from "@/assets/exec-img-1.webp";
import imgFrame8    from "@/assets/exec-img-2.webp";
import imgFrame9    from "@/assets/exec-img-3.webp";
import imgFrame10   from "@/assets/exec-img-4.webp";
import imgFrame11   from "@/assets/exec-img-5.webp";
import imgFrame12   from "@/assets/exec-img-6.webp";
import imgFrame13   from "@/assets/exec-img-7.webp";
import eventImg1    from "@/assets/event-img-1.webp";
import eventImg2    from "@/assets/event-img-2.webp";
import eventImg3    from "@/assets/event-img-3.webp";
import eventImg4    from "@/assets/event-img-4.webp";
import eventImg5    from "@/assets/event-img-5.webp";
import eventImg6    from "@/assets/event-img-6.webp";

/* ─── Figma assets (no local equivalent yet) ─────────────────────────── */
const imgRectangle = "https://www.figma.com/api/mcp/asset/f844113f-1290-4f7b-b756-c9535804cb22";

const glowColors = [
  "#3B82F6","#6366F1","#8B5CF6","#A78BFA",
  "#60A5FA","#818CF8","#7C3AED","#4F46E5",
  "#2563EB","#7C3AED","#6D28D9","#4338CA",
  "#3B82F6","#60A5FA","#818CF8","#8B5CF6",
];

const SECTION_HEADING_SIZE = "clamp(30px, 4.2vw, 52px)";

const MEMBERS = [
  { role: "회장", name: "장윤아", desc: "기획과 디자인으로 팀의 방향을 함께 만들어가요.", img: imgFrame7, delay: 0, style: { height: "112.66%", left: "-3.52%", top: "-3.54%", width: "106.8%" } },
  { role: "회장", name: "조영찬", desc: "프론트엔드와 개발 운영으로 팀의 속도를 만들어요.", img: imgFrame8, delay: 80, style: { height: "115.78%", left: "-4.82%", top: "-5.19%", width: "109.76%" } },
  { role: "총무", name: "박서영", desc: "일정과 운영을 꼼꼼하게 챙겨서 팀이 잘 돌아가게 해요.", img: imgFrame9, delay: 160, style: { height: "121.45%", left: "-10.96%", top: "-7.3%", width: "115.94%" } },
  { role: "부회장", name: "유다은", desc: "UX 디자인으로 결과물을 더 선명하게 만들어요.", img: imgFrame10, delay: 0, style: { height: "111.61%", left: "-3.17%", top: "-5.98%", width: "105.81%" } },
  { role: "부회장", name: "최서정", desc: "백엔드 설계로 팀의 든든한 기반을 만들어요.", img: imgFrame11, delay: 80, style: { height: "111.78%", left: "-3.15%", top: "-5.74%", width: "105.97%" } },
  { role: "부회장", name: "최지원", desc: "홍보와 콘텐츠로 게임웍스의 에너지를 밖으로 전해요.", img: imgFrame12, delay: 160, style: { height: "110.35%", left: "-2.37%", top: "-5.22%", width: "104.61%" } },
  { role: "부회장", name: "홍준우", desc: "프론트엔드 경험으로 팀의 구현 수준을 높여요.", img: imgFrame13, delay: 240, style: { height: "102.78%", left: "-12.76%", top: "-2.86%", width: "124.99%" } },
] as const;

const EVENTS = [
  {
    title: "벚꽃을 보러 놀러가요.",
    titleHighlight: "봄나들이",
    description: <>벚꽃을 보러 밖에 나가요.<br />가볍게 친해지기 딱 좋은 시간이에요.</>,
    imgSrc: eventImg1,
    imgStyle: { height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" } as React.CSSProperties,
  },
  {
    title: "선배에게 물어봐요.",
    titleHighlight: "멘토링",
    description: <>학교 생활, 전공, 소모임 활용까지 —<br />먼저 겪어본 재학생 멘토한테 뭐든 물어볼 수 있어요.</>,
    imgSrc: eventImg2,
    imgStyle: { height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" } as React.CSSProperties,
  },
  {
    title: "미션을 풀며 친해져요.",
    titleHighlight: "짝선짝후",
    description: <>선배·후배 짝지어 미션을 같이 풀어요.<br />어색함이 금방 사라져요.</>,
    imgSrc: eventImg3,
    imgStyle: { height: "139.2%", left: "-1.69%", top: "-10.62%", width: "103.47%" } as React.CSSProperties,
  },
  {
    title: "직무에 대한 이야기를 들어요.",
    titleHighlight: "커피챗",
    description: <>실제 일하고 있는 선배의 커리어 이야기를 직접 들어요.<br />취업, 진로 — 궁금한 거 바로 물어볼 수 있어요.</>,
    imgSrc: eventImg4,
    imgStyle: { height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" } as React.CSSProperties,
  },
  {
    title: "더 큰 현장과 연결돼요.",
    titleHighlight: "Flow: Startup Bridge",
    description: <>스타트업과 창업 생태계 이야기를 가까이에서 들어요.<br />밖으로 이어지는 감각을 키우는 시간이에요.</>,
    imgSrc: eventImg5,
    imgStyle: { height: "138.49%", left: "-1.85%", top: "-24.48%", width: "103.68%" } as React.CSSProperties,
  },
  {
    title: "꾸준히 풀며 실력을 쌓아요.",
    titleHighlight: "잔디심기 챌린지",
    description: <>백준 문제 풀이 마라톤으로 매일 한 칸씩 잔디를 심어요.<br />꾸준함으로 실력을 만드는 시간이에요.</>,
    imgSrc: eventImg4,
    imgStyle: { height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" } as React.CSSProperties,
  },
  {
    title: "배운 걸 무대에서 보여줘요.",
    titleHighlight: "경찰과 도둑",
    description: <>팀으로 준비한 결과물을 대회에서 직접 선보여요.<br />실전의 긴장감 속에서 더 크게 성장해요.</>,
    imgSrc: eventImg5,
    imgStyle: { height: "138.49%", left: "-1.85%", top: "-24.48%", width: "103.68%" } as React.CSSProperties,
  },
  {
    title: "나만의 서비스를 기획해요.",
    titleHighlight: "아이디어톤",
    description: <>팀으로 부딪히며 아이디어를 실제 서비스로 만들어요.<br />포트폴리오에 쓸 수 있는 결과물이 나와요.</>,
    imgSrc: eventImg5,
    imgStyle: { height: "138.49%", left: "-1.85%", top: "-24.48%", width: "103.68%" } as React.CSSProperties,
  },
  {
    title: "작품을 직접 보고 느껴요.",
    titleHighlight: "미디어 아트 전시회",
    description: <>미디어 아트를 함께 보며 시야를 넓혀요.<br />콘텐츠와 경험을 보는 감각도 함께 자라요.</>,
    imgSrc: eventImg6,
    imgStyle: { height: "231.99%", left: "0", top: "-82.61%", width: "100%" } as React.CSSProperties,
  },
  {
    title: "1박 2일로 같이 떠나요.",
    titleHighlight: "MT",
    description: <>학기 중엔 못 나눈 이야기까지,<br />한 번에 가까워지는 시간이에요.</>,
    imgSrc: eventImg6,
    imgStyle: { height: "231.99%", left: "0", top: "-82.61%", width: "100%" } as React.CSSProperties,
  },
] as const;


/* ─── MacBook display frame ─────────────────────────────────────────── */
function MacFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-h-full" style={{ aspectRatio: '195.75 / 115' }}>
       <div className="absolute inset-0 bg-ink rounded-5" />
      <div className="absolute overflow-hidden rounded-3" style={{ top: '3.7%', left: '2.17%', right: '2.17%', bottom: '3.7%' }}>
        {children}
      </div>
    </div>
  );
}

function EventSpotlightCard({
  title,
  titleHighlight,
  description,
  imgSrc,
}: {
  index: number;
  title: string;
  titleHighlight: string;
  description: React.ReactNode;
  imgSrc: string;
  imgStyle: React.CSSProperties;
}) {
  return (
    <div className="flex h-full w-full flex-col items-start gap-5 px-4 md:px-8">
      <div className="flex w-full min-w-0 shrink-0 flex-col items-start gap-3">
        <div className="flex flex-col items-start font-bold tracking-[-1.5px]" style={{ fontSize: "clamp(32px,4vw,50px)" }}>
          <span className="leading-[1.3] text-ink">{title}</span>
          <span className="leading-[1.3] text-brand">{titleHighlight}</span>
        </div>
        <div className="font-medium tracking-tight-xl leading-[1.22] text-black/58" style={{ fontSize: "clamp(16px,1.55vw,22px)" }}>
          {description}
        </div>
      </div>

      <div className="w-full min-h-0 flex-1 max-w-245">
        <MacFrame>
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-center bg-black"
            src={imgSrc}
          />
        </MacFrame>
      </div>
    </div>
  );
}

function EventScrollShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      const nextIndex = Math.min(
        EVENTS.length - 1,
        Math.max(0, Math.round(value * (EVENTS.length - 1))),
      );
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    });
  }, [scrollYProgress]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `calc(${EVENTS.length} * 112vh)` }}
    >
      <div className="sticky top-0 h-screen">

        {/* ── Mobile layout ── */}
        <div className="flex h-full flex-col px-4 pt-28 pb-8 lg:hidden">
          <div className="shrink-0 pb-5">
            <div className="text-[clamp(26px,7vw,36px)] font-bold leading-[1.22] tracking-tight-xl text-ink">
              한 해동안 함께할
              <br />
              활동들이에요.
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-start gap-1.5 pb-5">
            {EVENTS.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full bg-brand"
                animate={{ width: i === activeIndex ? 20 : 6, opacity: i === activeIndex ? 1 : 0.3 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: 6 }}
              />
            ))}
          </div>
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {EVENTS.map((event, index) =>
                index === activeIndex ? (
                  <motion.div
                    key={event.titleHighlight}
                    className="absolute inset-0 flex flex-col gap-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="w-full shrink-0">
                      <MacFrame>
                        <img alt="" className="absolute inset-0 h-full w-full object-cover object-center" src={event.imgSrc} />
                      </MacFrame>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col font-bold tracking-[-1.5px]" style={{ fontSize: "clamp(26px,7vw,36px)" }}>
                        <span className="leading-[1.3] text-ink">{event.title}</span>
                        <span className="leading-[1.3] text-brand">{event.titleHighlight}</span>
                      </div>
                      <div className="font-medium leading-[1.3] tracking-[-0.03em] text-black/58" style={{ fontSize: "clamp(14px,4vw,17px)" }}>
                        {event.description}
                      </div>
                    </div>
                  </motion.div>
                ) : null,
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden h-full items-start pt-28 pb-10 lg:flex">
          <div className="mx-auto grid h-full w-full max-w-310 grid-cols-[220px_minmax(0,1fr)] gap-10 px-10">
            <div className="flex flex-col gap-3 pt-10">
              {EVENTS.map((event, index) => {
                const active = index === activeIndex;
                return (
                  <div key={event.titleHighlight} className="flex items-center gap-3">
                    <div className="relative h-12 w-0.5 overflow-hidden rounded-full bg-black/10">
                      <motion.div
                        className="absolute inset-x-0 bottom-0 rounded-full bg-brand"
                        initial={false}
                        animate={{ height: active ? "100%" : "24%" }}
                        transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-[12px] font-semibold tracking-[0.16em] ${active ? "text-black/55" : "text-black/28"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className={`mt-1 text-[17px] font-semibold tracking-[-0.03em] ${active ? "text-ink" : "text-black/35"}`}>
                        {event.titleHighlight}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative h-full">
              <AnimatePresence mode="popLayout" initial={false}>
                {EVENTS.map((event, index) =>
                  index === activeIndex ? (
                    <motion.div
                      key={event.titleHighlight}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <EventSpotlightCard
                        index={index + 1}
                        title={event.title}
                        titleHighlight={event.titleHighlight}
                        description={event.description}
                        imgSrc={event.imgSrc}
                        imgStyle={event.imgStyle}
                      />
                    </motion.div>
                  ) : null,
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Member card ────────────────────────────────────────────────────── */
const MemberCard = memo(function MemberCard({ role, name, desc, img, style, open, onToggle }: {
  role: string; name: string; desc: string; img: string; style: React.CSSProperties;
  open: boolean; onToggle: () => void;
}) {
  const pointerDownX = useRef(0);

  return (
    <div
      onPointerDown={(e) => { pointerDownX.current = e.clientX; }}
      onClick={(e) => {
        if (Math.abs(e.clientX - pointerDownX.current) > 6) return;
        onToggle();
      }}
      className="relative shrink-0 overflow-hidden rounded-card cursor-pointer select-none w-46.25 sm:w-55 md:w-61.25 aspect-4/5"
      style={{ contain: "layout paint" }}
    >
      {/* Background photo */}
      <img
        alt={name}
        className="absolute max-w-none"
        src={img}
        decoding="async"
        loading="lazy"
        style={style}
      />

      {/* Bottom gradient + default label */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/70 to-transparent" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-3.5"
        animate={{ opacity: open ? 0 : 1, y: open ? -36 : 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[12px] font-semibold tracking-[0.14em] text-white/65 uppercase leading-none">{role}</div>
        <div className="mt-1.5 text-[24px] font-bold tracking-[-0.5px] text-white leading-[1.2]">{name}</div>
      </motion.div>

      {/* Blur layer — exits slowly so photo is revealed gradually */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="blur"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ backdropFilter: "blur(16px)", background: "rgba(12,12,13,0.52)" }}
          />
        )}
      </AnimatePresence>

      {/* Content layer — exits faster so blur lingers after text is gone */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="content"
            className="absolute inset-0 flex flex-col justify-end p-4"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[12px] font-semibold tracking-[0.14em] text-white/55 uppercase">{role}</div>
            <div className="mt-1.5 text-[28px] font-bold tracking-[-0.6px] text-white leading-[1.15]">{name}</div>
            <p className="mt-2.5 text-[15px] leading-[1.65] tracking-[-0.02em] text-white/78">{desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ─── Carousel hooks ─────────────────────────────────────────────────── */
type AnimRef = React.MutableRefObject<ReturnType<typeof animate> | null>;

function useCarouselLoop(
  trackRef: React.RefObject<HTMLDivElement | null>,
  x: MotionValue<number>,
  animRef: AnimRef,
) {
  const isHovering = useRef(false);
  const isCardOpen = useRef(false);

  // loopFnRef is updated every call so closures inside always read latest refs
  const loopFnRef = useRef<() => void>(() => {});
  loopFnRef.current = () => {
    if (isHovering.current || isCardOpen.current) return;
    const half = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    if (!half) return;
    const mod = x.get() % half;
    const curr = mod > 0 ? mod - half : mod;
    x.set(curr);
    animRef.current = animate(x, -half, {
      duration: Math.abs(-half - curr) / 50,
      ease: "linear",
      onComplete: () => { x.set(0); loopFnRef.current(); },
    });
  };

  const pause = useCallback(() => {
    isHovering.current = true;
    animRef.current?.stop();
  }, [animRef]);

  const resume = useCallback(() => {
    isHovering.current = false;
    loopFnRef.current();
  }, []);

  const notifyCardOpen = useCallback((open: boolean) => {
    isCardOpen.current = open;
    animRef.current?.stop();
    if (!open && !isHovering.current) loopFnRef.current();
  }, [animRef]);

  useEffect(() => {
    const id = setTimeout(() => loopFnRef.current(), 200);
    return () => { clearTimeout(id); animRef.current?.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { pause, resume, notifyCardOpen };
}

function useCarouselWheel(
  outerRef: React.RefObject<HTMLDivElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
  x: MotionValue<number>,
  animRef: AnimRef,
  onIdle: () => void,
) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      const isHorizontalIntent =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) || (e.shiftKey && e.deltaY !== 0);
      if (!isHorizontalIntent) return;
      e.preventDefault();
      const half = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
      if (!half) return;
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const mod = (x.get() - delta) % half;
      x.set(mod > 0 ? mod - half : mod);
      animRef.current?.stop();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => onIdleRef.current(), 1500);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ─── Members carousel ───────────────────────────────────────────────── */
const DOUBLED_MEMBERS = [...MEMBERS, ...MEMBERS] as const;
const DOUBLED_KEYS = DOUBLED_MEMBERS.map((m, i) => `${i}-${m.name}`);

function MembersCarousel() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const { pause, resume, notifyCardOpen } = useCarouselLoop(trackRef, x, animRef);
  useCarouselWheel(outerRef, trackRef, x, animRef, resume);

  useEffect(() => { notifyCardOpen(openKey !== null); }, [openKey, notifyCardOpen]);

  // Stable toggler per slot — ensures MemberCard memo is effective
  const togglers = useMemo(
    () => DOUBLED_KEYS.map((key) => () => setOpenKey(prev => prev === key ? null : key)),
    [],
  );

  return (
    <div
      ref={outerRef}
      className="w-full overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={() => { setOpenKey(null); resume(); }}
    >
      <motion.div
        ref={trackRef}
        style={{ x, width: "max-content" }}
        className="flex gap-3 sm:gap-4"
      >
        {DOUBLED_MEMBERS.map((member, i) => (
          <MemberCard
            key={DOUBLED_KEYS[i]}
            {...member}
            open={openKey === DOUBLED_KEYS[i]}
            onToggle={togglers[i]!}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export function Homepage({ onHeaderConfig, onHeroReady }: PageProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [bgLoaded, setBgLoaded]           = useState(false);
  const [pastEventScroll, setPastEventScroll] = useState(false);
  const eventEndRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();

  const heroBgRef    = useRef<HTMLImageElement>(null);
  const marqueeBgRef = useRef<HTMLImageElement>(null);
  useParallaxEffect([
    { ref: marqueeBgRef, fn: (y) => `translateY(${(y - 2000) * -0.045}px)` },
  ]);
  useCursorFollower();
  useScrollProgress();
  useSectionBackground();

  useEffect(() => {
    const ids = ["home", "about", "history", "history-bridge", "event", "people"];
    const sections = ids
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter((section): section is { id: string; el: HTMLElement } => section !== null);

    let ticking = false;

    const updateActiveSection = () => {
      const viewportPivot = window.innerHeight * 0.38;

      if (eventEndRef.current) {
        const r = eventEndRef.current.getBoundingClientRect();
        setPastEventScroll(r.top <= viewportPivot);
      }

      const containingSection = sections.find(({ el }) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= viewportPivot && rect.bottom >= viewportPivot;
      });

      if (containingSection) {
        setActiveSection((prev) => (prev === containingSection.id ? prev : containingSection.id));
        ticking = false;
        return;
      }

      let nearestId = sections[0]?.id ?? "home";
      let nearestDistance = Number.POSITIVE_INFINITY;

      sections.forEach(({ id, el }) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.min(
          Math.abs(rect.top - viewportPivot),
          Math.abs(rect.bottom - viewportPivot),
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestId = id;
        }
      });

      setActiveSection((prev) => (prev === nearestId ? prev : nearestId));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => onHeroReady(), 80);
    return () => clearTimeout(t);
  }, [onHeroReady]);

  useEffect(() => {
    const headerSection = activeSection === "event" && pastEventScroll ? "event-post" : activeSection;
    onHeaderConfig({ activeSection: headerSection, darkHero: true });
  }, [activeSection, pastEventScroll, onHeaderConfig]);

  return (
    <>
      <style>{`
        @keyframes marquee-left  { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
        @keyframes marquee-right { from{transform:translateX(-50%)} to{transform:translateX(0)}    }
        @keyframes float         { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-14px)} }
        @keyframes pulse-glow    { 0%,100%{opacity:.7;transform:scale(1)}  50%{opacity:1;transform:scale(1.08)} }
        @keyframes scroll-bounce { 0%,100%{transform:translateY(0)}  50%{transform:translateY(8px)} }
      `}</style>

      <div className="flex flex-col items-start w-full bg-snow">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <div
          id="home"
          className="relative h-svh w-full shrink-0 overflow-hidden bg-ink"
        >
          {/* 배경 레이어 — overflow-hidden 없이 mask가 직접 이미지를 fade */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={bgLoaded ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img
              ref={heroBgRef}
              alt=""
              src={imgRectangle}
              className="absolute inset-0 w-full h-full object-cover object-center"
              onLoad={() => setBgLoaded(true)}
            />

            {glowColors.slice(0, 6).map((color, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-[80px] opacity-40"
                style={{
                  backgroundColor: color,
                  width: "320px",
                  height: "320px",
                  left: `${15 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 35}%`,
                  animation: `pulse-glow ${3 + (i % 3) * 0.6}s ease-in-out ${-(i * 0.5)}s infinite`,
                }}
              />
            ))}

            {/* 하단 fade — About 배경색(#0c0c0d)으로 자연스럽게 연결 */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "50%",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(12,12,13,0.6) 60%, #0c0c0d 100%)",
              }}
            />
          </motion.div>

          {/* Hero tagline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
            {["배우고 도전하며", "가치를 만드는 사람으로"].map(
              (line, i) => (
                <motion.div
                  key={i}
                  className="font-bold text-snow text-center leading-[1.2] pointer-events-none"
                  style={{
                    fontSize: "clamp(36px, 6vw, 88px)",
                    letterSpacing: "-0.03em",
                  }}
                  initial={
                    reducedMotion ? { opacity: 1 } : { opacity: 0, y: 36 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3 + i * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.div>
              ),
            )}
            <motion.button
              onClick={() => scrollTo("apply")}
              className="mt-4 px-8 py-3.5 rounded-full font-semibold text-[18px] tracking-[-0.54px] leading-none cursor-pointer whitespace-nowrap"
              style={{
                color: "#fafafa",
                border: "1px solid rgba(255,255,255,0.4)",
                backdropFilter: "blur(8px)",
              }}
              initial={
                reducedMotion
                  ? { opacity: 1, background: "rgba(255,255,255,0.15)" }
                  : { opacity: 0, background: "rgba(255,255,255,0.15)" }
              }
              animate={{ opacity: 1, background: "rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.35, delay: 0.9, ease: "easeOut" }}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      y: -4,
                      scale: 1.04,
                      background: "rgba(255,255,255,0.34)",
                    }
              }
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              지원하러 가기 →
            </motion.button>
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ animation: "scroll-bounce 1.8s ease-in-out 2s infinite" }}
          >
            <span className="font-medium text-snow text-[13px] tracking-[-0.42px] opacity-40">
              scroll
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 10l6 6 6-6"
                stroke="#fafafa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────── */}
        <section
          id="about"
          className="flex flex-col gap-25 items-center pt-40 pb-30 w-full bg-ink -mt-px"
        >
          <FadeUp
            threshold={0.12}
            className="flex flex-col items-center font-bold tracking-[-1.5px] text-center px-4"
          >
            <span
              className="leading-[1.3] text-snow"
              style={{ fontSize: SECTION_HEADING_SIZE }}
            >
              기획, 개발, 디자인을 함께 익히고
            </span>
            <span
              className="leading-[1.3] text-snow"
              style={{ fontSize: SECTION_HEADING_SIZE }}
            >
              배운 걸 실제 결과로 이어가요
            </span>
            <span
              className="mt-5 max-w-190 text-center font-medium leading-normal tracking-[-0.03em] text-white/62"
              style={{ fontSize: "clamp(16px,2vw,24px)" }}
            >
              스터디와 멘토링으로 배우고, 아이디어톤과 해커톤으로 직접
              부딪혀봐요
            </span>
          </FadeUp>

          <div className="mx-auto flex w-full max-w-290 flex-col items-center gap-10 px-4 md:px-10 lg:flex-row lg:justify-center lg:gap-12">
            {/* Photos — 데스크탑에서만 표시 */}
            <SlideIn
              from="left"
              className="hidden lg:block relative w-85 shrink-0 aspect-124/244.75"
            >
              <div
                className="absolute overflow-hidden border border-white/20"
                style={{
                  left: "0%",
                  top: "0%",
                  width: "80.65%",
                  height: "61.29%",
                }}
              >
                <img
                  alt=""
                  className="absolute max-w-none"
                  src={imgFrame1}
                  style={{
                    height: "112.33%",
                    left: "-58.15%",
                    top: "-6.24%",
                    width: "252.85%",
                  }}
                />
              </div>
              <div
                className="absolute overflow-hidden border border-white/20"
                style={{
                  left: "19.35%",
                  top: "38.71%",
                  width: "80.65%",
                  height: "61.29%",
                }}
              >
                <img
                  alt=""
                  className="absolute max-w-none"
                  src={imgFrame2}
                  style={{
                    height: "124.5%",
                    left: "-108.26%",
                    top: "-0.04%",
                    width: "279.91%",
                  }}
                />
              </div>
            </SlideIn>

            {/* 텍스트 — 모바일에서 전면에 */}
            <SlideIn
              from="right"
              delay={150}
              className="flex min-w-0 w-full max-w-130 flex-col items-center justify-center gap-8 lg:items-start lg:text-left"
            >
              {/* 로고 — 데스크탑에서만 */}
              <div className="hidden lg:flex flex-col gap-4 items-start shrink-0">
                <div
                  className="relative h-73.25 w-75"
                  style={{ animation: "float 5s ease-in-out 1s infinite" }}
                >
                  <GameworksLogo
                    aria-label="GAMEWORKS 로고"
                    className="absolute block size-full text-snow"
                  />
                </div>
                <span
                  className="font-bold text-snow tracking-[-3.2px] leading-[1.1] whitespace-nowrap"
                  style={{ fontSize: "clamp(40px,6vw,80px)" }}
                >
                  GAMEWORKS
                </span>
              </div>
              <div className="hidden lg:block h-px w-20 bg-white/20" />

              {/* 본문 — 모바일 핵심 콘텐츠 */}
            </SlideIn>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <StatsSection />

        {/* ── History ───────────────────────────────────────────── */}
        <section
          id="history"
          className="flex flex-col items-center w-full"
          style={{
            background:
              "linear-gradient(to bottom, #0c0c0d 0%, #0e1628 30%, #00204d 55%)",
          }}
        >
          <div className="w-full px-6 pt-16 text-center md:px-16 lg:px-40">
            <div className="font-bold leading-[1.22] tracking-[-0.04em] text-snow" style={{ fontSize: SECTION_HEADING_SIZE }}>
              지금의 게임웍스는
              <br />
              25년의 시간 위에 있어요
            </div>
          </div>
          <div className="w-full px-6 py-20 md:px-16 lg:px-40">
            <TimelineSection items={TIMELINE} />
          </div>
        </section>

        {/* ── History Bridge ────────────────────────────────────── */}
        <section
          id="history-bridge"
          className="relative isolate w-full overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              ref={marqueeBgRef}
              alt=""
              className="absolute inset-x-0 -top-[18%] h-[136%] w-full max-w-none object-cover object-center"
              src={imgDesktop26}
              style={{ willChange: "transform" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,10,26,0.82)_0%,rgba(5,20,48,0.72)_30%,rgba(12,44,92,0.46)_58%,rgba(178,211,255,0.54)_78%,rgba(199,224,255,0.94)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle_at_78%_28%,rgba(26,122,255,0.22),transparent_30%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(199,224,255,0)_0%,rgba(199,224,255,0.82)_68%,#c7e0ff_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-130 w-full max-w-330 flex-col justify-center px-6 py-20 md:px-10 lg:min-h-[620px] lg:px-16">
            <div className="max-w-230">
              <h2 className="text-[clamp(34px,5.2vw,76px)] font-bold leading-[1.06] tracking-[-0.05em] text-white">
                그 흐름을 이어받아
                <br />
                지금의 우리가 움직이고 있어요
              </h2>
              <p className="mt-5 max-w-195 text-[clamp(18px,2.1vw,28px)] font-medium leading-[1.55] tracking-[-0.03em] text-white/76">
                선배들이 만든 친목과 성장의 흐름을, 지금의 우리가 올해의 방식으로 다시 이어가고 있어요.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-3 md:gap-4">
              {["친해지고", "배우고", "직접 만들고"].map((label, index) => (
                <React.Fragment key={label}>
                  <div className="rounded-full border border-white/14 bg-white/[0.08] px-5 py-3 text-[clamp(18px,2vw,28px)] font-bold tracking-[-0.03em] text-white backdrop-blur-md">
                    {label}
                  </div>
                  {index < 2 && (
                    <div className="hidden h-px w-10 bg-white/25 md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── Event ─────────────────────────────────────────────── */}
        <section id="event" className="flex flex-col items-center w-full">
          <div
            className="flex flex-col gap-16 items-center px-10 py-12 md:py-20 w-full"
            style={{
              background:
                "linear-gradient(to bottom,#c7e0ff 0%,#c7e0ff 74%,#fafafa 100%)",
            }}
          >
            <div className="hidden w-full max-w-290 flex-col gap-6 px-4 md:px-8 lg:flex">
              <div className="max-w-230 font-bold leading-[1.22] tracking-[-0.04em] text-ink" style={{ fontSize: SECTION_HEADING_SIZE }}>
                한 해동안 함께할
                <br />
                활동들이에요.
              </div>
            </div>

            <EventScrollShowcase />
            <div ref={eventEndRef} />

            <button
              onClick={navigateActivity}
              className="border-b border-[#0c0c0d] flex items-center p-2 bg-transparent cursor-pointer group"
            >
              <span className="font-medium text-ink text-[20px] leading-none transition-opacity duration-300 group-hover:opacity-50">
                활동 더 보기 →
              </span>
            </button>
          </div>
        </section>

        {/* ── People ────────────────────────────────────────────── */}
        {/* <section id="people" className="flex flex-col items-center w-full">
          <SectionTitle text="PEOPLE" />

          <div className="flex flex-col gap-10 items-center pb-12 md:pb-20 w-full">
            <FadeUp
              threshold={0.2}
              className="flex flex-col items-center text-ink text-center px-10"
            >
              <span
                className="font-bold tracking-[-1.14px] leading-[1.3]"
                style={{ fontSize: "clamp(22px,3vw,38px)" }}
              >
                올해 게임웍스를 이끄는 팀이에요
              </span>
            </FadeUp>

            <MembersCarousel />

            <button
              className="border-b border-[#0c0c0d] flex items-center p-2 bg-transparent cursor-pointer group"
              onClick={navigateMembers}
            >
              <span className="font-medium text-ink text-[20px] leading-none group-hover:opacity-50 transition-opacity duration-200">
                이전 임원진도 보기 →
              </span>
            </button>
          </div>
        </section> */}

        <CTASection />

        {/* ── Footer ────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}
