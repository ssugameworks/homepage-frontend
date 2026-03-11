import {
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const BRAND_TRANSITION_RANGE = [0, 60];
const MENU_SHADOW_RANGE = [0, 18];

function useRgbaMotion(
  progress: MotionValue<number>,
  from: [number, number, number],
  to: [number, number, number],
  alpha: [number, number],
): MotionValue<string> {
  const r = useTransform(progress, [0, 1], [from[0], to[0]]);
  const g = useTransform(progress, [0, 1], [from[1], to[1]]);
  const b = useTransform(progress, [0, 1], [from[2], to[2]]);
  const a = useTransform(progress, [0, 1], [alpha[0], alpha[1]]);

  return useMotionTemplate`rgba(${r} ${g} ${b} / ${a})`;
}

export function useHeaderMotion() {
  const { scrollY } = useScroll();
  const navProgress = useTransform(scrollY, [0, 36], [0, 1], {
    clamp: true,
  });

  const chrome = {
    textColor: useTransform(
      navProgress,
      [0, 1],
      ["rgb(250 250 250)", "rgb(12 12 13)"],
    ),
    background: useMotionTemplate`rgba(255,255,255,${useTransform(navProgress, [0, 1], [0, 0.92])})`,
    border: useMotionTemplate`1px solid rgba(12,12,13,${useTransform(navProgress, [0, 1], [0, 0.08])})`,
    shellBorder: useRgbaMotion(navProgress, [250, 250, 250], [12, 12, 13], [0.85, 0.2]),
    shadow: useMotionTemplate`0 10px 30px rgba(12,12,13,${useTransform(navProgress, [0, 1], [0, 0.06])})`,
    blur: useMotionTemplate`blur(${useTransform(navProgress, [0, 1], [0, 12])}px)`,
    logoInvert: useMotionTemplate`invert(${useTransform(navProgress, [0, 1], [0, 1])})`,
  };

  const brand = {
    iconScale: useTransform(scrollY, BRAND_TRANSITION_RANGE, [1, 1.04], {
      clamp: true,
    }),
    wordmarkWidth: useTransform(scrollY, BRAND_TRANSITION_RANGE, [192, 0], {
      clamp: true,
    }),
    wordmarkMarginLeft: useTransform(scrollY, BRAND_TRANSITION_RANGE, [0.5, 0], {
      clamp: true,
    }),
    wordmarkOpacity: useTransform(scrollY, BRAND_TRANSITION_RANGE, [1, 0], {
      clamp: true,
    }),
    wordmarkX: useTransform(scrollY, BRAND_TRANSITION_RANGE, [0, -20], {
      clamp: true,
    }),
    wordmarkScaleX: useTransform(scrollY, BRAND_TRANSITION_RANGE, [1, 0.82], {
      clamp: true,
    }),
    wordmarkBlur: useMotionTemplate`blur(${useTransform(scrollY, BRAND_TRANSITION_RANGE, [0, 3], {
      clamp: true,
    })}px)`,
  };

  const menu = {
    shadow: useMotionTemplate`0 12px 28px rgba(0,0,0,${useTransform(scrollY, MENU_SHADOW_RANGE, [0.14, 0], {
      clamp: true,
    })})`,
    activePillBackground: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 1], [0.08, 0.2])})`,
  };

  const cta = {
    background: useMotionTemplate`rgba(26,122,255,${useTransform(navProgress, [0, 0.16, 1], [0, 0, 1])})`,
    border: useRgbaMotion(navProgress, [250, 250, 250], [26, 122, 255], [1, 1]),
  };

  return {
    chrome,
    brand,
    cta,
    menu,
  };
}
