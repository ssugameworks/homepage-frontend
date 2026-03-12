import { useEffect } from "react";
import { prefersReducedMotion } from "@/pages/homepage/hooks/useInView";

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
    const darkSurfaceSelector = "#home, #about, #history, .bg-ink, .bg-footer, .bg-canvas";
    const navCaptureScrollY = 60;

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
      // Find the outer nav (with data-header-tone) — inner <nav> inside menu doesn't have it
      const outerNav = target.closest("nav[data-header-tone]") as HTMLElement | null;
      const isMenuOpen = Boolean(outerNav?.hasAttribute("data-menu-open"));
      const nextNav = !isMenuOpen && window.scrollY > navCaptureScrollY ? outerNav : null;
      setFollowerHost(nextNav);
      const isDarkNav = outerNav?.dataset.headerTone === "dark";
      const isDarkSurface = isDarkNav || Boolean(target.closest(darkSurfaceSelector));

      if (nextNav && outerNav) {
        const rect = outerNav.getBoundingClientRect();
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
