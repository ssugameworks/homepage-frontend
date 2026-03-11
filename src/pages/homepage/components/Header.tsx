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
  const { wordmarkHidden, chrome, cta, menu } = useHeaderMotion(activeSection);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 lg:px-20 py-4"
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
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onScrollTop}
          aria-label="GAMEWORKS 홈으로 이동"
          className="flex items-center px-1 py-1 transition-opacity duration-200 hover:opacity-70"
        >
          <motion.div
            className="relative shrink-0 size-6.5"
            animate={{ scale: wordmarkHidden ? 1.06 : 1 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1] }}
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
            animate={{
              width: wordmarkHidden ? 0 : 192,
              marginLeft: wordmarkHidden ? 0 : 2,
            }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1], delay: wordmarkHidden ? 0.14 : 0 }}
          >
            <motion.span
              className="block font-bold text-[32px] leading-[1.3] whitespace-nowrap"
              animate={{
                opacity: wordmarkHidden ? 0 : 1,
                x: wordmarkHidden ? -20 : 0,
              }}
              transition={{ duration: 0.2, ease: wordmarkHidden ? [0.4, 0, 1, 1] : [0, 0, 0.3, 1] }}
              style={{ color: chrome.textColor }}
            >
              AMEWORKS
            </motion.span>
          </motion.div>
        </button>

        <div className="flex items-center gap-3">
          <motion.div className="hidden md:flex items-start rounded-14 p-1.5"
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
                  className="flex cursor-pointer items-center justify-center rounded-25 px-6 py-1.5"
                  style={{ background: active ? menu.activePillBackground : "transparent" }}
                >
                  <motion.span
                    className="font-medium text-[17px] tracking-[-0.68px] leading-[1.3]"
                    style={{ color: active ? "#1a7aff" : chrome.textColor }}
                  >
                    {label}
                  </motion.span>
                </motion.button>
              );
            })}
          </motion.div>
          <motion.button
            className="cursor-pointer whitespace-nowrap rounded-[56px] px-5 py-1.5 font-semibold text-[15px]"
            style={{
              background: cta.background,
              color: "#fafafa",
              border: cta.border,
              opacity: cta.opacity,
            }}
          >
            지금 가입하기 →
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
