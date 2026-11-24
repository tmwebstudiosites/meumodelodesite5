import type { Variants } from "motion/react";
import { duration, ease, stagger } from "./tokens";

/** Entrada com subida suave; saída mais curta e rápida. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: duration.fast, ease: ease.in } },
};

export const container = (delay = 0, gap: number = stagger.base): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
  exit: { transition: { staggerChildren: stagger.tight, staggerDirection: -1 } },
});

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.page, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } },
};

export const drawer: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, y: -12, transition: { duration: duration.fast, ease: ease.in } },
};

export const collapse: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: duration.base, ease: ease.inOut },
  },
  exit: { height: 0, opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
};
