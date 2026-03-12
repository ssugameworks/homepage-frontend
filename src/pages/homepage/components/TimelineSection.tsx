import React from "react";
import { useInViewOnce } from "@/pages/homepage/hooks/useInView";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type TimelineEntry = {
  year: string;
  title: string;
  desc: string;
};

function TimelineItem({ year, title, desc, index }: TimelineEntry & { index: number }) {
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

export function TimelineSection({ items, className = "" }: { items: TimelineEntry[]; className?: string }) {
  return (
    <section className={`relative w-full ${className}`}>
      <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/20" />
      <div className="relative flex flex-col gap-16">
        {items.map((item, index) => (
          <TimelineItem key={item.year} {...item} index={index} />
        ))}
      </div>
    </section>
  );
}
