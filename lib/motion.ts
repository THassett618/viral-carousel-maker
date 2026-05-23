// ─── Shared Framer Motion variants & timing presets ──────────────────────────
// Use these across all landing components for a consistent motion language.

import type { Variants, Transition } from "framer-motion";

// ── Easing curves ─────────────────────────────────────────────────────────────
export const easeExpo = [0.16, 1, 0.3, 1] as const;
export const easeOut  = [0.21, 0.47, 0.32, 0.98] as const;
export const easeBack = [0.175, 0.885, 0.32, 1.275] as const;

// ── Shared viewport options for scroll-triggered animations ───────────────────
export const viewport = { once: true, margin: "-80px" } as const;

// ── Variants ──────────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.85, ease: easeExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.75, ease: easeExpo },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -72, rotateY: -14 },
  visible: {
    opacity: 1, x: 0, rotateY: 0,
    transition: { duration: 0.85, ease: easeExpo },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 72, rotateY: 14 },
  visible: {
    opacity: 1, x: 0, rotateY: 0,
    transition: { duration: 0.85, ease: easeExpo },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065 } },
};

// ── Spring configs for useSpring ──────────────────────────────────────────────
export const springGentle  = { stiffness: 35,  damping: 18 };
export const springMedium  = { stiffness: 60,  damping: 20 };
export const springSnappy  = { stiffness: 120, damping: 22 };
export const springElastic = { stiffness: 200, damping: 16 };

// ── GSAP ease strings ─────────────────────────────────────────────────────────
export const GSAP_EASE_EXPO  = "expo.out";
export const GSAP_EASE_POWER = "power3.out";
export const GSAP_EASE_SINE  = "sine.inOut";
