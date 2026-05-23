"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Custom magnetic-style cursor — small teal dot + lagging ring.
 * Renders only on pointer-fine devices (no-op on touch).
 *
 * Mount this once at the top of the landing page tree.
 * Hide the native cursor with `.landing-page { cursor: none !important; }`
 */
export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Centre both elements at pointer hotspot
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // quickTo for buttery 60fps tracking without re-renders
    const dotX  = gsap.quickTo(dot,  "x", { duration: 0.03 });
    const dotY  = gsap.quickTo(dot,  "y", { duration: 0.03 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.16, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.16, ease: "power3.out" });

    let entered = false;

    const onMove = (e: MouseEvent) => {
      if (!entered) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
        entered = true;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.9, borderColor: "rgba(0,194,168,0.55)", duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { scale: 0.35, duration: 0.2 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1,   borderColor: "rgba(0,194,168,0.28)", duration: 0.3,  ease: "power2.out" });
      gsap.to(dot,  { scale: 1,   duration: 0.25 });
    };

    const onMouseDown = () => gsap.to([dot, ring], { scale: 0.7, duration: 0.12 });
    const onMouseUp   = () => gsap.to([dot, ring], { scale: 1,   duration: 0.25, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("mousemove",  onMove, { passive: true });
    window.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",    onMouseUp);

    // Attach interactive listeners to all links and buttons that exist NOW
    const bindInteractives = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    };

    // Bind once on mount; a MutationObserver would be overkill for a marketing page
    bindInteractives();
    // Also bind after a short delay in case of hydration timing
    const t = setTimeout(bindInteractives, 600);

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mouseup",    onMouseUp);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      {/* Dot — instantaneous */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{ width: 8, height: 8, background: "#00C2A8", mixBlendMode: "screen" }}
      />
      {/* Ring — lagged */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{ width: 36, height: 36, border: "1.5px solid rgba(0,194,168,0.28)" }}
      />
    </>
  );
}
