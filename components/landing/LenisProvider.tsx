"use client";

/**
 * LenisProvider — Smooth scroll with GSAP ScrollTrigger sync.
 *
 * Why this matters: Lenis replaces the browser's native scroll with a
 * physics-based momentum scroll. The page feels like it has weight and
 * inertia — the single most immediately perceptible signal of a premium site.
 *
 * Critical: without the gsap.ticker sync, ScrollTrigger animations will
 * fire at the wrong time and feel broken with Lenis active.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration:   1.4,          // longer = more inertia (1.2–1.6 for luxury feel)
      easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,
      touchMultiplier: 1.5,    // slightly faster on touch for responsiveness
    });

    lenisRef.current = lenis;

    // ── Sync Lenis with GSAP ticker ──────────────────────────────────────────
    // This is non-negotiable: Lenis intercepts scroll events, so ScrollTrigger
    // must get its position data from Lenis's RAF, not the native scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's own lag smoothing so Lenis handles all timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
