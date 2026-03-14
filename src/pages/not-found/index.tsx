import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { navigateHome, navigateActivity } from "@/lib/navigation";
import type { PageProps } from "@/lib/header-config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function NotFoundPage({ onHeaderConfig, onHeroReady }: PageProps) {
  const reducedMotion = !!useReducedMotion();

  useEffect(() => {
    onHeaderConfig({ activeSection: "home", darkHero: true });
    onHeroReady();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white flex flex-col">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-6%] h-[500px] w-[500px] rounded-full bg-[#1a7aff]/14 blur-[140px]" />
        <div className="absolute right-[-8%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#3b82f6]/10 blur-[160px]" />
        <div className="absolute left-[35%] bottom-[-8%] h-[360px] w-[360px] rounded-full bg-[#0d56c9]/16 blur-[150px]" />
      </div>

      {/* Main content */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50"
        >
          GAMEWORKS · Error
        </motion.div>

        {/* 404 */}
        <div className="relative mt-8 flex items-center justify-center select-none" aria-hidden="true">
          {["4", "0", "4"].map((char, i) => (
            <motion.span
              key={i}
              className="font-semibold leading-none tracking-[-0.06em]"
              style={{
                fontSize: "clamp(120px, 22vw, 280px)",
                color: i === 1 ? "transparent" : "#fafafa",
                WebkitTextStroke: i === 1 ? "2px rgba(26,122,255,0.7)" : "none",
                textShadow: i !== 1 ? "0 0 80px rgba(26,122,255,0.18)" : "none",
              }}
              initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
            >
              {char}
            </motion.span>
          ))}

          {/* Glow behind 404 */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-48 rounded-full bg-[#1a7aff]/12 blur-[60px]" />
          </div>
        </div>

        {/* Heading */}
        <motion.h1
          className="mt-4 text-[clamp(24px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.05em] text-white"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease: EASE }}
        >
          페이지를 찾을 수 없어요
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mt-4 max-w-[480px] text-[clamp(16px,2vw,20px)] leading-[1.7] tracking-[-0.03em] text-white/52"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.46, ease: EASE }}
        >
          요청하신 주소는 존재하지 않거나 이동되었어요.
          <br />
          아래 버튼으로 돌아갈 수 있어요.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.54, ease: EASE }}
        >
          <button
            onClick={navigateHome}
            className="rounded-full bg-[#1a7aff] px-7 py-3 text-[16px] font-semibold tracking-[-0.03em] text-white transition-all duration-200 hover:bg-[#3b8fff] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            홈으로 →
          </button>
          <button
            onClick={navigateActivity}
            className="rounded-full border border-white/12 bg-white/[0.04] px-7 py-3 text-[16px] font-semibold tracking-[-0.03em] text-white/75 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.08] hover:text-white hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            활동 보기
          </button>
        </motion.div>
      </main>

      {/* Bottom copyright */}
      <motion.div
        className="relative pb-8 text-center text-[13px] font-medium tracking-[-0.02em] text-white/20"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        © 2026 GAMEWORKS
      </motion.div>
    </div>
  );
}
