import React, { useEffect, useRef, useState } from "react";

export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useInView(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(Boolean(entry?.isIntersecting));
      },
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function useInViewOnce(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        obs.disconnect();
      },
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

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

export function useCursorFollower() {
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "rgba(26, 122, 255, 0.45)",
      filter: "blur(18px)",
      pointerEvents: "none",
      zIndex: "9999",
      willChange: "transform",
      mixBlendMode: "multiply",
      opacity: "0.45",
    });
    document.body.appendChild(el);

    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;
    let currentScale = 1;
    let targetScale = 1;
    let currentOpacity = 0.45;
    let targetOpacity = 0.45;
    let currentGlow = 0;
    let targetGlow = 0;
    let activeNav: HTMLElement | null = null;
    let navRestoreOverflow = "";
    const darkSurfaceSelector = "#home, #about, #history, .bg-\\[\\#0c0c0d\\]";
    const NAV_CAPTURE_SCROLL_Y = 60;

    const setFollowerHost = (nextNav: HTMLElement | null) => {
      if (activeNav === nextNav) return;

      if (activeNav) activeNav.style.overflow = navRestoreOverflow;
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
      const isHoveringInteractive = Boolean(target.closest("button, a, [role=\"button\"]"));
      const hoveredNav = target.closest("nav") as HTMLElement | null;
      const nextNav = window.scrollY > NAV_CAPTURE_SCROLL_Y ? hoveredNav : null;
      setFollowerHost(nextNav);
      const isDarkNav = hoveredNav?.dataset.headerTone === "dark";
      const isDarkSurface = isDarkNav || Boolean(target.closest(darkSurfaceSelector));

      if (nextNav) {
        const rect = nextNav.getBoundingClientRect();
        tx = e.clientX - rect.left;
        ty = e.clientY - rect.top;
      } else {
        tx = e.clientX;
        ty = e.clientY;
      }

      targetScale = isHoveringInteractive ? 1.9 : 1;
      targetOpacity = isHoveringInteractive ? (isDarkSurface ? 0.62 : 0.56) : (isDarkSurface ? 0.5 : 0.45);
      targetGlow = isDarkSurface ? 1 : 0;
    };

    const tick = () => {
      cx += (tx - cx) * 0.32;
      cy += (ty - cy) * 0.32;
      currentScale += (targetScale - currentScale) * 0.14;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;
      currentGlow += (targetGlow - currentGlow) * 0.16;
      el.style.transform = `translate(${cx - 28}px, ${cy - 28}px) scale(${currentScale})`;
      el.style.opacity = String(currentOpacity);
      el.style.background = currentGlow > 0.5
        ? "rgba(58, 148, 255, 0.58)"
        : "rgba(26, 122, 255, 0.45)";
      el.style.filter = currentGlow > 0.5 ? "blur(19px)" : "blur(18px)";
      el.style.mixBlendMode = currentGlow > 0.5 ? "lighten" : "multiply";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (activeNav) activeNav.style.overflow = navRestoreOverflow;
      el.remove();
    };
  }, []);
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

export function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
