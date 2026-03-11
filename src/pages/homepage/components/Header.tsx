import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { useHeaderMotion } from "@/pages/homepage/components/useHeaderMotion";

type NavItem = {
  label: string;
  id: string;
};

type HeaderProps = {
  activeSection: string;
  heroReady: boolean;
  logoSrc: string;
  navItems: NavItem[];
  onScrollTop: () => void;
  onNavigate: (id: string) => void;
};

export function Header({
  activeSection,
  heroReady,
  logoSrc,
  navItems,
  onScrollTop,
  onNavigate,
}: HeaderProps) {
  const reducedMotion = !!useReducedMotion();
  const { brand, chrome, cta, menu } = useHeaderMotion();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-20 py-6"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={heroReady ? { opacity: 1 } : undefined}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: chrome.background,
        backdropFilter: chrome.blur,
        borderBottom: chrome.border,
        boxShadow: chrome.shadow,
      }}
    >
      <button
        onClick={onScrollTop}
        aria-label="GAMEWORKS 홈으로 이동"
        className="flex items-center px-1 py-1.5 transition-opacity duration-200 hover:opacity-70"
      >
        <motion.div
          className="relative shrink-0 size-6.5"
          style={{ scale: brand.iconScale }}
        >
          <motion.img
            alt=""
            className="absolute block max-w-none size-full"
            src={logoSrc}
            style={{ filter: chrome.logoInvert }}
          />
        </motion.div>
        <motion.div
          className="overflow-hidden"
          style={{
            width: brand.wordmarkWidth,
            marginLeft: brand.wordmarkMarginLeft,
          }}
        >
          <motion.span
            className="block origin-left font-bold text-[32px] leading-[1.3] whitespace-nowrap"
            style={{
              color: chrome.textColor,
              opacity: brand.wordmarkOpacity,
              x: brand.wordmarkX,
              scaleX: brand.wordmarkScaleX,
              filter: brand.wordmarkBlur,
            }}
          >
            AMEWORKS
          </motion.span>
        </motion.div>
      </button>

      <div className="flex gap-4 items-center">
        <motion.div
          className="flex items-start p-2.5 rounded-14"
          style={{
            border: chrome.shellBorder,
            boxShadow: menu.shadow,
          }}
        >
          {navItems.map(({ label, id }) => {
            const active = activeSection === id;
            return (
              <motion.button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center justify-center px-6 py-2 rounded-25 cursor-pointer"
                style={{ background: active ? menu.activePillBackground : "transparent" }}
              >
                <motion.span
                  className="font-medium text-[18px] tracking-[-0.72px] leading-[1.3]"
                  style={{ color: active ? "#1a7aff" : chrome.textColor }}
                >
                  {label}
                </motion.span>
              </motion.button>
            );
          })}
        </motion.div>
        <motion.button
          className="px-5 py-2 rounded-[56px] font-semibold text-[16px] cursor-pointer whitespace-nowrap"
          style={{
            background: cta.background,
            color: "#fafafa",
            border: cta.border,
          }}
        >
          지금 가입하기 →
        </motion.button>
      </div>
    </motion.nav>
  );
}
