import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { navigateByNavId, navigateHome } from "@/lib/navigation";
import { Header } from "@/pages/homepage/components";
import { TimelineSection } from "@/pages/homepage/components/TimelineSection";
import { logoSrc } from "@/pages/roadmap/constants";
import { NAV_ITEMS, TIMELINE } from "@/pages/homepage/content/homepage";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

        <TimelineSection items={TIMELINE} className="mt-14 py-6 md:py-10" />
      </main>
    </div>
  );
}
