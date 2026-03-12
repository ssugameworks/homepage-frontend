import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { navigateByNavId, navigateHome } from "@/lib/navigation";
import { Header } from "@/pages/homepage/components";
import { logoSrc } from "@/pages/roadmap/constants";
import { NAV_ITEMS, TIMELINE } from "@/pages/homepage/content/homepage";
import { useInViewOnce } from "@/pages/homepage/hooks/useHomepageEffects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TimelineItem({ year, title, desc, index }: { year: string; title: string; desc: string; index: number }) {
  const { ref, visible } = useInViewOnce(0.08);
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ${EASE} ${index * 100}ms`,
      }}
    >
      <div className={`flex flex-col items-end ${isLeft ? "" : "pointer-events-none opacity-0"}`}>
        {isLeft && (
          <>
            <span className="text-[14px] font-bold tracking-widest text-[#1a7aff]">{year}</span>
            <span className="text-right text-[clamp(16px,2vw,24px)] font-bold leading-[1.3] tracking-[-0.72px] text-[#fafafa]">
              {title}
            </span>
            <span className="mt-1 text-right text-[15px] font-medium leading-normal text-[#a2a5a9]">{desc}</span>
          </>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full border-2 border-[#fafafa] bg-[#1a7aff] shadow-[0_0_12px_rgba(26,122,255,0.6)]" />
      </div>

      <div className={`flex flex-col items-start ${!isLeft ? "" : "pointer-events-none opacity-0"}`}>
        {!isLeft && (
          <>
            <span className="text-[14px] font-bold tracking-widest text-[#1a7aff]">{year}</span>
            <span className="text-[clamp(16px,2vw,24px)] font-bold leading-[1.3] tracking-[-0.72px] text-[#fafafa]">
              {title}
            </span>
            <span className="mt-1 text-[15px] font-medium leading-normal text-[#a2a5a9]">{desc}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function HistoryPage() {
  const reducedMotion = !!useReducedMotion();

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#0c0c0d_0%,#0e1628_36%,#00204d_100%)] text-white">
      <Header
        activeSection="history"
        heroReady={true}
        logoSrc={logoSrc}
        navItems={NAV_ITEMS}
        pageTitle="연혁"
        onScrollTop={navigateHome}
        onNavigate={navigateByNavId}
      />

      <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-16 pt-28 md:px-10 lg:px-16">
        <motion.div
          className="max-w-[760px]"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">
            GAMEWORKS Timeline
          </div>
          <h1 className="mt-5 text-[clamp(46px,8vw,108px)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
            우리가
            <br />
            이어온 시간
          </h1>
          <p className="mt-6 max-w-[640px] text-[clamp(18px,2.2vw,24px)] leading-[1.6] tracking-[-0.03em] text-white/68">
            2000년부터 지금까지 GAMEWORKS가 어떤 흐름으로 쌓여왔는지 핵심 순간만 빠르게 볼 수 있게 정리했습니다.
          </p>
        </motion.div>

        <section className="relative mt-14 w-full py-6 md:py-10">
          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/20" />
          <div className="relative flex flex-col gap-16">
            {TIMELINE.map((item, index) => (
              <TimelineItem key={item.year} {...item} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
