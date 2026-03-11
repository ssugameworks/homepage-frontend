import { useEffect, useState } from "react";
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

const CHROME_RANGE      = [0, 60];
const MENU_SHADOW_RANGE = [0, 18];
const DARK_SECTIONS     = new Set(["home", "about", "history"]);

export function useHeaderMotion(activeSection: string) {
  const { scrollY } = useScroll();
  const navProgress = useTransform(scrollY, CHROME_RANGE, [0, 1], { clamp: true });

  // 0 = light section, 1 = dark section — 부드럽게 전환
  const darkProgress = useMotionValue(DARK_SECTIONS.has(activeSection) ? 1 : 0);
  useEffect(() => {
    animate(darkProgress, DARK_SECTIONS.has(activeSection) ? 1 : 0, {
      duration: 0.45,
      ease: "easeInOut",
    });
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

  // 스크롤됐을 때 배경색 (dark=어두운, light=흰색)
  const bgR = useTransform(darkProgress, [0, 1], [255, 18]);
  const bgG = useTransform(darkProgress, [0, 1], [255, 18]);
  const bgB = useTransform(darkProgress, [0, 1], [255, 20]);
  const bgA = useTransform(navProgress,  [0, 1], [0,   0.88]);

  // 스크롤됐을 때 텍스트색 (dark=흰색, light=검정)
  const scrolledTextColor = useTransform(
    [navProgress, darkProgress],
    ([nav, dark]) => {
      const n = nav as number;
      const d = dark as number;
      // 최상단은 항상 흰색(250), 스크롤 후 섹션에 따라
      const scrolledR = 250 * d + 12 * (1 - d);
      const scrolledB = 250 * d + 13 * (1 - d);
      const r = Math.round(250 + (scrolledR - 250) * n);
      const gb = Math.round(250 + (scrolledR - 250) * n);
      const b = Math.round(250 + (scrolledB - 250) * n);
      return `rgb(${r} ${gb} ${b})`;
    }
  );

  // 테두리
  const borderColor = useTransform(
    [navProgress, darkProgress],
    ([nav, dark]) => {
      const n = nav as number;
      const d = dark as number;
      const a = n * (d > 0.5 ? 0.12 : 0.08);
      return d > 0.5
        ? `1px solid rgba(255,255,255,${a})`
        : `1px solid rgba(12,12,13,${a})`;
    }
  );

  // 로고 invert: dark=0(흰색), light=1(검정)
  const logoInvert = useTransform(
    [navProgress, darkProgress],
    ([nav, dark]) => {
      const n = nav as number;
      const d = dark as number;
      const scrolledInvert = 1 - d; // dark=0, light=1
      return `invert(${n * scrolledInvert})`;
    }
  );

  const chrome = {
    textColor: scrolledTextColor,
    background: useMotionTemplate`rgba(${bgR},${bgG},${bgB},${bgA})`,
    border: borderColor,
    shellBorder: useTransform(
      [navProgress, darkProgress],
      ([nav, dark]) => {
        const n = nav as number;
        const d = dark as number;
        const a = 0.85 - n * (0.85 - 0.2);
        return d > 0.5
          ? `rgba(250,250,250,${a})`
          : `rgba(12,12,13,${a})`;
      }
    ),
    shadow: useMotionTemplate`0 10px 30px rgba(0,0,0,${useTransform(navProgress, [0, 1], [0, 0.15])})`,
    blur: useMotionTemplate`blur(${useTransform(navProgress, [0, 1], [0, 12])}px)`,
    logoInvert,
  };

  const menu = {
    shadow: useMotionTemplate`0 12px 28px rgba(0,0,0,${useTransform(scrollY, MENU_SHADOW_RANGE, [0.14, 0], { clamp: true })})`,
    activePillBackground: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 1], [0.08, 0.2])})`,
  };

  const cta = {
    background: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 0.16, 1], [0, 0, 1])})`,
    border: useTransform(
      [navProgress, darkProgress],
      ([nav, dark]) => {
        const n = nav as number;
        const d = dark as number;
        const r = Math.round(250 + (26  - 250) * n);
        const g = Math.round(250 + (122 - 250) * n);
        const b = Math.round(250 + (255 - 250) * n);
        return `1px solid rgba(${r},${g},${b},${d > 0.5 ? 0.6 : 1})`;
      }
    ),
  };

  return { chrome, wordmarkHidden, cta, menu };
}
