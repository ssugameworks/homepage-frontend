import { useEffect, useState } from "react";
import type { RefObject } from "react";

const SECTION_IDS = ["home", "about", "history", "history-bridge", "event", "people"];

export function useActiveSectionTracker(eventEndRef: RefObject<HTMLDivElement | null>) {
  const [activeSection, setActiveSection] = useState("home");
  const [pastEventScroll, setPastEventScroll] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter((s): s is { id: string; el: HTMLElement } => s !== null);

    let ticking = false;

    const update = () => {
      const pivot = window.innerHeight * 0.38;

      if (eventEndRef.current) {
        const r = eventEndRef.current.getBoundingClientRect();
        setPastEventScroll(r.top <= pivot);
      }

      const containing = sections.find(({ el }) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= pivot && rect.bottom >= pivot;
      });

      if (containing) {
        setActiveSection((prev) => prev === containing.id ? prev : containing.id);
        ticking = false;
        return;
      }

      let nearestId = sections[0]?.id ?? "home";
      let nearestDist = Number.POSITIVE_INFINITY;
      for (const { id, el } of sections) {
        const rect = el.getBoundingClientRect();
        const dist = Math.min(Math.abs(rect.top - pivot), Math.abs(rect.bottom - pivot));
        if (dist < nearestDist) { nearestDist = dist; nearestId = id; }
      }

      setActiveSection((prev) => prev === nearestId ? prev : nearestId);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [eventEndRef]);

  return { activeSection, pastEventScroll };
}
