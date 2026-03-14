import { useEffect, useState } from "react";
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

const CHROME_RANGE  = [0, 60];
const DARK_SECTIONS = new Set(["home", "about", "history"]);
const SKY_TONE_SECTIONS = new Set(["history-bridge", "event"]);

function getToneValue(section: string) {
  if (DARK_SECTIONS.has(section)) return 0;
  if (SKY_TONE_SECTIONS.has(section)) return 1;
  return 2;
}

export function useHeaderMotion(activeSection: string, initialDark = true) {
  const { scrollY } = useScroll();
  const navProgress = useTransform(scrollY, CHROME_RANGE, [0, 1], { clamp: true });

  // 0 = light section, 1 = dark section — 부드럽게 전환
  const darkProgress = useMotionValue(DARK_SECTIONS.has(activeSection) ? 1 : 0);
  const toneProgress = useMotionValue(getToneValue(activeSection));
  useEffect(() => {
    animate(darkProgress, DARK_SECTIONS.has(activeSection) ? 1 : 0, {
      duration: 0.45,
      ease: "easeInOut",
    });
    animate(toneProgress, getToneValue(activeSection), {
      duration: 0.45,
      ease: "easeInOut",
    });
    // darkProgress and toneProgress are stable MotionValue instances (never replaced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // wordmark 토글 (hysteresis)
  const [wordmarkHidden, setWordmarkHidden] = useState(false);
  useEffect(() => {
    return scrollY.on("change", (y) => {
      setWordmarkHidden((prev) => {
        if (!prev && y > 60) return true;
        if (prev && y < 20) return false;
        return prev;
      });
    });
  }, [scrollY]);

  // tone: 0=dark, 1=sky, 2=light
  const bgR = useTransform(toneProgress, [0, 1, 2], [18, 199, 255]);
  const bgG = useTransform(toneProgress, [0, 1, 2], [18, 224, 255]);
  const bgB = useTransform(toneProgress, [0, 1, 2], [20, 255, 255]);
  const bgA = useTransform(navProgress,  [0, 1], [0,   0.88]);

  // 스크롤됐을 때 텍스트색 (dark=흰색, light=검정)
  // initialDark=true(홈 히어로): 최상단 흰색 → 스크롤 후 섹션 따라 결정
  // initialDark=false(밝은 페이지): 최상단부터 검정
  const initText = initialDark ? 250 : 12;
  const scrolledTextColor = useTransform(
    [navProgress, toneProgress],
    ([nav, tone]) => {
      const n = nav as number;
      const t = tone as number;
      const scrolledR = t <= 1 ? 250 - (246 * t) : 4 + 8 * (t - 1);
      const scrolledGB = t <= 1 ? 250 - (218 * t) : 32 - 20 * (t - 1);
      const scrolledB = t <= 1 ? 250 - (174 * t) : 76 - 63 * (t - 1);
      const r  = Math.round(initText + (scrolledR - initText) * n);
      const gb = Math.round(initText + (scrolledGB - initText) * n);
      const b  = Math.round(initText + (scrolledB - initText) * n);
      return `rgb(${r} ${gb} ${b})`;
    }
  );

  // 테두리
  const borderColor = useTransform(
    [navProgress, toneProgress],
    ([nav, tone]) => {
      const n = nav as number;
      const t = tone as number;
      if (t < 0.5) return `1px solid rgba(255,255,255,${n * 0.12})`;
      if (t < 1.5) return `1px solid rgba(0,32,77,${n * 0.14})`;
      return `1px solid rgba(12,12,13,${n * 0.08})`;
    }
  );

  // 로고 invert: dark=0(흰색), light=1(검정)
  const initInvert = initialDark ? 0 : 1;
  const logoInvert = useTransform(
    [navProgress, darkProgress],
    ([nav, dark]) => {
      const n = nav as number;
      const d = dark as number;
      const scrolledInvert = 1 - d;
      return `invert(${initInvert + (scrolledInvert - initInvert) * n})`;
    }
  );

  const chrome = {
    textColor: scrolledTextColor,
    background: useMotionTemplate`rgba(${bgR},${bgG},${bgB},${bgA})`,
    border: borderColor,
    shellBorder: useTransform(
      [navProgress, toneProgress],
      ([nav, tone]) => {
        const n = nav as number;
        const t = tone as number;
        if (t < 0.5) {
          const a = 0.85 - n * (0.85 - 0.2);
          return `rgba(250,250,250,${a})`;
        }
        if (t < 1.5) {
          return `rgba(0,32,77,${0.22 + n * 0.16})`;
        }
        const a = 0.85 - n * (0.85 - 0.2);
        return `rgba(12,12,13,${a})`;
      }
    ),
    blur: useMotionTemplate`blur(${useTransform(navProgress, [0, 1], [0, 12])}px)`,
    logoInvert,
  };

  const menu = {
    activePillBackground: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 1], [0.08, 0.2])})`,
  };

  // 모바일 패널 — 섹션 톤을 반영하되 항상 불투명
  const panel = {
    background: useMotionTemplate`rgba(${bgR},${bgG},${bgB},0.96)`,
    blur: "blur(24px)" as const,
    textColor: useTransform(darkProgress, (d) =>
      d > 0.5 ? "#fafafa" : "#0c0c0d"
    ),
    borderColor: useTransform(darkProgress, (d) =>
      d > 0.5
        ? "1px solid rgba(255,255,255,0.10)"
        : "1px solid rgba(12,12,13,0.08)"
    ),
    dividerColor: useTransform(darkProgress, (d) =>
      d > 0.5
        ? "rgba(255,255,255,0.07)"
        : "rgba(12,12,13,0.07)"
    ),
    chevronColor: useTransform(darkProgress, (d) =>
      d > 0.5 ? "#ffffff" : "#000000"
    ),
  };

  // 라이트 페이지(initialDark=false): 초기 테두리·텍스트 다크, 스크롤 후 파란색으로
  const ctaInitR = initialDark ? 250 : 12;
  const ctaInitG = initialDark ? 250 : 12;
  const ctaInitB = initialDark ? 250 : 13;

  const cta = {
    opacity: useTransform(navProgress, [0, 0.5, 1], [0, 0, 1]),
    background: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 0.16, 1], [0, 0, 1])})`,
    border: useTransform(
      [navProgress, darkProgress],
      ([nav, dark]) => {
        const n = nav as number;
        const d = dark as number;
        const r = Math.round(ctaInitR + (26  - ctaInitR) * n);
        const g = Math.round(ctaInitG + (122 - ctaInitG) * n);
        const b = Math.round(ctaInitB + (255 - ctaInitB) * n);
        return `1px solid rgba(${r},${g},${b},${d > 0.5 ? 0.6 : 1})`;
      }
    ),
    // 라이트: 초기 검정, 스크롤해서 파란 배경 생기면 흰색
    color: useTransform(
      navProgress,
      [0, 0.16, 1],
      initialDark
        ? ["#fafafa", "#fafafa", "#fafafa"]
        : ["#0c0c0d", "#0c0c0d", "#fafafa"]
    ),
  };

  return { chrome, wordmarkHidden, cta, menu, panel };
}
