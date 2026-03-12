import React, { useEffect, useRef } from "react";
import { prefersReducedMotion, useInView } from "@/pages/homepage/hooks/useHomepageEffects";

export function StatsSection() {
  const { ref: sectionRef, visible } = useInView(0.12);
  const ref1 = useRef<HTMLSpanElement>(null);
  const ref2 = useRef<HTMLSpanElement>(null);
  const ref3 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (ref1.current) ref1.current.textContent = "25";
      if (ref2.current) ref2.current.textContent = "100";
      if (ref3.current) ref3.current.textContent = "30";
      return;
    }
    if (!visible) {
      if (ref1.current) ref1.current.textContent = "0";
      if (ref2.current) ref2.current.textContent = "0";
      if (ref3.current) ref3.current.textContent = "0";
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
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="w-full bg-ink py-20">
      <div className="flex w-full flex-wrap justify-center gap-y-8">
        <div className="flex flex-col items-center gap-2 border-r border-white/10 px-8 md:px-14 lg:px-20">
          <div className="flex items-end gap-1">
            <span ref={ref1} className="font-bold leading-none tracking-[-3.2px] text-snow" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="mb-2 font-bold leading-none text-snow" style={{ fontSize: "clamp(22px,3vw,40px)" }}>년</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>설립</span>
        </div>

        <div className="flex flex-col items-center gap-2 border-r border-white/10 px-8 md:px-14 lg:px-20">
          <div className="flex items-end gap-1">
            <span ref={ref2} className="font-bold leading-none tracking-[-3.2px] text-snow" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="mb-2 font-bold leading-none text-snow" style={{ fontSize: "clamp(22px,3vw,40px)" }}>명+</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>함께한 사람들</span>
        </div>

        <div className="flex flex-col items-center gap-2 px-8 md:px-14 lg:px-20">
          <div className="flex items-end gap-1">
            <span ref={ref3} className="font-bold leading-none tracking-[-3.2px] text-snow" style={{ fontSize: "clamp(44px,6vw,80px)" }}>0</span>
            <span className="mb-2 font-bold leading-none text-snow" style={{ fontSize: "clamp(22px,3vw,40px)" }}>개+</span>
          </div>
          <span className="font-medium text-white/40" style={{ fontSize: "clamp(14px,1.5vw,18px)" }}>매년 이어지는 활동</span>
        </div>
      </div>
    </section>
  );
}
