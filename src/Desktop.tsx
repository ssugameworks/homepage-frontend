import React, { useEffect, useRef, useState } from "react";

/* ─── Assets ─────────────────────────────────────────────────────────── */
const imgRectangle = "https://www.figma.com/api/mcp/asset/f844113f-1290-4f7b-b756-c9535804cb22";
const imgFrame1    = "https://www.figma.com/api/mcp/asset/02fbf0e9-c541-4384-803f-4321a85ee6d8";
const imgFrame2    = "https://www.figma.com/api/mcp/asset/e0923268-6f18-4df0-ae85-39b05ed232bd";
const imgDesktop26 = "https://www.figma.com/api/mcp/asset/d8baf606-7142-447f-b9aa-04a9911bb6a1";
const imgVector4   = "https://www.figma.com/api/mcp/asset/55fb0323-a424-40d2-9958-86933ccf386f";
const imgFrame3    = "https://www.figma.com/api/mcp/asset/842c0cd8-1f2f-4c48-8de9-8128e92d7a43";
const imgFrame4    = "https://www.figma.com/api/mcp/asset/256366d0-8148-4eea-baa8-73c5a924ec4d";
const imgFrame5    = "https://www.figma.com/api/mcp/asset/5903a1ca-3171-416d-87ae-ad2f6d22a0f9";
const imgFrame6    = "https://www.figma.com/api/mcp/asset/55dee613-3f2f-4140-be7d-fdc93e219c8d";
const imgFrame7    = "https://www.figma.com/api/mcp/asset/f74c68f7-e3a7-40aa-935c-093bc641d169";
const imgFrame8    = "https://www.figma.com/api/mcp/asset/63ea9bc1-d2b3-46ab-8a03-c347afe5e79f";
const imgFrame9    = "https://www.figma.com/api/mcp/asset/e2393502-2eb6-4e91-b72f-9937e53660bd";
const imgFrame10   = "https://www.figma.com/api/mcp/asset/7f2cd933-7f31-43e8-b2b4-6cc7d9e92dd5";
const imgFrame11   = "https://www.figma.com/api/mcp/asset/df202efd-4ecf-4c88-a8bf-0028829d268a";
const imgFrame12   = "https://www.figma.com/api/mcp/asset/0faa2a3b-36c3-4cc6-966a-9c20e7bc612d";
const imgFrame13   = "https://www.figma.com/api/mcp/asset/a8ecb1c0-3e37-427e-9742-43657463e3d7";
const imgVector    = "https://www.figma.com/api/mcp/asset/45dfd35e-c297-4d61-ade7-f9638d7c3a99";
const imgVector1   = "https://www.figma.com/api/mcp/asset/13f7df68-6b6d-4bb0-997a-81e7a90df652";
const imgFrame     = "https://www.figma.com/api/mcp/asset/23405a3e-0c8d-4d7e-8407-204e16b3f18e";
const imgLogo      = "https://www.figma.com/api/mcp/asset/fca9d28e-3bd3-4849-988e-84da44df3ecc";
const imgVector2   = "https://www.figma.com/api/mcp/asset/37dd5450-d8ed-4876-8bba-798ffa39318d";
const imgVector3   = "https://www.figma.com/api/mcp/asset/d46ce243-3311-444a-938c-1cbaa2903e2e";
const imgFrame14   = "https://www.figma.com/api/mcp/asset/bbcfd9b9-ad14-4adb-9f2a-3a7f383b5089";
const imgVector5   = "https://www.figma.com/api/mcp/asset/e40cc6a4-0c2b-4b0c-a6f0-bb5beeab8d3a";

const glowColors = [
  "#3B82F6","#6366F1","#8B5CF6","#A78BFA",
  "#60A5FA","#818CF8","#7C3AED","#4F46E5",
  "#2563EB","#7C3AED","#6D28D9","#4338CA",
  "#3B82F6","#60A5FA","#818CF8","#8B5CF6",
];

/* ─── Hooks ───────────────────────────────────────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Smoothed parallax scroll value. */
function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    let current = 0;
    const target = { val: 0 };
    const tick = () => {
      current += (target.val - current) * 0.08;
      setY(current);
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => { target.val = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return y;
}

/* ─── Primitives ──────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.16,1,0.3,1)";

function FadeUp({
  children, delay = 0, distance = 32, threshold = 0.15, className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  threshold?: number;
  className?: string;
}) {
  const { ref, visible } = useInView(threshold);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ${EASE} ${delay}ms`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

function SlideIn({
  children, from = "left", delay = 0, threshold = 0.1, className = "",
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const { ref, visible } = useInView(threshold);
  const dx = from === "left" ? -60 : 60;
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${dx}px)`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ${EASE} ${delay}ms`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section title — each character drops in ────────────────────────── */
function SectionTitle({ text, color = "#00204d" }: { text: string; color?: string }) {
  const { ref, visible } = useInView(0.4);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center justify-center px-[40px] h-[480px] w-full"
      aria-label={text}
    >
      <div className="flex overflow-hidden">
        {text.split("").map((ch, i) => (
          <span key={i}
            style={{
              display: "inline-block",
              fontWeight: 700,
              fontSize: "143px",
              lineHeight: 1.24,
              color,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(110%)",
              transition: `transform 0.7s ${EASE} ${i * 55}ms, opacity 0.5s ease ${i * 55}ms`,
              willChange: "transform",
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── MacBook display frame ─────────────────────────────────────────── */
function MacFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-grid grid-cols-1 grid-rows-1 shrink-0">
      <div className="bg-[#0c0c0d] col-start-1 row-start-1 h-[460px] rounded-[20px] w-[783px]" />
      <div className="col-start-1 row-start-1 h-[430px] ml-[17px] mt-[17px] relative rounded-[12px] w-[750px] overflow-hidden">
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
}) {
  const { ref, visible } = useInView(0.1);
  const dx = reverse ? 60 : -60;
  const text = (
    <div className="flex flex-[1_0_0] flex-col gap-[40px] items-start min-w-0">
      <div className="flex flex-col items-start text-[50px] font-bold tracking-[-1.5px] whitespace-nowrap">
        <span className="leading-[1.3] text-[#0c0c0d]">{title}</span>
        <span className="leading-[1.3] text-[#1a7aff]">{titleHighlight}</span>
      </div>
      <div className="text-[28px] font-medium text-[#6e7177] tracking-[-0.84px] leading-[1.3]">{description}</div>
    </div>
  );
  const frame = (
    <MacFrame>
      <img alt="" className="absolute max-w-none" src={imgSrc} style={imgStyle} />
    </MacFrame>
  );
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className="flex gap-[80px] items-center px-[20px] shrink-0 w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${dx}px)`,
        transition: `opacity 0.8s ease, transform 0.8s ${EASE}`,
        willChange: "transform",
      }}>
      {reverse ? <>{text}{frame}</> : <>{frame}{text}</>}
    </div>
  );
}

/* ─── Member card ────────────────────────────────────────────────────── */
function MemberCard({ role, name, img, style, delay = 0 }: {
  role: string; name: string; img: string; style: React.CSSProperties; delay?: number;
}) {
  const { ref, visible } = useInView(0.05);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className="group bg-[#0c0c0d] flex flex-col gap-[10px] items-start overflow-hidden p-[10px] rounded-[16px] shadow-[10px_10px_8px_0px_rgba(0,0,0,0.1)] shrink-0 cursor-default transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[10px_18px_24px_0px_rgba(0,0,0,0.2)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ${EASE} ${delay}ms`,
        willChange: "transform",
      }}>
      <div className="relative h-[300px] w-[240px] overflow-hidden rounded-[8px]">
        <img alt={name} className="absolute max-w-none transition-transform duration-500 group-hover:scale-105"
          src={img} style={style} />
      </div>
      <div className="flex flex-col items-start px-[4px] text-[#fafafa] w-full">
        <span className="font-bold text-[16px] tracking-[-0.48px] leading-[1.4]">{role}</span>
        <span className="font-medium text-[22px] tracking-[-0.66px] leading-[1.3]">{name}</span>
      </div>
    </div>
  );
}

/* ─── History content ────────────────────────────────────────────────── */
function HistoryContent() {
  const { ref, visible } = useInView(0.1);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className="relative h-[565px] w-full shrink-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.9s ease, transform 0.9s ${EASE}`,
      }}>
      <div className="absolute bg-[#00204d] h-[465px] left-0 overflow-hidden top-0 w-[1023px]">
        <div className="absolute flex flex-col gap-[60px] items-start left-[133px] top-[102px] w-[443px]">
          <div className="flex flex-col gap-[20px] items-start text-[#fafafa] w-full">
            <p className="font-bold text-[38px] tracking-[-1.14px] leading-[1.3]">
              게임웍스가 달려온<br />25년의 과정
            </p>
            <p className="font-medium text-[14px] tracking-[-0.42px] leading-[1.4]">
              게임웍스는 2000년대 초반부터 글로벌미디어학부와 함께 <br />
              시작하며 20년 이상 새로운 시도를 도전중입니다.
            </p>
          </div>
          <button className="border border-[#fafafa] border-[0.5px] px-[20px] py-[10px] rounded-[56px] bg-transparent transition-all duration-200 hover:bg-white/10 cursor-pointer">
            <span className="font-normal text-[#fafafa] text-[14px] text-center leading-none">자세히 보기 →</span>
          </button>
        </div>
        <div className="absolute h-[325px] left-[473px] top-[166px] w-[338px]">
          <div className="absolute inset-[-4.89%_-4.7%_-4.6%_-4.7%]">
            <img alt="" className="block max-w-none size-full" src={imgVector3} />
          </div>
        </div>
      </div>
      <div className="absolute h-[491px] right-0 top-[74px] w-[745px]">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector4} />
      </div>
    </div>
  );
}

/* ─── CTA section ────────────────────────────────────────────────────── */
function CTASection() {
  const { ref, visible } = useInView(0.3);
  return (
    <section ref={ref as React.RefObject<HTMLElement>}
      className="flex h-[600px] items-center justify-center px-[40px] w-full">
      <div className="flex flex-col gap-[40px] items-center w-[736px]">
        <div className="flex flex-col gap-[32px] items-center text-[#0c0c0d] text-center w-full">
          <span className="font-semibold text-[80px] tracking-[-3.2px] leading-[1.3] w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: `opacity 0.8s ease, transform 0.8s ${EASE}`,
            }}>
            Ready to Join Us?
          </span>
          <span className="font-medium text-[36px] tracking-[-1.44px] leading-[1.3] w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.8s ease 0.15s, transform 0.8s ${EASE} 0.15s`,
            }}>
            지금 바로 GAMEWORKS의 새로운 멤버가 되어보세요!
          </span>
        </div>
        <button
          className="border border-[#0c0c0d] border-[0.5px] px-[20px] py-[10px] rounded-[56px] bg-transparent transition-all duration-300 hover:bg-[#0c0c0d] group cursor-pointer"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
            transition: `opacity 0.7s ease 0.3s, transform 0.7s ${EASE} 0.3s, background-color 0.3s`,
          }}>
          <span className="font-medium text-[#0c0c0d] text-[24px] tracking-[-0.96px] leading-[1.3] whitespace-nowrap transition-colors duration-300 group-hover:text-[#fafafa]">
            GAMEWORKS 가입 바로가기
          </span>
        </button>
      </div>
    </section>
  );
}

/* ─── Nav ────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Member",  id: "people"  },
  { label: "History", id: "history" },
  { label: "Event",   id: "event"   },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export function Desktop() {
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [heroReady, setHeroReady]         = useState(false);
  const scrollY = useParallax();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = ["people", "event", "history", "about"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
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
        @keyframes nav-drop      { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sub-slide     { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
      `}</style>

      <div className="flex flex-col items-start w-full bg-[#fafafa]">

        {/* ── Fixed nav ─────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[80px] py-[24px] transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
            animation: heroReady ? `nav-drop 0.7s ${EASE} 0.1s both` : "none",
          }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-[2px] px-[4px] py-[6px] transition-opacity duration-200 hover:opacity-70">
            <div className="relative shrink-0 size-[26px]">
              <img alt="" className="absolute block max-w-none size-full" src={imgVector1}
                style={{ filter: scrolled ? "invert(1)" : "none", transition: "filter 0.3s" }} />
            </div>
            <span className="font-bold text-[32px] leading-[1.3] transition-colors duration-300"
              style={{ color: scrolled ? "#0c0c0d" : "#fafafa" }}>
              AMEWORKS
            </span>
          </button>

          <div className="flex items-start p-[10px] rounded-[56px] transition-all duration-300"
            style={{ border: scrolled ? "0.5px solid rgba(12,12,13,0.2)" : "0.5px solid #fafafa" }}>
            {NAV_ITEMS.map(({ label, id }) => {
              const active = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className="flex items-center justify-center px-[24px] py-[8px] rounded-[100px] transition-all duration-200 cursor-pointer"
                  style={{ background: active ? (scrolled ? "rgba(26,122,255,0.1)" : "rgba(255,255,255,0.2)") : "transparent" }}>
                  <span className="font-medium text-[18px] tracking-[-0.72px] leading-[1.3] transition-colors duration-300"
                    style={{ color: active ? (scrolled ? "#1a7aff" : "#fff") : (scrolled ? "#0c0c0d" : "#fafafa") }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div id="home" className="relative h-[100vh] min-h-[900px] w-full shrink-0 overflow-hidden">
          {/* Parallax background */}
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" src={imgRectangle} className="absolute w-full max-w-none left-0"
              style={{ height: "220%", top: "-70%", transform: `translateY(${scrollY * 0.25}px)`, willChange: "transform" }} />
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(180deg,rgba(255,255,255,0) 55%,rgba(255,255,255,0.85) 88%,#fafafa 100%)"
            }} />
          </div>

          {/* Glow blobs — pulsing */}
          <div className="absolute -translate-x-1/2 left-1/2 grid grid-cols-8 grid-rows-2 w-[1600px] pointer-events-none"
            style={{
              top: "calc(47% - 100px)",
              maskImage: `url('${imgFrame}')`,
              maskRepeat: "no-repeat",
              maskPosition: "66px 113px",
              maskSize: "1471px 174px",
            }}>
            {glowColors.map((color, i) => (
              <div key={i} className="shrink-0 size-[200px] blur-[40px] rounded-full"
                style={{
                  backgroundColor: color,
                  animation: `pulse-glow ${2.4 + (i % 4) * 0.4}s ease-in-out ${i * 120}ms infinite`,
                }} />
            ))}
          </div>

          {/* Hero title — letter-by-letter drop */}
          <div className="absolute -translate-x-1/2 left-1/2 top-[47%] -translate-y-1/2 flex select-none" aria-label="GAMEWORKS">
            {"GAMEWORKS".split("").map((ch, i) => (
              <span key={i} className="font-bold text-[240px] tracking-[-9.6px] leading-[1.3] text-[#fafafa]"
                style={{
                  display: "inline-block",
                  opacity: heroReady ? 1 : 0,
                  transform: heroReady ? "translateY(0) rotateX(0deg)" : "translateY(-80px) rotateX(-40deg)",
                  transition: `opacity 0.7s ease ${300 + i * 60}ms, transform 0.7s ${EASE} ${300 + i * 60}ms`,
                  willChange: "transform",
                }}>
                {ch}
              </span>
            ))}
          </div>

          {/* Sub caption — slides from right */}
          <div className="absolute flex gap-[16px] items-center right-[106px]"
            style={{
              top: "calc(47% + 132px)",
              animation: heroReady ? `sub-slide 0.8s ${EASE} 1s both` : "none",
            }}>
            <span className="font-bold text-[#fafafa] text-[38px] tracking-[-1.14px] leading-[1.3]">글로벌미디어학부</span>
            <div className="relative h-0 w-[200px]">
              <div className="absolute inset-[-1px_-0.5%]">
                <img alt="" className="block max-w-none size-full" src={imgVector} />
              </div>
            </div>
            <span className="font-bold text-[#fafafa] text-[38px] tracking-[-1.14px] leading-[1.3]">종합 학술 소모임</span>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-[48px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px]"
            style={{ animation: "scroll-bounce 1.8s ease-in-out 2s infinite" }}>
            <span className="font-medium text-[#0c0c0d] text-[13px] tracking-[-0.42px] opacity-50">scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10l6 6 6-6" stroke="#0c0c0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────── */}
        <section id="about" className="flex flex-col gap-[100px] items-center py-[120px] w-full">
          <FadeUp threshold={0.3} className="flex flex-col items-center font-bold text-[50px] tracking-[-1.5px] whitespace-nowrap">
            <div className="flex gap-[4px] items-center">
              <span className="leading-[1.3] text-[#1a7aff]">25년 역사</span>
              <span className="leading-[1.3] text-[#0c0c0d]">를 지닌</span>
            </div>
            <span className="leading-[1.3] text-[#0c0c0d]">글로벌미디어학부 유일 종합 학술 소모임</span>
          </FadeUp>

          <div className="flex gap-[80px] items-center px-[40px] w-full">
            {/* Photos */}
            <SlideIn from="left" className="relative h-[979px] w-[496px] shrink-0">
              <div className="absolute border border-[#0c0c0d] h-[600px] left-0 top-0 w-[400px] overflow-hidden">
                <img alt="" className="absolute max-w-none" src={imgFrame1}
                  style={{ height: "112.33%", left: "-58.15%", top: "-6.24%", width: "252.85%" }} />
              </div>
              <div className="absolute border border-[#0c0c0d] h-[600px] left-[96px] top-[379px] w-[400px] overflow-hidden">
                <img alt="" className="absolute max-w-none" src={imgFrame2}
                  style={{ height: "124.5%", left: "-108.26%", top: "-0.04%", width: "279.91%" }} />
              </div>
            </SlideIn>

            {/* Logo + text */}
            <SlideIn from="right" delay={150} className="flex flex-[1_0_0] flex-col gap-[200px] h-[805px] items-end justify-center min-w-0">
              <div className="flex flex-col gap-[16px] items-center shrink-0">
                <div className="relative h-[293px] w-[300px]"
                  style={{ animation: "float 5s ease-in-out 1s infinite" }}>
                  <img alt="GAMEWORKS 로고" className="absolute block max-w-none size-full" src={imgLogo} />
                </div>
                <span className="font-bold text-[#00204d] text-[80px] text-center tracking-[-3.2px] leading-[1.3] whitespace-nowrap">
                  GAMEWORKS
                </span>
              </div>
              <p className="font-bold text-[#0c0c0d] text-[38px] tracking-[-1.14px] leading-[1.3] shrink-0 whitespace-pre-wrap">
                {`게임웍스는  2000년대 초 \n글로벌미디어학부의 시작을 함께한 \n소모임으로  긴 역사를 자랑합니다.`}
              </p>
            </SlideIn>
          </div>
        </section>

        {/* ── Marquee / Desktop-26 ──────────────────────────────── */}
        <div className="overflow-hidden relative shrink-0 w-full h-[800px]" style={{ contain: "paint" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute block max-w-none size-full object-cover" src={imgDesktop26}
              style={{ transform: `translateY(${(scrollY - 2000) * -0.08}px)` }} />
          </div>

          <div className="absolute top-[200px] w-full overflow-hidden" aria-hidden="true">
            <div className="flex whitespace-nowrap font-semibold text-[#ececec] text-[240px] leading-none"
              style={{ animation: "marquee-left 20s linear infinite" }}>
              {Array(4).fill("GAMEWORKS\u00A0\u00A0\u00A0").map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </div>

          <div className="absolute bottom-[200px] w-full overflow-hidden" aria-hidden="true">
            <div className="flex whitespace-nowrap font-semibold text-[#ececec] text-[240px] leading-none"
              style={{ animation: "marquee-right 20s linear infinite" }}>
              {Array(4).fill("GAMEWORKS\u00A0\u00A0\u00A0").map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </div>

          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-[536px] w-[557px]"
            style={{ animation: "float 6s ease-in-out infinite" }}>
            <img alt="GAMEWORKS" className="absolute block max-w-none size-full" src={imgVector2} />
          </div>
        </div>

        {/* ── History ───────────────────────────────────────────── */}
        <section id="history" className="flex flex-col items-center w-full">
          <SectionTitle text="HISTORY" />
          <HistoryContent />
        </section>

        {/* ── Event ─────────────────────────────────────────────── */}
        <section id="event" className="flex flex-col items-center w-full">
          <div className="w-full" style={{ background: "linear-gradient(to bottom,#fafafa,#b2d3ff)" }}>
            <SectionTitle text="EVENT" />
          </div>

          <div className="flex flex-col gap-[160px] items-center px-[40px] py-[80px] w-full"
            style={{ background: "linear-gradient(to bottom,#b2d3ff 0%,#b2d3ff 76%,#fafafa 100%)" }}>
            <EventCard title="벚꽃과 함께" titleHighlight="봄나들이"
              description={<>벚꽃이 가득한 봄에 동기들과 선배들과<br />함께 놀러가요.</>}
              imgSrc={imgFrame3} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }} />
            <EventCard reverse title="가르치고 배우는" titleHighlight="멘토링"
              description={<>기획, 개발, 디자인 분야 등<br />지식 경험을 가르치고 배울 수 있어요.</>}
              imgSrc={imgFrame3} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }} />
            <EventCard title="서로 친해지는" titleHighlight="짝선짝후"
              description={<>선배와 미션을 클리어하며<br />서로 친해지는 시간을 가져요.</>}
              imgSrc={imgFrame4} imgStyle={{ height: "139.2%", left: "-1.69%", top: "-10.62%", width: "103.47%" }} />
            <EventCard reverse title="멋진 선배님과의" titleHighlight="커피챗"
              description="함께 커피를 마시며 노하우를 전수받고 진솔한 이야기를 나눠요."
              imgSrc={imgFrame3} imgStyle={{ height: "135.94%", left: "-0.44%", top: "-25.25%", width: "103.47%" }} />
            <EventCard title="대회를 경험해보는" titleHighlight="아이디어톤"
              description={<>여러 분야 간의 협업을 통해<br />프로젝트 완성 과정을 경험해봐요.</>}
              imgSrc={imgFrame5} imgStyle={{ height: "138.49%", left: "-1.85%", top: "-24.48%", width: "103.68%" }} />
            <EventCard reverse title="다가온 여름에 함께" titleHighlight="MT"
              description={<>무더운 여름날 동기들과 함께<br />즐거운 추억을 쌓아요.</>}
              imgSrc={imgFrame6} imgStyle={{ height: "231.99%", left: "0", top: "-82.61%", width: "100%" }} />

            <button className="border-b border-[#0c0c0d] flex items-center p-[8px] bg-transparent cursor-pointer group">
              <span className="font-medium text-[#0c0c0d] text-[20px] leading-none transition-opacity duration-300 group-hover:opacity-50">
                더 많은 활동 보러가기→
              </span>
            </button>
          </div>
        </section>

        {/* ── People ────────────────────────────────────────────── */}
        <section id="people" className="flex flex-col items-center w-full">
          <SectionTitle text="PEOPLE" />

          <div className="flex flex-col gap-[40px] items-center px-[40px] pb-[80px] w-full">
            <FadeUp threshold={0.2} className="flex flex-col items-center text-[#0c0c0d] whitespace-nowrap">
              <span className="font-medium text-[80px] tracking-[-2.4px] leading-[1.3]">2026 GAMEWORKS</span>
              <span className="font-bold text-[38px] tracking-[-1.14px] leading-[1.3]">임원진을 소개합니다</span>
            </FadeUp>

            <div className="flex flex-col gap-[40px] items-center">
              <div className="flex gap-[40px] items-center">
                <MemberCard role="회장"  name="장윤아" img={imgFrame7}  delay={0}   style={{ height: "112.66%", left: "-3.52%",  top: "-3.54%", width: "106.8%"  }} />
                <MemberCard role="회장"  name="조영찬" img={imgFrame8}  delay={80}  style={{ height: "115.78%", left: "-4.82%",  top: "-5.19%", width: "109.76%" }} />
                <MemberCard role="총무"  name="박서영" img={imgFrame9}  delay={160} style={{ height: "121.45%", left: "-10.96%", top: "-7.3%",  width: "115.94%" }} />
              </div>
              <div className="flex gap-[40px] items-center">
                <MemberCard role="부회장" name="유다은" img={imgFrame10} delay={0}   style={{ height: "111.61%", left: "-3.17%",  top: "-5.98%", width: "105.81%" }} />
                <MemberCard role="부회장" name="최서정" img={imgFrame11} delay={80}  style={{ height: "111.78%", left: "-3.15%",  top: "-5.74%", width: "105.97%" }} />
                <MemberCard role="부회장" name="최지원" img={imgFrame12} delay={160} style={{ height: "110.35%", left: "-2.37%",  top: "-5.22%", width: "104.61%" }} />
                <MemberCard role="부회장" name="홍준우" img={imgFrame13} delay={240} style={{ height: "102.78%", left: "-12.76%", top: "-2.86%", width: "124.99%" }} />
              </div>
            </div>

            <button className="border-b border-[#0c0c0d] flex items-center p-[8px] bg-transparent cursor-pointer group">
              <span className="font-medium text-[#0c0c0d] text-[20px] leading-none group-hover:opacity-50 transition-opacity duration-200">
                역대 임원진 보러가기→
              </span>
            </button>
          </div>
        </section>

        <CTASection />

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="relative h-[543px] w-full bg-[#000b1a]">
          <div className="absolute left-1/2 -translate-x-1/2 top-[75px] flex items-start justify-between w-[1153px]">
            <div className="flex flex-col gap-[24px] items-start w-[300px]">
              <span className="font-semibold text-[#fafafa] text-[36px] tracking-[-1.44px] leading-[1.3]">GAMEWORKS</span>
              <p className="font-medium text-[#a2a5a9] text-[24px] tracking-[-0.96px] leading-[1.3]">
                2000년부터 시작된<br />글로벌미디어학부 유일 종합 학술 소모임입니다.
              </p>
            </div>
            <div className="flex gap-[100px]">
              <div className="flex flex-col gap-[24px] items-start w-[180px]">
                <span className="font-semibold text-[#fafafa] text-[32px] tracking-[-1.28px] leading-[1.3]">Quick Links</span>
                <div className="flex flex-col gap-[8px] items-start">
                  {[
                    { label: "Home",    id: "home"    },
                    { label: "Member",  id: "people"  },
                    { label: "History", id: "history" },
                    { label: "Event",   id: "event"   },
                  ].map(({ label, id }) => (
                    <button key={label}
                      onClick={() => id === "home" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(id)}
                      className="font-medium text-[#a2a5a9] text-[24px] tracking-[-0.96px] leading-[1.3] hover:text-[#fafafa] transition-colors duration-200 bg-transparent cursor-pointer">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[24px] items-start w-[280px]">
                <span className="font-semibold text-[#fafafa] text-[32px] tracking-[-1.28px] leading-[1.3] whitespace-nowrap">Connect With Us</span>
                <div className="flex flex-col gap-[8px] items-start">
                  {["Instagram", "Discord", "~~~@gmail.com", "000 : 010-0000-0000"].map((item) => (
                    <div key={item} className="flex gap-[10px] items-center group cursor-pointer">
                      <div className="relative shrink-0 size-[20px]">
                        <div className="absolute inset-[-1.77%]">
                          <img alt="" className="block max-w-none size-full" src={imgFrame14} />
                        </div>
                      </div>
                      <span className="font-medium text-[#a2a5a9] text-[24px] tracking-[-0.96px] leading-[1.3] whitespace-nowrap group-hover:text-[#fafafa] transition-colors duration-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[359px] h-0 w-[1440px]">
            <div className="absolute inset-[-0.5px_0]">
              <img alt="" className="block max-w-none size-full" src={imgVector5} />
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[448px] font-medium text-[#a2a5a9] text-[16px] text-center tracking-[-0.48px] leading-[1.5] whitespace-nowrap">
            <p>© 2026 GAMEWORKS, All rights reserved.</p>
            <p>25년의 역사를 이어온 종합 학술 소모임, GAMEWORKS</p>
          </div>
        </footer>

      </div>
    </>
  );
}
