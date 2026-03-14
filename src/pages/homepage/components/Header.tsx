import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { GlobalNavId } from "@/lib/navigation";
import { useHeaderBrandState } from "@/pages/homepage/components/useHeaderBrandState";
import { useHeaderMotion } from "@/pages/homepage/components/useHeaderMotion";
import { useIsMobile } from "@/pages/homepage/hooks/useMobile";

type NavItem = { label: string; id: GlobalNavId };

type HeaderProps = {
  activeSection: string;
  heroReady: boolean;
  logoSrc: string;
  navItems: NavItem[];
  pageTitle?: string;
  onScrollTop: () => void;
  onNavigate: (id: GlobalNavId) => void;
  darkHero?: boolean;
};

function HamburgerIcon({ open, color }: { open: boolean; color: MotionValue<string> }) {
  return (
    <div className="relative flex h-5 w-5 flex-col items-center justify-center gap-1.5">
      <motion.span className="block h-[1.5px] w-full origin-center rounded-full" style={{ background: color }}
        animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} />
      <motion.span className="block h-[1.5px] w-full rounded-full" style={{ background: color }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} />
      <motion.span className="block h-[1.5px] w-full origin-center rounded-full" style={{ background: color }}
        animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} />
    </div>
  );
}

export function Header({
  activeSection, heroReady, logoSrc, navItems, pageTitle,
  onScrollTop, onNavigate, darkHero = true,
}: HeaderProps) {
  const reducedMotion = !!useReducedMotion();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const { wordmarkHidden, chrome, cta, panel } = useHeaderMotion(activeSection, darkHero);
  const isDarkTone = activeSection === "home" || activeSection === "about" || activeSection === "history";
  const brandState = useHeaderBrandState({ pageTitle: menuOpen ? undefined : pageTitle, wordmarkHidden: wordmarkHidden || menuOpen });

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── 헤더 + 모바일 메뉴 (단일 컨테이너) ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 lg:px-20"
        data-header-tone={isDarkTone ? "dark" : "light"}
        data-menu-open={menuOpen ? "" : undefined}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={heroReady ? { opacity: 1 } : undefined}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{
          // 원래 크롬 스타일 그대로 — 블러/배경 여기에
          background: chrome.background,
          backdropFilter: chrome.blur,
          borderBottom: chrome.border,
        }}
      >
        {/* 메뉴 오픈 시 배경 오버레이 — 크롬 위에 fade-in, backdrop-filter는 nav 것 재사용 */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: panel.background }}
          animate={{ opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />

        {/* 헤더 바 */}
        <div className="relative flex w-full items-center justify-between py-4">
          <button
            onClick={() => { setMenuOpen(false); onScrollTop(); }}
            aria-label="GAMEWORKS 홈으로 이동"
            className="flex items-center px-1 py-1 transition-opacity duration-200 hover:opacity-70"
          >
            <motion.div className="relative shrink-0 size-6.5"
              animate={{ scale: brandState.isCompact ? 1.06 : 1 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1] }}>
              <motion.img alt="" className="absolute block max-w-none size-full"
                src={logoSrc} style={{ filter: chrome.logoInvert }} />
            </motion.div>
            <motion.div className="overflow-hidden"
              animate={{ width: brandState.wordmarkWidth, marginLeft: brandState.wordmarkMarginLeft }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1], delay: brandState.isCompact ? 0.14 : 0 }}>
              <motion.span className="block font-bold text-[32px] leading-[1.3] whitespace-nowrap"
                animate={{ opacity: brandState.isCompact ? 0 : 1, x: brandState.isCompact ? -20 : 0 }}
                transition={{ duration: 0.2, ease: brandState.isCompact ? [0.4, 0, 1, 1] : [0, 0, 0.3, 1] }}
                style={{ color: chrome.textColor }}>
                AMEWORKS
              </motion.span>
            </motion.div>
            {pageTitle && (
              <motion.div className="overflow-hidden"
                animate={{ width: brandState.titleWidth, marginLeft: brandState.titleMarginLeft }}
                transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1], delay: brandState.showPageTitle ? 0.12 : 0 }}>
                <motion.span
                  className="block whitespace-nowrap font-bold text-[20px] leading-[1.3] tracking-[-0.04em] md:text-[22px]"
                  animate={{ opacity: brandState.showPageTitle ? 1 : 0, x: brandState.showPageTitle ? 0 : -18 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ color: chrome.textColor }}>
                  {pageTitle}
                </motion.span>
              </motion.div>
            )}
          </button>

          <div className="flex items-center gap-3">
            {/* 데스크탑 네비게이션 */}
            <motion.div className="hidden md:flex items-start rounded-cta p-1.5" style={{ border: chrome.shellBorder }}>
              {navItems.map(({ label, id }) => (
                <motion.button key={id} onClick={() => onNavigate(id)}
                  className="flex cursor-pointer items-center justify-center rounded-full px-6 py-1.5">
                  <motion.span className="font-medium text-[17px] tracking-[-0.68px] leading-[1.3]"
                    style={{ color: chrome.textColor }}>
                    {label}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>

            {/* 데스크탑 CTA */}
            <motion.button
              className="hidden md:block cursor-pointer whitespace-nowrap rounded-cta px-5 py-1.5 font-semibold text-[15px]"
              style={{ background: cta.background, color: cta.color, border: cta.border }}>
              지금 가입하기
            </motion.button>

            {/* 모바일 햄버거 */}
            <button
              className="relative md:hidden flex items-center justify-center w-9 h-9 rounded-full"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}>
              <HamburgerIcon open={menuOpen} color={(menuOpen ? panel.textColor : chrome.textColor) as MotionValue<string>} />
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 콘텐츠 */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="relative md:hidden overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-2 pb-5 pt-1">
                <nav>
                  {navItems.map(({ label, id }, i) => (
                    <motion.button
                      key={id}
                      onClick={() => { setMenuOpen(false); onNavigate(id); }}
                      className="flex w-full items-center justify-between py-4 text-left active:opacity-50 cursor-pointer"
                      style={{ borderBottom: panel.dividerColor }}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.span className="font-semibold text-[22px] tracking-[-0.5px]"
                        style={{ color: panel.textColor }}>
                        {label}
                      </motion.span>
                      <motion.svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-30">
                        <motion.path d="M6 3l6 6-6 6" style={{ stroke: panel.chevronColor }}
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.button>
                  ))}
                </nav>

                <motion.button
                  onClick={() => setMenuOpen(false)}
                  className="mt-5 w-full rounded-2xl py-4 font-semibold text-[17px] tracking-[-0.4px] text-white active:opacity-80 cursor-pointer"
                  style={{ background: "#1a7aff" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.08 + navItems.length * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                  지금 가입하기
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 딤 배경 — 메뉴 영역 밖 탭 시 닫힘 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
