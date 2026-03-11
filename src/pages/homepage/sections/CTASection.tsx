import { motion, useReducedMotion } from "framer-motion";
import { getFadeUpVariants, staggerContainer } from "@/pages/homepage/components/motion";

export function CTASection() {
  const reducedMotion = !!useReducedMotion();

  return (
    <motion.section
      className="flex min-h-100 w-full items-center justify-center px-10 py-20 lg:h-150 lg:py-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.14 }}
      variants={staggerContainer}
    >
      <div className="flex w-full max-w-184 flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-8 text-center text-[#0c0c0d]">
          <motion.span
            className="w-full font-semibold tracking-[-3.2px] leading-[1.3]"
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
            variants={getFadeUpVariants(32, 0, reducedMotion)}
          >
            같이 만들 다음 25년,
            <br />
            여기서 시작합니다
          </motion.span>
          <motion.span
            className="w-full font-medium tracking-[-1.44px] leading-[1.3]"
            style={{ fontSize: "clamp(20px,2.8vw,36px)" }}
            variants={getFadeUpVariants(24, 0.15, reducedMotion)}
          >
            기획, 개발, 디자인.
            <br />
            분야를 넘어 함께 성장하는 곳
          </motion.span>
        </div>
        <motion.button
          className="group cursor-pointer whitespace-nowrap rounded-[56px] px-5 py-1.5 font-semibold text-[15px]"
          variants={getFadeUpVariants(16, 0.3, reducedMotion)}
          whileHover={reducedMotion ? undefined : { y: -4, scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          style={{
            background: "#1a7aff",
            color: "#fafafa",
            border: "1px solid #1a7aff",
          }}
        >
          <span className="font-semibold tracking-[-0.48px] leading-[1.3] whitespace-nowrap transition-opacity duration-300 group-hover:opacity-85">
            지원하러 가기 →
          </span>
        </motion.button>
      </div>
    </motion.section>
  );
}
