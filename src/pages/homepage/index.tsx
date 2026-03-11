import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GameworksLogo, Header } from "@/pages/homepage/components";

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
const imgVector1   = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
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

/* ─── Hooks ───────────────────────────────────────────────────────────── */

/** 사용자의 움직임 감소 설정 여부 (모듈 수준 상수 — SSR 없으므로 안전) */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  // 움직임 감소 설정 시 처음부터 visible로 시작
  const [visible, setVisible] = useState(prefersReducedMotion);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/**
 * Parallax 효과를 state 없이 DOM에 직접 적용.
 * Desktop 컴포넌트를 리렌더링하지 않으므로 헤더 흔들림 없음.
 */
function useParallaxEffect(
  targets: Array<{ ref: React.RefObject<HTMLElement | null>; fn: (y: number) => string }>
) {
  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf = 0;
    let current = 0;
    const tick = () => {
      current += (window.scrollY - current) * 0.08;
      for (const { ref, fn } of targets) {
        if (ref.current) ref.current.style.transform = fn(current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/** 마우스를 따라다니는 블루 글로우 커서 팔로워 */
function useCursorFollower() {
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'rgba(26, 122, 255, 0.45)',
      filter: 'blur(18px)',
      pointerEvents: 'none',
      zIndex: '9999',
      willChange: 'transform',
      mixBlendMode: 'multiply',
      opacity: '0.45',
    });
    document.body.appendChild(el);

    let cx = -100, cy = -100;
    let tx = -100, ty = -100;
    let raf = 0;
    let isHoveringInteractive = false;
    let currentScale = 1;
    let targetScale = 1;
    let currentOpacity = 0.45;
    let targetOpacity = 0.45;
    let activeNav: HTMLElement | null = null;
    let navRestoreOverflow = "";

    const setFollowerHost = (nextNav: HTMLElement | null) => {
      if (activeNav === nextNav) return;

      if (activeNav) {
        activeNav.style.overflow = navRestoreOverflow;
      }

      activeNav = nextNav;

      if (activeNav) {
        navRestoreOverflow = activeNav.style.overflow;
        activeNav.style.overflow = "hidden";
        if (el.parentElement !== activeNav) activeNav.appendChild(el);
        el.style.position = "absolute";
      } else {
        if (el.parentElement !== document.body) document.body.appendChild(el);
        el.style.position = "fixed";
      }
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element;
      isHoveringInteractive = !!target.closest('button, a, [role="button"]');
      const nextNav = target.closest('nav') as HTMLElement | null;
      setFollowerHost(nextNav);

      if (nextNav) {
        const rect = nextNav.getBoundingClientRect();
        tx = e.clientX - rect.left;
        ty = e.clientY - rect.top;
      } else {
        tx = e.clientX;
        ty = e.clientY;
      }

      targetScale = isHoveringInteractive ? 1.9 : 1;
      targetOpacity = isHoveringInteractive ? 0.56 : 0.45;
    };

    const tick = () => {
      cx += (tx - cx) * 0.32;
      cy += (ty - cy) * 0.32;
      currentScale += (targetScale - currentScale) * 0.14;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;
      el.style.transform = `translate(${cx - 28}px, ${cy - 28}px) scale(${currentScale})`;
      el.style.opacity = String(currentOpacity);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      if (activeNav) activeNav.style.overflow = navRestoreOverflow;
      el.remove();
    };
  }, []);
}

/** 스크롤 진행률을 나타내는 상단 고정 바 */
function useScrollProgress() {
  useEffect(() => {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '2px',
      width: '0%',
      background: '#1a7aff',
      zIndex: '99999',
      pointerEvents: 'none',
      transformOrigin: 'left',
    });
    document.body.appendChild(bar);

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      bar.remove();
    };
  }, []);
}

/** 섹션별로 body 배경색을 부드럽게 전환 */
function useSectionBackground() {
  useEffect(() => {
    const map: Record<string, string> = {
      'home':   '#fafafa',
      'about':  '#fafafa',
      'event':  '#b2d3ff',
      'people': '#fafafa',
    };

    const sections: Element[] = [];
    for (const id of Object.keys(map)) {
      const el = document.getElementById(id);
      if (el) sections.push(el);
    }

    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const color = map[id] ?? '#fafafa';
          document.body.style.backgroundColor = color;
        }
      }
    }, { threshold: 0.3 });

    sections.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Primitives ──────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.16,1,0.3,1)";

const viewportOnce = { once: true, amount: 0.2 };

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.24,
    },
  },
};

function getFadeUpVariants(distance: number, delay = 0, reducedMotion = false): Variants {
  return {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay + 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
}

function getSlideInVariants(
  from: "left" | "right",
  delay = 0,
  reducedMotion = false,
): Variants {
  const dx = from === "left" ? -60 : 60;
  return {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, x: dx },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        delay: delay + 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
}

function FadeUp({
  children, delay = 0, distance = 32, threshold = 0.08, className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  threshold?: number;
  className?: string;
}) {
  const reducedMotion = !!useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={getFadeUpVariants(distance, delay / 1000, reducedMotion)}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

function SlideIn({
  children, from = "left", delay = 0, threshold = 0.06, className = "",
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const reducedMotion = !!useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={getSlideInVariants(from, delay / 1000, reducedMotion)}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section title — each character drops in ────────────────────────── */
function SectionTitle({ text, color = "#00204d" }: { text: string; color?: string }) {
  const reducedMotion = !!useReducedMotion();
  return (
    <motion.div
      className="flex items-center justify-center px-4 md:px-10 h-auto py-8 md:py-12 lg:h-70 w-full"
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={staggerContainer}
    >
      <div className="flex overflow-hidden">
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: "110%" },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: i * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            style={{
              display: "inline-block",
              fontWeight: 700,
              fontSize: "clamp(48px, 10vw, 143px)",
              lineHeight: 1.24,
              color,
              willChange: "transform",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── MacBook display frame ─────────────────────────────────────────── */
function MacFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '195.75 / 115' }}>
      <div className="absolute inset-0 bg-[#0c0c0d] rounded-[20px]" />
      <div className="absolute overflow-hidden rounded-[12px]" style={{ top: '3.7%', left: '2.17%', right: '2.17%', bottom: '3.7%' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Event card ─────────────────────────────────────────────────────── */
function EventCard({
  reverse, title, titleHighlight, description, imgSrc, imgStyle, tags,
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
        <span className="leading-[1.3] text-[#0c0c0d]">{title}</span>
        <span className="leading-[1.3] text-[#1a7aff]">{titleHighlight}</span>
      </div>
      <div className="font-medium text-[#6e7177] tracking-[-0.84px] leading-[1.3]" style={{ fontSize: "clamp(18px,2.5vw,28px)" }}>{description}</div>
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
function MemberCard({ role, name, img, style, delay = 0 }: {
  role: string; name: string; img: string; style: React.CSSProperties; delay?: number;
}) {
  const { ref, visible } = useInView(0.03);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className="group bg-[#0c0c0d] flex flex-col gap-2.5 items-start overflow-hidden p-2.5 rounded-4 shadow-[10px_10px_8px_0px_rgba(0,0,0,0.1)] cursor-default transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[10px_18px_24px_0px_rgba(0,0,0,0.2)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ${EASE} ${delay}ms`,
        willChange: "transform",
      }}>
      <div className="relative h-[250px] w-[200px] md:h-[300px] md:w-[240px] overflow-hidden rounded-lg">
        <img alt={name} className="absolute max-w-none transition-transform duration-500 group-hover:scale-105"
          src={img} style={style} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#1a7aff]/80 to-transparent
                        translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      </div>
      <div className="flex flex-col items-start px-1 text-[#fafafa] w-full">
        <span className="font-bold text-[16px] tracking-[-0.48px] leading-[1.4]">{role}</span>
        <span className="font-medium text-[22px] tracking-[-0.66px] leading-[1.3]">{name}</span>
      </div>
    </div>
  );
}

/* ─── History content ────────────────────────────────────────────────── */
const TIMELINE = [
  { year: "2000", title: "GAMEWORKS 창립", desc: "학부의 시작과 함께 문을 열었습니다" },
  { year: "2008", title: "첫 교내 대회 수상", desc: "첫 수상으로 팀의 가능성을 보여줬습니다" },
  { year: "2013", title: "100명 회원 달성", desc: "누적 회원 100명을 돌파하며 글로미 최대 소모임으로 성장" },
  { year: "2018", title: "멘토링 프로그램 시작", desc: "선배와 후배를 잇는 흐름을 만들었습니다" },
  { year: "2023", title: "우수 소모임 선정", desc: "학교가 인정한 대표 소모임이 됐습니다" },
  { year: "2025", title: "25주년", desc: "쌓아온 시간 위에 다음 25년을 준비합니다" },
];

function TimelineItem({ year, title, desc, index }: { year: string; title: string; desc: string; index: number }) {
  const { ref, visible } = useInView(0.08);
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ${EASE} ${index * 100}ms`,
      }}>
      {/* 왼쪽 */}
      <div className={`flex flex-col items-end ${isLeft ? "" : "opacity-0 pointer-events-none"}`}>
        {isLeft && (
          <>
            <span className="font-bold text-[#1a7aff] text-[14px] tracking-widest">{year}</span>
            <span className="font-bold text-[#fafafa] text-[clamp(16px,2vw,24px)] tracking-[-0.72px] leading-[1.3] text-right">{title}</span>
            <span className="font-medium text-[#a2a5a9] text-[15px] leading-normal text-right mt-1">{desc}</span>
          </>
        )}
      </div>

      {/* 중앙 점 */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[#1a7aff] border-2 border-[#fafafa] shadow-[0_0_12px_rgba(26,122,255,0.6)]" />
      </div>

      {/* 오른쪽 */}
      <div className={`flex flex-col items-start ${!isLeft ? "" : "opacity-0 pointer-events-none"}`}>
        {!isLeft && (
          <>
            <span className="font-bold text-[#1a7aff] text-[14px] tracking-widest">{year}</span>
            <span className="font-bold text-[#fafafa] text-[clamp(16px,2vw,24px)] tracking-[-0.72px] leading-[1.3]">{title}</span>
            <span className="font-medium text-[#a2a5a9] text-[15px] leading-normal mt-1">{desc}</span>
          </>
        )}
      </div>
    </div>
  );
}

function HistoryContent() {
  return (
    <div className="w-full py-20 px-6 md:px-16 lg:px-40 relative">
      {/* 중앙 세로선 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />

      <div className="flex flex-col gap-16 relative">
        {TIMELINE.map((item, i) => (
          <TimelineItem key={item.year} {...item} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── Stats section ──────────────────────────────────────────────────── */
function StatsSection() {
  const { ref: sectionRef, visible } = useInView(0.12);
  const ref1 = useRef<HTMLSpanElement>(null);
  const ref2 = useRef<HTMLSpanElement>(null);
  const ref3 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    if (prefersReducedMotion) {
      if (ref1.current) ref1.current.textContent = "25";
      if (ref2.current) ref2.current.textContent = "100";
      if (ref3.current) ref3.current.textContent = "30";
      return;
    }
    const targets = [25, 100, 30];
    const refs = [ref1, ref2, ref3];
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      targets.forEach((target, i) => {
        const el = refs[i]?.current;
        if (el) el.textContent = Math.round(eased * target).toString();
      });

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="w-full py-20 bg-[#0c0c0d]">
      <div className="flex flex-wrap justify-center w-full gap-y-8">
        {/* stat 1: 25년 */}
        <div className="flex flex-col items-center gap-2 px-8 md:px-14 lg:px-20 border-r border-white/10">
          <div className="flex items-end gap-1">
            <span ref={ref1} className="font-bold tracking-[-3.2px] leading-none text-[#fafafa]" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="font-bold leading-none text-[#fafafa] mb-2" style={{ fontSize: "clamp(22px,3vw,40px)" }}>년</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>설립</span>
        </div>

        {/* stat 2: 100명+ */}
        <div className="flex flex-col items-center gap-2 px-8 md:px-14 lg:px-20 border-r border-white/10">
          <div className="flex items-end gap-1">
            <span ref={ref2} className="font-bold tracking-[-3.2px] leading-none text-[#fafafa]" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="font-bold leading-none text-[#fafafa] mb-2" style={{ fontSize: "clamp(22px,3vw,40px)" }}>명+</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>함께한 사람들</span>
        </div>

        {/* stat 3: 30개+ */}
        <div className="flex flex-col items-center gap-2 px-8 md:px-14 lg:px-20">
          <div className="flex items-end gap-1">
            <span ref={ref3} className="font-bold tracking-[-3.2px] leading-none text-[#fafafa]" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="font-bold leading-none text-[#fafafa] mb-2" style={{ fontSize: "clamp(22px,3vw,40px)" }}>개+</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>매년 이어지는 활동</span>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA section ────────────────────────────────────────────────────── */
function CTASection() {
  const reducedMotion = !!useReducedMotion();
  return (
    <motion.section
      className="flex min-h-[400px] lg:h-150 py-20 lg:py-0 items-center justify-center px-10 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      variants={staggerContainer}
    >
      <div className="flex flex-col gap-10 items-center w-full max-w-[736px]">
        <div className="flex flex-col gap-8 items-center text-[#0c0c0d] text-center w-full">
          <motion.span
            className="font-semibold tracking-[-3.2px] leading-[1.3] w-full"
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
            variants={getFadeUpVariants(32, 0, reducedMotion)}
          >
            같이 만들 다음 25년,
            <br />
            여기서 시작합니다
          </motion.span>
          <motion.span
            className="font-medium tracking-[-1.44px] leading-[1.3] w-full"
            style={{ fontSize: "clamp(20px,2.8vw,36px)" }}
            variants={getFadeUpVariants(24, 0.15, reducedMotion)}
          >
            기획, 개발, 디자인.
            <br />
            분야를 넘어 함께 성장하는 곳
          </motion.span>
        </div>
        <motion.button
          className="border border-[#0c0c0d] px-5 py-2.5 rounded-14 bg-transparent transition-all duration-300 hover:bg-[#0c0c0d] group cursor-pointer"
          variants={getFadeUpVariants(16, 0.3, reducedMotion)}
          whileHover={reducedMotion ? undefined : { y: -4, scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        >
          <span className="font-medium text-[#0c0c0d] tracking-[-0.96px] leading-[1.3] whitespace-nowrap transition-colors duration-300 group-hover:text-[#fafafa]" style={{ fontSize: "clamp(16px,2vw,24px)" }}>
            지원 하기 →
          </span>
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
function Footer() {
  const { ref, visible } = useInView(0.04);
  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ${EASE} ${delay}ms`,
  });
  return (
    <footer ref={ref as React.RefObject<HTMLElement>} className="w-full bg-[#000b1a] px-6 md:px-16 lg:px-28 pt-16 pb-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0 max-w-[1200px] mx-auto">
        <div style={fadeStyle(0)} className="flex flex-col gap-6 items-start max-w-[300px]">
          <span className="font-semibold text-[#fafafa] text-[24px] md:text-[32px] tracking-[-1.28px] leading-[1.3]">GAMEWORKS</span>
          <p className="font-medium text-[#a2a5a9] text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.5]">
            2000년부터 이어진<br />글로벌미디어학부 대표 학술 소모임입니다.
          </p>
        </div>
        <div className="flex gap-12 md:gap-20 lg:gap-25">
          <div style={fadeStyle(100)} className="flex flex-col gap-4 items-start">
            <span className="font-semibold text-[#fafafa] text-[18px] md:text-[24px] tracking-[-0.5px] leading-[1.3]">바로가기</span>
            <div className="flex flex-col gap-2 items-start">
              {[
                { label: "홈", id: "home" },
                { label: "임원진", id: "people" },
                { label: "연혁", id: "history" },
                { label: "활동", id: "event" },
              ].map(({ label, id }) => (
                <button key={label}
                  onClick={() => id === "home" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(id)}
                  className="font-medium text-[#a2a5a9] text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.3] hover:text-[#fafafa] transition-colors duration-200 bg-transparent cursor-pointer">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={fadeStyle(200)} className="flex flex-col gap-4 items-start">
            <span className="font-semibold text-[#fafafa] text-[18px] md:text-[24px] tracking-[-0.5px] leading-[1.3] whitespace-nowrap">연락하기</span>
            <div className="flex flex-col gap-2 items-start">
              {["Instagram", "Discord", "~~~@gmail.com", "000 : 010-0000-0000"].map((item) => (
                <div key={item} className="flex gap-2.5 items-center group cursor-pointer">
                  <div className="relative shrink-0 size-4">
                    <div className="absolute inset-[-1.77%]">
                      <img alt="" className="block max-w-none size-full" src={imgFrame14} />
                    </div>
                  </div>
                  <span className="font-medium text-[#a2a5a9] text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.3] whitespace-nowrap group-hover:text-[#fafafa] transition-colors duration-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={fadeStyle(300)} className="mt-12 pt-8 border-t border-white/10 font-medium text-[#a2a5a9] text-[13px] md:text-[14px] text-center tracking-[-0.3px] leading-[1.5] max-w-[1200px] mx-auto">
        <p>© 2026 GAMEWORKS, All rights reserved.</p>
        <p>25년째 같이 만들고 있는 학부 대표 소모임, GAMEWORKS</p>
      </div>
    </footer>
  );
}

const NAV_ITEMS = [
  { label: "임원진", id: "people" },
  { label: "연혁", id: "history" },
  { label: "활동", id: "event" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export function Homepage() {
  const [activeSection, setActiveSection] = useState("");
  const [heroReady, setHeroReady]         = useState(false);
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
    const ids = ["people", "event", "history", "about"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e?.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee-left  { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
        @keyframes marquee-right { from{transform:translateX(-50%)} to{transform:translateX(0)}    }
        @keyframes float         { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-14px)} }
        @keyframes pulse-glow    { 0%,100%{opacity:.7;transform:scale(1)}  50%{opacity:1;transform:scale(1.08)} }
        @keyframes scroll-bounce { 0%,100%{transform:translateY(0)}  50%{transform:translateY(8px)} }
      `}</style>

      <div className="flex flex-col items-start w-full bg-[#fafafa]">

        <Header
          activeSection={activeSection}
          heroReady={heroReady}
          logoSrc={imgVector1}
          navItems={NAV_ITEMS}
          onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onNavigate={scrollTo}
        />

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div id="home" className="relative h-screen min-h-225 w-full shrink-0 overflow-hidden bg-[#0c0c0d]">
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
                className="font-bold text-[#fafafa] text-center leading-[1.2] whitespace-nowrap pointer-events-none"
                style={{ fontSize: "clamp(52px, 6vw, 88px)", letterSpacing: "-0.03em" }}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 36 }}
                animate={heroReady ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.div>
            ))}
            <motion.button
              onClick={() => scrollTo("apply")}
              className="mt-8 px-8 py-3.5 rounded-full font-semibold text-[18px] tracking-[-0.54px] leading-none cursor-pointer transition-all duration-300 whitespace-nowrap"
              style={{ color: "#fafafa", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}
              initial={reducedMotion ? { opacity: 1, background: "rgba(255,255,255,0.15)" } : { opacity: 0, background: "rgba(255,255,255,0.15)" }}
              animate={heroReady ? { opacity: 1, background: "rgba(255,255,255,0.15)" } : undefined}
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
            <span className="font-medium text-[#fafafa] text-[13px] tracking-[-0.42px] opacity-40">scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10l6 6 6-6" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────── */}
        <section id="about" className="flex flex-col gap-25 items-center pt-0 pb-30 w-full bg-[#0c0c0d] -mt-px">
          <FadeUp threshold={0.3} className="flex flex-col items-center font-bold tracking-[-1.5px] text-center px-4">
            <span className="leading-[1.3] text-[#fafafa]" style={{ fontSize: "clamp(28px,4vw,50px)" }}>기획, 개발, 디자인 —</span>
            <span className="leading-[1.3] text-[#fafafa]" style={{ fontSize: "clamp(28px,4vw,50px)" }}>분야를 넘어 함께 성장하는 소모임</span>
          </FadeUp>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center px-4 md:px-10 w-full">
            {/* Photos — 데스크탑에서만 표시 */}
            <SlideIn from="left" className="hidden lg:block relative lg:w-[400px] lg:shrink-0 aspect-[124/244.75]">
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
            <SlideIn from="right" delay={150} className="flex w-full lg:flex-[1_0_0] flex-col gap-10 lg:gap-50 items-center lg:items-end justify-center min-w-0">
              {/* 로고 — 데스크탑에서만 */}
              <div className="hidden lg:flex flex-col gap-4 items-start shrink-0">
                <div className="relative h-73.25 w-75"
                  style={{ animation: "float 5s ease-in-out 1s infinite" }}>
                  <GameworksLogo
                    aria-label="GAMEWORKS 로고"
                    className="absolute block size-full text-[#fafafa]"
                  />
                </div>
                <span className="font-bold text-[#fafafa] tracking-[-3.2px] leading-[1.1] whitespace-nowrap" style={{ fontSize: "clamp(40px,6vw,80px)" }}>
                  GAMEWORKS
                </span>
              </div>
              <div className="hidden lg:block h-px w-24 bg-white/20" />

              {/* 본문 — 모바일 핵심 콘텐츠 */}
              <p className="font-bold text-[#fafafa] leading-[1.4] text-center lg:text-right"
                style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-0.03em" }}>
                게임웍스는 2000년대 초<br />
                글로벌미디어학부의 시작을<br />
                함께한 학술 소모임입니다.
              </p>
              <span className="font-semibold text-[13px] tracking-[0.24em] text-[#5b9dff] uppercase">
                Since 2000
              </span>
            </SlideIn>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <StatsSection />

        {/* ── History ───────────────────────────────────────────── */}
        <section id="history" className="flex flex-col items-center w-full"
          style={{ background: "linear-gradient(to bottom, #0c0c0d 0%, #0e1628 30%, #00204d 55%)" }}>
          <SectionTitle text="HISTORY" color="#fafafa" />
          <HistoryContent />
        </section>

        {/* ── Marquee / Desktop-26 ──────────────────────────────── */}
        <div className="overflow-hidden relative shrink-0 w-full h-[300px] md:h-[400px] lg:h-120" style={{ contain: "paint" }}>
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
            <div className="h-[120px] w-[124px] md:h-[180px] md:w-[186px] lg:h-60 lg:w-62 relative shrink-0"
              style={{ animation: "float 6s ease-in-out infinite" }}>
              <img alt="GAMEWORKS" className="absolute block max-w-none size-full" src={imgVector2} />
            </div>
            <span className="font-medium text-[16px] tracking-[0.2em] text-white/70 uppercase whitespace-nowrap">
              25 Years of Passion &amp; Growth
            </span>
          </div>
        </div>

        {/* ── People ────────────────────────────────────────────── */}
        <section id="people" className="flex flex-col items-center w-full">
          <SectionTitle text="PEOPLE" />

          <div className="flex flex-col gap-10 items-center px-10 pb-12 md:pb-20 w-full">
            <FadeUp threshold={0.2} className="flex flex-col items-center text-[#0c0c0d] text-center">
              <span className="font-medium tracking-[-2.4px] leading-[1.3]" style={{ fontSize: "clamp(36px,6vw,80px)" }}>2026 GAMEWORKS</span>
              <span className="font-bold tracking-[-1.14px] leading-[1.3]" style={{ fontSize: "clamp(22px,3vw,38px)" }}>임원진을 소개합니다</span>
            </FadeUp>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-10 w-full">
              <MemberCard role="회장"  name="장윤아" img={imgFrame7}  delay={0}   style={{ height: "112.66%", left: "-3.52%",  top: "-3.54%", width: "106.8%"  }} />
              <MemberCard role="회장"  name="조영찬" img={imgFrame8}  delay={80}  style={{ height: "115.78%", left: "-4.82%",  top: "-5.19%", width: "109.76%" }} />
              <MemberCard role="총무"  name="박서영" img={imgFrame9}  delay={160} style={{ height: "121.45%", left: "-10.96%", top: "-7.3%",  width: "115.94%" }} />
              <MemberCard role="부회장" name="유다은" img={imgFrame10} delay={0}   style={{ height: "111.61%", left: "-3.17%",  top: "-5.98%", width: "105.81%" }} />
              <MemberCard role="부회장" name="최서정" img={imgFrame11} delay={80}  style={{ height: "111.78%", left: "-3.15%",  top: "-5.74%", width: "105.97%" }} />
              <MemberCard role="부회장" name="최지원" img={imgFrame12} delay={160} style={{ height: "110.35%", left: "-2.37%",  top: "-5.22%", width: "104.61%" }} />
              <MemberCard role="부회장" name="홍준우" img={imgFrame13} delay={240} style={{ height: "102.78%", left: "-12.76%", top: "-2.86%", width: "124.99%" }} />
            </div>

            <button className="border-b border-[#0c0c0d] flex items-center p-2 bg-transparent cursor-pointer group">
              <span className="font-medium text-[#0c0c0d] text-[20px] leading-none group-hover:opacity-50 transition-opacity duration-200">
                이전 임원진도 보기 →
              </span>
            </button>
          </div>
        </section>

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

            <button className="border-b border-[#0c0c0d] flex items-center p-2 bg-transparent cursor-pointer group">
              <span className="font-medium text-[#0c0c0d] text-[20px] leading-none transition-opacity duration-300 group-hover:opacity-50">
                활동 더 보기 →
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
