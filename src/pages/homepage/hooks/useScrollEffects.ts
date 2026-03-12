import { useEffect } from "react";
import { prefersReducedMotion } from "@/pages/homepage/hooks/useInView";

export function useParallaxEffect(
  targets: Array<{ ref: React.RefObject<HTMLElement | null>; fn: (y: number) => string }>,
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

export function useScrollProgress() {
  useEffect(() => {
    const bar = document.createElement("div");
    Object.assign(bar.style, {
      position: "fixed",
      top: "0",
      left: "0",
      height: "2px",
      width: "0%",
      background: "#1a7aff",
      zIndex: "99999",
      pointerEvents: "none",
      transformOrigin: "left",
    });
    document.body.appendChild(bar);

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      bar.remove();
    };
  }, []);
}

export function useSectionBackground() {
  useEffect(() => {
    const map: Record<string, string> = {
      home: "#fafafa",
      about: "#fafafa",
      event: "#b2d3ff",
      people: "#fafafa",
    };

    const sections = Object.keys(map)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as Element[];

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          document.body.style.backgroundColor = map[entry.target.id] ?? "#fafafa";
        }
      },
      { threshold: 0.3 },
    );

    sections.forEach((section) => obs.observe(section));
    return () => obs.disconnect();
  }, []);
}
