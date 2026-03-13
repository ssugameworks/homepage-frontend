import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { GameworksLogo } from "@/pages/homepage/components";
import type { PageProps } from "@/lib/header-config";
import { TimelineSection } from "@/pages/homepage/components/TimelineSection";
import { EASE, FadeUp, SectionTitle, SlideIn } from "@/pages/homepage/components/motion";
import { TIMELINE } from "@/pages/homepage/content/homepage";
import {
  prefersReducedMotion,
  scrollTo,
  useCursorFollower,
  useInView,
  useInViewOnce,
  useParallaxEffect,
  useScrollProgress,
  useSectionBackground,
} from "@/pages/homepage/hooks/useHomepageEffects";
import { CTASection } from "@/pages/homepage/sections/CTASection";
import { StatsSection } from "@/pages/homepage/sections/StatsSection";
import { Footer } from "@/components/Footer";
import { navigateActivity, navigateMembers } from "@/lib/navigation";

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
const imgVector    = "https://www.figma.com/api/mcp/asset/45dfd35e-c297-4d61-ade7-f9638d7c3a99";
const imgFrame     = "https://www.figma.com/api/mcp/asset/23405a3e-0c8d-4d7e-8407-204e16b3f18e";
const imgVector2   = "https://www.figma.com/api/mcp/asset/37dd5450-d8ed-4876-8bba-798ffa39318d";
const imgFrame14   = "https://www.figma.com/api/mcp/asset/bbcfd9b9-ad14-4adb-9f2a-3a7f383b5089";
const imgVector5   = "https://www.figma.com/api/mcp/asset/e40cc6a4-0c2b-4b0c-a6f0-bb5beeab8d3a";

const glowColors = [
  "#3B82F6","#6366F1","#8B5CF6","#A78BFA",
  "#60A5FA","#818CF8","#7C3AED","#4F46E5",
  "#2563EB","#7C3AED","#6D28D9","#4338CA",
  "#3B82F6","#60A5FA","#818CF8","#8B5CF6",
];

const MEMBERS = [
  { role: "회장", name: "장윤아", desc: "기획과 디자인을 중심으로 팀의 방향과 흐름을 잡습니다.", img: imgFrame7, delay: 0, style: { height: "112.66%", left: "-3.52%", top: "-3.54%", width: "106.8%" } },
  { role: "회장", name: "조영찬", desc: "프론트엔드 구현과 개발 운영으로 팀의 속도를 만듭니다.", img: imgFrame8, delay: 80, style: { height: "115.78%", left: "-4.82%", top: "-5.19%", width: "109.76%" } },
  { role: "총무", name: "박서영", desc: "일정과 운영을 꼼꼼하게 챙기며 팀 전체의 기반을 다집니다.", img: imgFrame9, delay: 160, style: { height: "121.45%", left: "-10.96%", top: "-7.3%", width: "115.94%" } },
  { role: "부회장", name: "유다은", desc: "UX와 디자인으로 결과물을 더 선명하게 만듭니다.", img: imgFrame10, delay: 0, style: { height: "111.61%", left: "-3.17%", top: "-5.98%", width: "105.81%" } },
  { role: "부회장", name: "최서정", desc: "백엔드와 구조 설계로 팀의 안정적인 기반을 만듭니다.", img: imgFrame11, delay: 80, style: { height: "111.78%", left: "-3.15%", top: "-5.74%", width: "105.97%" } },
  { role: "부회장", name: "최지원", desc: "홍보와 콘텐츠 기획으로 팀의 에너지를 바깥으로 확장합니다.", img: imgFrame12, delay: 160, style: { height: "110.35%", left: "-2.37%", top: "-5.22%", width: "104.61%" } },
  { role: "부회장", name: "홍준우", desc: "프론트엔드 실전 경험으로 팀의 구현 수준을 끌어올립니다.", img: imgFrame13, delay: 240, style: { height: "102.78%", left: "-12.76%", top: "-2.86%", width: "124.99%" } },
] as const;


/* ─── MacBook display frame ─────────────────────────────────────────── */
function MacFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '195.75 / 115' }}>
       <div className="absolute inset-0 bg-ink rounded-5" />
      <div className="absolute overflow-hidden rounded-3" style={{ top: '3.7%', left: '2.17%', right: '2.17%', bottom: '3.7%' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Event card ─────────────────────────────────────────────────────── */
function EventCard({
  reverse, title, titleHighlight, description, imgSrc, imgStyle,
}: {
  reverse?: boolean;
  title: string;
  titleHighlight: string;
  description: React.ReactNode;
  imgSrc: string;
  imgStyle: React.CSSProperties;
  tags?: string[];
}) {
  const { ref, visible } = useInView(0.04);
  const dx = reverse ? 60 : -60;

  const containerRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => {
      if (!containerRef.current || !imgInnerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      imgInnerRef.current.style.transform = `translateY(${progress * -20}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const text = (
    <div className="flex w-full xl:flex-[1_0_0] flex-col gap-6 items-start min-w-0">
<div className="flex flex-col items-start font-bold tracking-[-1.5px]" style={{ fontSize: "clamp(32px,4vw,50px)" }}>
        <span className="leading-[1.3] text-ink">{title}</span>
        <span className="leading-[1.3] text-brand">{titleHighlight}</span>
      </div>
      <div className="font-medium text-dim tracking-[-0.84px] leading-[1.3]" style={{ fontSize: "clamp(18px,2.5vw,28px)" }}>{description}</div>
    </div>
  );
  const frame = (
    <div ref={containerRef} className="w-full xl:w-[55%] xl:shrink-0">
      <MacFrame>
        <img ref={imgInnerRef} alt="" className="absolute max-w-none" src={imgSrc} style={imgStyle} />
      </MacFrame>
    </div>
  );
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col ${reverse ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-10 xl:gap-20 items-center px-4 md:px-8 w-full`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${dx}px)`,
        transition: `opacity 0.8s ease, transform 0.8s ${EASE}`,
        willChange: "transform",
      }}>
      {<>{frame}{text}</>}
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
      className="relative shrink-0 overflow-hidden rounded-[22px] cursor-pointer select-none w-[185px] sm:w-[220px] md:w-[245px] aspect-[4/5]"
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />
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
  const reducedMotion = !!useReducedMotion();

  const heroBgRef    = useRef<HTMLImageElement>(null);
  const marqueeBgRef = useRef<HTMLImageElement>(null);
  useParallaxEffect([
    { ref: marqueeBgRef, fn: (y) => `translateY(${(y - 2000) * -0.08}px)` },
  ]);
  useCursorFollower();
  useScrollProgress();
  useSectionBackground();

  useEffect(() => {
    const ids = ["home", "about", "history", "people", "event"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e?.isIntersecting) setActiveSection(id); },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => onHeroReady(), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    onHeaderConfig({ activeSection, darkHero: true });
  }, [activeSection]);

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
        <div id="home" className="relative h-screen min-h-225 w-full shrink-0 overflow-hidden bg-ink">
          {/* 배경 레이어 — overflow-hidden 없이 mask가 직접 이미지를 fade */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={bgLoaded ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img ref={heroBgRef} alt="" src={imgRectangle}
              className="absolute inset-0 w-full h-full object-cover object-center"
              onLoad={() => setBgLoaded(true)} />

            {glowColors.slice(0, 6).map((color, i) => (
              <div key={i} className="absolute rounded-full blur-[80px] opacity-40"
                style={{
                  backgroundColor: color,
                  width: "320px", height: "320px",
                  left: `${15 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 35}%`,
                  animation: `pulse-glow ${3 + (i % 3) * 0.6}s ease-in-out ${-(i * 0.5)}s infinite`,
                }} />
            ))}

            {/* 하단 fade — About 배경색(#0c0c0d)으로 자연스럽게 연결 */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{
              height: "50%",
              background: "linear-gradient(to bottom, transparent 0%, rgba(12,12,13,0.6) 60%, #0c0c0d 100%)",
            }} />
          </motion.div>

          {/* Hero tagline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none pb-20">
            {["전공을 넘어서는 경험이,", "여기서 시작됩니다"].map((line, i) => (
              <motion.div
                key={i}
                className="font-bold text-snow text-center leading-[1.2] pointer-events-none"
                style={{ fontSize: "clamp(36px, 6vw, 88px)", letterSpacing: "-0.03em" }}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.div>
            ))}
            <motion.button
              onClick={() => scrollTo("apply")}
              className="mt-8 px-8 py-3.5 rounded-full font-semibold text-[18px] tracking-[-0.54px] leading-none cursor-pointer whitespace-nowrap"
              style={{ color: "#fafafa", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}
              initial={reducedMotion ? { opacity: 1, background: "rgba(255,255,255,0.15)" } : { opacity: 0, background: "rgba(255,255,255,0.15)" }}
              animate={{ opacity: 1, background: "rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.35, delay: 0.9, ease: "easeOut" }}
              whileHover={reducedMotion ? undefined : {
                y: -4,
                scale: 1.04,
                background: "rgba(255,255,255,0.34)",
              }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              지원하러 가기 →
            </motion.button>
          </div>


          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ animation: "scroll-bounce 1.8s ease-in-out 2s infinite" }}>
            <span className="font-medium text-snow text-[13px] tracking-[-0.42px] opacity-40">scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10l6 6 6-6" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────── */}
        <section id="about" className="flex flex-col gap-25 items-center pt-0 pb-30 w-full bg-ink -mt-px">
          <FadeUp threshold={0.3} className="flex flex-col items-center font-bold tracking-[-1.5px] text-center px-4">
            <span className="leading-[1.3] text-snow" style={{ fontSize: "clamp(28px,4vw,50px)" }}>기획, 개발, 디자인 —</span>
            <span className="leading-[1.3] text-snow" style={{ fontSize: "clamp(28px,4vw,50px)" }}>분야를 넘어 함께 성장하는 소모임</span>
          </FadeUp>

          <div className="mx-auto flex w-full max-w-290 flex-col items-center gap-10 px-4 md:px-10 lg:flex-row lg:justify-center lg:gap-12">
            {/* Photos — 데스크탑에서만 표시 */}
            <SlideIn from="left" className="hidden lg:block relative w-85 shrink-0 aspect-[124/244.75]">
              <div className="absolute overflow-hidden border border-white/20"
                style={{ left: "0%", top: "0%", width: "80.65%", height: "61.29%" }}>
                <img alt="" className="absolute max-w-none" src={imgFrame1}
                  style={{ height: "112.33%", left: "-58.15%", top: "-6.24%", width: "252.85%" }} />
              </div>
              <div className="absolute overflow-hidden border border-white/20"
                style={{ left: "19.35%", top: "38.71%", width: "80.65%", height: "61.29%" }}>
                <img alt="" className="absolute max-w-none" src={imgFrame2}
                  style={{ height: "124.5%", left: "-108.26%", top: "-0.04%", width: "279.91%" }} />
              </div>
            </SlideIn>

            {/* 텍스트 — 모바일에서 전면에 */}
            <SlideIn from="right" delay={150} className="flex min-w-0 w-full max-w-130 flex-col items-center justify-center gap-8 lg:items-start lg:text-left">
              {/* 로고 — 데스크탑에서만 */}
              <div className="hidden lg:flex flex-col gap-4 items-start shrink-0">
                <div className="relative h-73.25 w-75"
                  style={{ animation: "float 5s ease-in-out 1s infinite" }}>
                  <GameworksLogo
                    aria-label="GAMEWORKS 로고"
                    className="absolute block size-full text-snow"
                  />
                </div>
                <span className="font-bold text-snow tracking-[-3.2px] leading-[1.1] whitespace-nowrap" style={{ fontSize: "clamp(40px,6vw,80px)" }}>
                  GAMEWORKS
                </span>
              </div>
              <div className="hidden lg:block h-px w-20 bg-white/20" />

              {/* 본문 — 모바일 핵심 콘텐츠 */}
              <p className="font-bold text-snow leading-[1.4] text-center lg:text-left"
                style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-0.03em" }}>
                게임웍스는 2000년대 초<br />
                글로벌미디어학부의 시작을<br />
                함께한 학술 소모임입니다.
              </p>
            </SlideIn>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <StatsSection />

        {/* ── History ───────────────────────────────────────────── */}
        <section id="history" className="flex flex-col items-center w-full"
          style={{ background: "linear-gradient(to bottom, #0c0c0d 0%, #0e1628 30%, #00204d 55%)" }}>
          <SectionTitle text="HISTORY" color="#fafafa" once />
          <div className="w-full px-6 py-20 md:px-16 lg:px-40">
            <TimelineSection items={TIMELINE} />
          </div>
        </section>

        {/* ── Marquee / Desktop-26 ──────────────────────────────── */}
        <div className="overflow-hidden relative shrink-0 w-full h-75 md:h-100 lg:h-120" style={{ contain: "paint" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img ref={marqueeBgRef} alt="" className="absolute block max-w-none size-full object-cover" src={imgDesktop26}
              style={{ willChange: "transform" }} />
          </div>

          <div className="absolute top-8 w-full overflow-hidden" aria-hidden="true">
            <div className="flex whitespace-nowrap font-semibold text-[#ececec] text-[240px] leading-none"
              style={{ animation: "marquee-left 20s linear infinite" }}>
              {Array(4).fill("GAMEWORKS\u00A0\u00A0\u00A0").map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </div>

          <div className="absolute bottom-8 w-full overflow-hidden" aria-hidden="true">
            <div className="flex whitespace-nowrap font-semibold text-[#ececec] text-[240px] leading-none"
              style={{ animation: "marquee-right 20s linear infinite" }}>
              {Array(4).fill("GAMEWORKS\u00A0\u00A0\u00A0").map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="h-30 w-31 md:h-45 md:w-46.5 lg:h-60 lg:w-62 relative shrink-0"
              style={{ animation: "float 6s ease-in-out infinite" }}>
              <img alt="GAMEWORKS" className="absolute block max-w-none size-full" src={imgVector2} />
            </div>
            <span className="font-medium text-[16px] tracking-[0.2em] text-white/70 uppercase whitespace-nowrap">
              25 Years of Passion &amp; Growth
            </span>
          </div>
        </div>

        {/* ── Event ─────────────────────────────────────────────── */}
        <section id="event" className="flex flex-col items-center w-full">
          <div className="w-full" style={{ background: "linear-gradient(to bottom,#fafafa,#b2d3ff)" }}>
            <SectionTitle text="EVENT" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24 items-center px-10 py-12 md:py-20 w-full"
            style={{ background: "linear-gradient(to bottom,#b2d3ff 0%,#b2d3ff 76%,#fafafa 100%)" }}>
            <EventCard title="벚꽃과 함께" titleHighlight="봄나들이"
              description={<>봄에 같이 나갑니다.<br />가볍게 친해지기 좋은 시간이에요.</>}
              imgSrc={eventImg1} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }}
              tags={["OUTING", "SOCIAL"]} />
            <EventCard reverse title="가르치고 배우는" titleHighlight="멘토링"
              description={<>서로 아는 걸 나눕니다.<br />실무 감각도 같이 익힐 수 있어요.</>}
              imgSrc={eventImg2} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }}
              tags={["MENTORING", "GROWTH"]} />
            <EventCard title="서로 친해지는" titleHighlight="짝선짝후"
              description={<>미션을 같이 풀면서<br />어색함 없이 가까워집니다.</>}
              imgSrc={eventImg3} imgStyle={{ height: "139.2%", left: "-1.69%", top: "-10.62%", width: "103.47%" }}
              tags={["NETWORKING", "SOCIAL"]} />
            <EventCard reverse title="멋진 선배님과의" titleHighlight="커피챗"
              description="커피 한 잔 하면서 경험을 듣고, 궁금한 걸 바로 물어볼 수 있어요."
              imgSrc={eventImg4} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }}
              tags={["COFFEE CHAT", "NETWORKING"]} />
            <EventCard title="대회를 경험해보는" titleHighlight="아이디어톤"
              description={<>팀으로 부딪혀 보면서<br />아이디어가 결과가 되는 과정을 배웁니다.</>}
              imgSrc={eventImg5} imgStyle={{ height: "138.49%", left: "-1.85%", top: "-24.48%", width: "103.68%" }}
              tags={["IDEATHON", "ACADEMIC"]} />
            <EventCard reverse title="다가온 여름에 함께" titleHighlight="MT"
              description={<>학기 중엔 못 나눈 얘기까지,<br />한 번에 가까워지는 시간이에요.</>}
              imgSrc={eventImg6} imgStyle={{ height: "231.99%", left: "0", top: "-82.61%", width: "100%" }}
              tags={["MT", "SUMMER"]} />

            <button onClick={navigateActivity} className="border-b border-[#0c0c0d] flex items-center p-2 bg-transparent cursor-pointer group">
              <span className="font-medium text-ink text-[20px] leading-none transition-opacity duration-300 group-hover:opacity-50">
                활동 더 보기 →
              </span>
            </button>
          </div>
        </section>

        {/* ── People ────────────────────────────────────────────── */}
        <section id="people" className="flex flex-col items-center w-full">
          <SectionTitle text="PEOPLE" />

          <div className="flex flex-col gap-10 items-center pb-12 md:pb-20 w-full">
            <FadeUp threshold={0.2} className="flex flex-col items-center text-ink text-center px-10">
              <span className="font-medium tracking-[-2.4px] leading-[1.3]" style={{ fontSize: "clamp(36px,6vw,80px)" }}>2026 GAMEWORKS</span>
              <span className="font-bold tracking-[-1.14px] leading-[1.3]" style={{ fontSize: "clamp(22px,3vw,38px)" }}>임원진을 소개합니다</span>
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
        </section>

        <CTASection />

        {/* ── Footer ────────────────────────────────────────────── */}
        <Footer />

      </div>
    </>
  );
}
