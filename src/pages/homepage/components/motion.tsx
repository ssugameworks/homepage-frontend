import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export const EASE = "cubic-bezier(0.16,1,0.3,1)";

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.24,
    },
  },
};

export function getFadeUpVariants(
  distance: number,
  delay = 0,
  reducedMotion = false,
): Variants {
  return {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay + 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
}

export function getSlideInVariants(
  from: "left" | "right",
  delay = 0,
  reducedMotion = false,
): Variants {
  const dx = from === "left" ? -60 : 60;

  return {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, x: dx },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        delay: delay + 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
}

export function FadeUp({
  children,
  delay = 0,
  distance = 32,
  threshold = 0.08,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  threshold?: number;
  className?: string;
}) {
  const reducedMotion = !!useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: threshold }}
      variants={getFadeUpVariants(distance, delay / 1000, reducedMotion)}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  from = "left",
  delay = 0,
  threshold = 0.06,
  className = "",
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const reducedMotion = !!useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: threshold }}
      variants={getSlideInVariants(from, delay / 1000, reducedMotion)}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  text,
  color = "#00204d",
}: {
  text: string;
  color?: string;
}) {
  const reducedMotion = !!useReducedMotion();

  return (
    <motion.div
      className="flex h-auto w-full items-center justify-center px-4 py-8 md:px-10 md:py-12 lg:h-70"
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.18 }}
      variants={staggerContainer}
    >
      <div className="flex overflow-hidden">
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: "110%" },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: i * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            style={{
              display: "inline-block",
              fontWeight: 700,
              fontSize: "clamp(48px, 10vw, 143px)",
              lineHeight: 1.24,
              color,
              willChange: "transform",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
