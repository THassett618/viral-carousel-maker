"use client";

import {
  useState, useRef, useLayoutEffect, useEffect,
} from "react";
import Link from "next/link";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles, ArrowRight, BookImage, Download, Zap,
  BarChart3, ListChecks, Check, Users, ChevronRight,
} from "lucide-react";

import { Cursor } from "@/components/landing/Cursor";
import { HeroParticles } from "@/components/landing/HeroParticles";
import { HeroNoiseShader } from "@/components/landing/HeroNoiseShader";
import { SplitText, SplitLine } from "@/components/landing/SplitText";
import { easeExpo, springGentle } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const DM = "var(--font-dm-sans)";
const BG = "var(--font-bricolage)";

// ─── Demo data ────────────────────────────────────────────────────────────────

type DemoSlide = { type: string; accent: string; headline: string; sub?: string; slideNum: number };

const DEMO_PRESETS: Record<string, { topic: string; slides: DemoSlide[] }> = {
  linkedin: {
    topic: "5 habits that grew my LinkedIn to 50K followers",
    slides: [
      { type: "HOOK",        accent: "#00C2A8", headline: "5 habits that grew my LinkedIn to 50K followers in 90 days", slideNum: 1 },
      { type: "TIP",         accent: "#3B82F6", headline: "Post at 7am weekdays", sub: "Peak LinkedIn hours = 3× more reach than afternoon posts.", slideNum: 2 },
      { type: "STAT",        accent: "#F59E0B", headline: "87%", sub: "of top-performing posts start with a curiosity-gap headline", slideNum: 3 },
      { type: "CHECKLIST",   accent: "#10B981", headline: "Perfect post structure:\n✓ Hook (curiosity or value)\n✓ 3–5 bite-size insights\n✓ One clear CTA\n✓ Original image", slideNum: 4 },
      { type: "BEFORE/AFTER",accent: "#7C3AED", headline: "Before: Salesy 'thought leadership'", sub: "After: Specific story-driven carousels people save", slideNum: 5 },
      { type: "CTA",         accent: "#F43F5E", headline: "Follow for weekly LinkedIn tactics that actually move the needle.", slideNum: 6 },
    ],
  },
  productivity: {
    topic: "The morning routine that added $100K to my year",
    slides: [
      { type: "HOOK",      accent: "#F59E0B", headline: "The 90-minute morning routine that added $100K to my year", slideNum: 1 },
      { type: "STAT",      accent: "#00C2A8", headline: "84%", sub: "of Fortune 500 CEOs wake before 6am. Here's why it works.", slideNum: 2 },
      { type: "TIP",       accent: "#3B82F6", headline: "First 90 minutes = zero notifications", sub: "Your best thinking happens before the world gets to you.", slideNum: 3 },
      { type: "TIP",       accent: "#7C3AED", headline: "Hydrate before coffee", sub: "16oz of water upon waking raises alertness by 20% within 20 min.", slideNum: 4 },
      { type: "CHECKLIST", accent: "#10B981", headline: "The formula:\n✓ Hydrate (5 min)\n✓ Move your body (20 min)\n✓ Plan your top 3 (10 min)\n✓ Deep work (60 min)", slideNum: 5 },
      { type: "CTA",       accent: "#F43F5E", headline: "Save this and build your version. Drop your routine below.", slideNum: 6 },
    ],
  },
  ai: {
    topic: "10 AI prompts saving me 3 hours every day",
    slides: [
      { type: "HOOK",      accent: "#7C3AED", headline: "10 AI prompts that save me 3 hours every single day", slideNum: 1 },
      { type: "STAT",      accent: "#00C2A8", headline: "40%", sub: "productivity boost for workers who use AI tools daily (Stanford, 2024)", slideNum: 2 },
      { type: "TIP",       accent: "#F59E0B", headline: "Use AI for first drafts, not final work", sub: "Your job: set direction + inject voice. AI's job: handle structure.", slideNum: 3 },
      { type: "TIP",       accent: "#3B82F6", headline: "Build a prompt library", sub: "Save your best prompts as templates. Reuse them every week.", slideNum: 4 },
      { type: "CHECKLIST", accent: "#10B981", headline: "Daily AI stack:\n✓ Claude (writing + thinking)\n✓ ChatGPT (brainstorming)\n✓ Midjourney (visuals)\n✓ Notion AI (notes)", slideNum: 5 },
      { type: "CTA",       accent: "#F43F5E", headline: "Save this. Your competitors are already using these.", slideNum: 6 },
    ],
  },
};

function pickPreset(input: string) {
  const lower = input.toLowerCase();
  if (lower.match(/linkedin|follow|audience|reach|social|content creator/)) return DEMO_PRESETS.linkedin;
  if (lower.match(/morning|routine|habit|productivity|wake|sleep|focus/)) return DEMO_PRESETS.productivity;
  if (lower.match(/ai|tool|gpt|prompt|claude|chatgpt|tech|software/)) return DEMO_PRESETS.ai;
  const keys = Object.keys(DEMO_PRESETS);
  return DEMO_PRESETS[keys[input.length % keys.length]];
}

const SHOWCASE_ROW_1: DemoSlide[] = [
  { type: "HOOK",        accent: "#00C2A8", headline: "7 content frameworks that built 100K+ audiences", slideNum: 1 },
  { type: "STAT",        accent: "#F59E0B", headline: "3×", sub: "more saves for carousel posts vs single images", slideNum: 2 },
  { type: "TIP",         accent: "#3B82F6", headline: "End every slide with one actionable insight", sub: "Actionability = saves. Saves = reach.", slideNum: 3 },
  { type: "QUOTE",       accent: "#7C3AED", headline: "\"Consistency beats perfection. Ship before you're ready.\"", slideNum: 4 },
  { type: "CHECKLIST",   accent: "#10B981", headline: "Viral formula:\n✓ Curiosity hook\n✓ Proof\n✓ Value\n✓ CTA", slideNum: 5 },
  { type: "STAT",        accent: "#F43F5E", headline: "65%", sub: "of LinkedIn engagement comes from carousels", slideNum: 6 },
  { type: "TIP",         accent: "#F59E0B", headline: "Repurpose your best carousel every quarter", sub: "New followers haven't seen it. Old ones have forgotten it.", slideNum: 7 },
  { type: "HOOK",        accent: "#00C2A8", headline: "Stop posting opinions. Post frameworks your audience can steal.", slideNum: 8 },
];

const SHOWCASE_ROW_2: DemoSlide[] = [
  { type: "CTA",         accent: "#F43F5E", headline: "Follow for tactical growth content every week.", slideNum: 1 },
  { type: "TIP",         accent: "#7C3AED", headline: "Your hook is 80% of your results", sub: "Spend 80% of your writing time on the first slide.", slideNum: 2 },
  { type: "STAT",        accent: "#3B82F6", headline: "20K", sub: "followers gained from a single viral carousel this year", slideNum: 3 },
  { type: "CHECKLIST",   accent: "#10B981", headline: "Daily post checklist:\n✓ Written before 9am\n✓ Hook tested\n✓ CTA clear\n✓ Image attached", slideNum: 4 },
  { type: "QUOTE",       accent: "#F59E0B", headline: "\"The riches are in the niches. Go deep, not wide.\"", slideNum: 5 },
  { type: "BEFORE/AFTER",accent: "#00C2A8", headline: "Before: generic tips everyone knows", sub: "After: specific numbers and stories nobody else shares", slideNum: 6 },
  { type: "TIP",         accent: "#F43F5E", headline: "Use contrast to drive saves", sub: "Before/After slides convert 2× better than pure value posts.", slideNum: 7 },
  { type: "HOOK",        accent: "#7C3AED", headline: "I analyzed 500 viral posts. Here's the only pattern that matters.", slideNum: 8 },
];

type BillingPeriod = "monthly" | "quarterly" | "annual";

interface Plan {
  name: string; tag?: string; accent: string;
  prices: { monthly: number; quarterly: number; annual: number };
  carousels: number | "unlimited"; extraPer?: number; seats?: number;
  features: string[]; cta: string; highlight: boolean;
  stripeIds: { monthly: string; quarterly: string; annual: string };
}

const PLANS: Plan[] = [
  {
    name: "Starter", accent: "#00C2A8",
    prices: { monthly: 12, quarterly: 10.8, annual: 9 },
    carousels: 30, extraPer: 0.45,
    features: ["30 carousels / month","All 8 slide templates","PNG export (ZIP)","Instagram, LinkedIn, X","$0.45 per extra carousel"],
    cta: "Start Starter", highlight: false,
    stripeIds: { monthly: "price_STARTER_MONTHLY", quarterly: "price_STARTER_QUARTERLY", annual: "price_STARTER_ANNUAL" },
  },
  {
    name: "Pro", tag: "Most popular", accent: "#7C3AED",
    prices: { monthly: 29, quarterly: 26.1, annual: 21.75 },
    carousels: 75, extraPer: 0.40,
    features: ["75 carousels / month","Style Library (RAG)","URL + transcript input","Priority generation","$0.40 per extra carousel"],
    cta: "Get Pro", highlight: true,
    stripeIds: { monthly: "price_PRO_MONTHLY", quarterly: "price_PRO_QUARTERLY", annual: "price_PRO_ANNUAL" },
  },
  {
    name: "Agency", accent: "#3B82F6",
    prices: { monthly: 79, quarterly: 71.1, annual: 59.25 },
    carousels: 250, extraPer: 0.35, seats: 5,
    features: ["250 carousels / month","5 team seats","Shared style library","Custom brand presets","$0.35 per extra carousel"],
    cta: "Get Agency", highlight: false,
    stripeIds: { monthly: "price_AGENCY_MONTHLY", quarterly: "price_AGENCY_QUARTERLY", annual: "price_AGENCY_ANNUAL" },
  },
];

const CREDIT_PACKS = [
  { credits: 5,  price: 3.99,  priceEach: 0.80, stripeId: "price_CREDITS_5"  },
  { credits: 20, price: 11.99, priceEach: 0.60, stripeId: "price_CREDITS_20" },
  { credits: 60, price: 29.99, priceEach: 0.50, stripeId: "price_CREDITS_60" },
];

// ─── Grain overlay — adds film-like texture to the whole page ────────────────

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    />
  );
}

// ─── Magnetic button hook ─────────────────────────────────────────────────────
// Wrap any element with this ref and it'll attract/spring away from the cursor.

function useMagnetic(ref: { readonly current: HTMLElement | null }, strength = 0.32) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * strength;
      const dy = (e.clientY - r.top  - r.height / 2) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.32, ease: "power2.out" });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.55)" });

    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}

// ─── TwoLayerMagnetic — shell + inner content move at different rates ─────────
// The button shell moves 32% toward cursor. The inner content moves 55%.
// The gap between them creates the sensation of physical depth inside the button.

function TwoLayerMagnetic({
  children,
  shellStrength = 0.32,
  innerStrength = 0.55,
}: {
  children: React.ReactNode;
  shellStrength?: number;
  innerStrength?: number;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const onMove = (e: MouseEvent) => {
      const r  = shell.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width  / 2;
      const dy = e.clientY - r.top  - r.height / 2;
      gsap.to(shell, { x: dx * shellStrength, y: dy * shellStrength, duration: 0.32, ease: "power2.out" });
      gsap.to(inner, { x: dx * innerStrength, y: dy * innerStrength, duration: 0.28, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(shell, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.55)" });
      gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.55)" });
    };

    shell.addEventListener("mousemove",  onMove);
    shell.addEventListener("mouseleave", onLeave);
    return () => {
      shell.removeEventListener("mousemove",  onMove);
      shell.removeEventListener("mouseleave", onLeave);
    };
  }, [shellStrength, innerStrength]);

  return (
    <div ref={shellRef} style={{ display: "inline-flex", willChange: "transform" }}>
      <div ref={innerRef} style={{ display: "inline-flex", willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

// ─── MockCard ─────────────────────────────────────────────────────────────────

function MockCard({
  type, accent, headline, sub, slideNum = 1, totalSlides = 6, compact = false,
}: {
  type: string; accent: string; headline: string; sub?: string;
  slideNum?: number; totalSlides?: number; compact?: boolean;
}) {
  const w = compact ? "w-36" : "w-52";
  return (
    <div
      className={`${w} rounded-2xl overflow-hidden flex flex-col select-none flex-shrink-0 transition-all duration-300`}
      style={{
        aspectRatio: "4/5",
        background: "linear-gradient(150deg,#161616 0%,#0D0D0D 100%)",
        border: `1px solid ${accent}22`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px ${accent}12`,
      }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />
      <div className="flex-1 p-4 flex flex-col">
        <span className="text-[7px] uppercase tracking-[0.28em] font-black mb-3"
          style={{ color: accent, fontFamily: BG }}>{type}</span>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[10px] font-black text-white leading-snug whitespace-pre-line"
            style={{ fontFamily: BG }}>{headline}</p>
          {sub && (
            <p className="text-[8px] text-white/40 mt-1.5 leading-snug"
              style={{ fontFamily: DM }}>{sub}</p>
          )}
        </div>
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: Math.min(totalSlides, 5) }).map((_, i) => (
            <div key={i} className="rounded-full flex-shrink-0"
              style={{
                width:  i === slideNum - 1 ? 12 : 3,
                height: 2.5,
                background: i === slideNum - 1 ? accent : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }} />
          ))}
          <span className="ml-auto text-[7px]"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}>
            {slideNum}/{totalSlides}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DeepCardDeck ─────────────────────────────────────────────────────────────
// 3-card floating stack with perspective tilt on mouse + independent float timelines.

function DeepCardDeck() {
  const deckRef  = useRef<HTMLDivElement>(null);
  const backRef  = useRef<HTMLDivElement>(null);
  const midRef   = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    // Independent floating timelines — staggered phase so they never sync
    const tlBack  = gsap.to(backRef.current,  { y: -14, duration: 5.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.9 });
    const tlMid   = gsap.to(midRef.current,   { y: -18, duration: 4.7, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.4 });
    const tlFront = gsap.to(frontRef.current, { y: -11, duration: 4.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // quickTo for butter-smooth perspective tilt
    const qRotX = gsap.quickTo(deck, "rotateX", { duration: 0.55, ease: "power2.out" });
    const qRotY = gsap.quickTo(deck, "rotateY", { duration: 0.55, ease: "power2.out" });

    const onMove  = (e: MouseEvent) => {
      const r = deck.getBoundingClientRect();
      qRotY( (e.clientX - r.left - r.width  / 2) / (r.width  / 2) * 14);
      qRotX(-(e.clientY - r.top  - r.height / 2) / (r.height / 2) * 10);
    };
    const onLeave = () => { qRotX(0); qRotY(0); };

    deck.addEventListener("mousemove",  onMove);
    deck.addEventListener("mouseleave", onLeave);

    return () => {
      tlBack.kill(); tlMid.kill(); tlFront.kill();
      deck.removeEventListener("mousemove",  onMove);
      deck.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={deckRef}
      className="relative w-80 h-[440px]"
      style={{ perspective: "1200px", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Ambient glow behind cards */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 52%, rgba(0,194,168,0.18) 0%, transparent 68%)",
          animation: "glow-pulse 4s ease-in-out infinite",
        }} />

      {/* Back card — deepest z-plane */}
      <div className="absolute" style={{
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%) rotate(-10deg) translate(-38px,34px) translateZ(-80px)",
        zIndex: 1, opacity: 0.72,
      }}>
        <div ref={backRef}>
          <MockCard type="CTA" accent="#7C3AED" headline="Follow for weekly growth frameworks that actually work" slideNum={6} totalSlides={6} />
        </div>
      </div>

      {/* Mid card */}
      <div className="absolute" style={{
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%) rotate(-3deg) translate(-14px,13px) translateZ(-30px)",
        zIndex: 2,
      }}>
        <div ref={midRef}>
          <MockCard type="STAT" accent="#F59E0B" headline="87%" sub="of top posts use a strong hook slide" slideNum={3} totalSlides={6} />
        </div>
      </div>

      {/* Front card — nearest the viewer */}
      <div className="absolute" style={{
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%) rotate(4deg) translate(10px,-10px)",
        zIndex: 3,
      }}>
        <div ref={frontRef}>
          <MockCard type="HOOK" accent="#00C2A8" headline="3 habits that doubled my LinkedIn reach in 30 days" slideNum={1} totalSlides={6} />
        </div>
      </div>
    </div>
  );
}

// ─── GSAP scroll-reveal primitives ───────────────────────────────────────────

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 40, filter: "blur(6px)" });
    const trigger = ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.85, delay, ease: "expo.out", clearProps: "y,filter",
      }),
    });
    return () => trigger.kill();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

function SlideIn({ children, from = "left", delay = 0, className }: {
  children: React.ReactNode; from?: "left" | "right"; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, x: from === "left" ? -64 : 64, rotateY: from === "left" ? -14 : 14, transformPerspective: 900 });
    const trigger = ScrollTrigger.create({
      trigger: el, start: "top 87%", once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, x: 0, rotateY: 0,
        duration: 0.85, delay, ease: "expo.out", clearProps: "x,rotateY,transformPerspective",
      }),
    });
    return () => trigger.kill();
  }, [from, delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

// ─── PinnedScene — scroll-pinned camera-zoom scene ───────────────────────────

function PinnedScene() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.set(".pz-tagline, .pz-sub", { opacity: 0, y: 36, filter: "blur(4px)" });
      gsap.set(".pz-line", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el, start: "top top", end: "+=220%",
          pin: true, scrub: 1.4, anticipatePin: 1,
        },
      });

      tl
        .from(".pz-center-card", { scale: 0.2, opacity: 0, duration: 1, ease: "expo.out" })
        .to(".pz-side-left",  { x: -200, opacity: 0, scale: 0.72, filter: "blur(8px)",  duration: 0.7 }, 0)
        .to(".pz-side-right", { x:  200, opacity: 0, scale: 0.72, filter: "blur(8px)",  duration: 0.7 }, 0)
        .to(".pz-far-left",   { x: -340, opacity: 0, filter: "blur(14px)", duration: 0.8 }, 0)
        .to(".pz-far-right",  { x:  340, opacity: 0, filter: "blur(14px)", duration: 0.8 }, 0)
        .to(".pz-tagline",   { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 }, 0.68)
        .to(".pz-line",      { scaleX: 1, duration: 0.4 }, 0.72)
        .to(".pz-sub",       { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, 0.84);

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#060606" }}
    >
      {/* Ambient radial light */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 48% at 50% 55%, rgba(0,194,168,0.07) 0%, rgba(124,58,237,0.04) 50%, transparent 70%)",
      }} />

      {/* Far-left card */}
      <div className="pz-far-left absolute hidden md:block pointer-events-none"
        style={{ left: "1%", top: "50%", transform: "translateY(-54%) scale(0.52)", opacity: 0.18, filter: "blur(3px)", zIndex: 1 }}>
        <MockCard type="QUOTE" accent="#3B82F6" headline={`"Consistency\nbeats perfection."`} compact slideNum={4} totalSlides={6} />
      </div>

      {/* Left card */}
      <div className="pz-side-left absolute hidden md:block pointer-events-none"
        style={{ left: "9%", top: "50%", transform: "translateY(-50%) scale(0.74)", opacity: 0.45, zIndex: 2 }}>
        <MockCard type="STAT" accent="#F59E0B" headline="87%" sub="of viral posts lead with a curiosity-gap hook" compact slideNum={2} totalSlides={6} />
      </div>

      {/* CENTER — camera target */}
      <div className="pz-center-card relative z-10">
        <MockCard type="HOOK" accent="#00C2A8" headline="3 habits that doubled my LinkedIn reach in 30 days" slideNum={1} totalSlides={6} />
      </div>

      {/* Right card */}
      <div className="pz-side-right absolute hidden md:block pointer-events-none"
        style={{ right: "9%", top: "50%", transform: "translateY(-50%) scale(0.74)", opacity: 0.45, zIndex: 2 }}>
        <MockCard type="CHECKLIST" accent="#10B981" headline={"Daily formula:\n✓ Hook\n✓ Proof\n✓ Value\n✓ CTA"} compact slideNum={4} totalSlides={6} />
      </div>

      {/* Far-right card */}
      <div className="pz-far-right absolute hidden md:block pointer-events-none"
        style={{ right: "1%", top: "50%", transform: "translateY(-54%) scale(0.52)", opacity: 0.18, filter: "blur(3px)", zIndex: 1 }}>
        <MockCard type="CTA" accent="#F43F5E" headline="Save this. Post it Monday." compact slideNum={6} totalSlides={6} />
      </div>

      {/* Text — revealed on scroll */}
      <div className="pz-tagline absolute bottom-32 left-0 right-0 text-center pointer-events-none"
        style={{ filter: "blur(4px)" }}>
        <h2 className="font-black text-white"
          style={{ fontFamily: BG, fontSize: "clamp(1.7rem,4.2vw,3rem)", letterSpacing: "-0.03em" }}>
          Every format. Pixel-perfect.
        </h2>
      </div>
      <div className="pz-line absolute bottom-[120px] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "min(480px,80vw)", height: "1px", background: "rgba(255,255,255,0.12)" }} />
      <div className="pz-sub absolute bottom-20 left-0 right-0 text-center pointer-events-none"
        style={{ filter: "blur(4px)" }}>
        <p className="text-sm tracking-widest font-medium" style={{ color: "rgba(255,255,255,0.34)", fontFamily: DM }}>
          Hook · Stat · Checklist · Quote · Before/After · CTA · Tip · Body
        </p>
      </div>
    </section>
  );
}

// ─── ShowcaseStrip ────────────────────────────────────────────────────────────

function ShowcaseStrip() {
  return (
    <div className="py-10 overflow-hidden space-y-3">
      <div className="showcase-row-1">
        <div className="flex gap-4 w-max" style={{ animation: "marquee 42s linear infinite" }}>
          {[...SHOWCASE_ROW_1, ...SHOWCASE_ROW_1].map((s, i) => (
            <MockCard key={i} compact {...s} totalSlides={6} />
          ))}
        </div>
      </div>
      <div className="showcase-row-2" style={{ opacity: 0.8 }}>
        <div className="flex gap-4 w-max" style={{ animation: "marquee 36s linear infinite reverse" }}>
          {[...SHOWCASE_ROW_2, ...SHOWCASE_ROW_2].map((s, i) => (
            <MockCard key={i} compact {...s} totalSlides={6} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DemoSection ──────────────────────────────────────────────────────────────

function DemoSection() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [slides, setSlides] = useState<DemoSlide[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);

  const generate = async () => {
    if (!input.trim()) return;
    setState("loading");
    await new Promise(r => setTimeout(r, 1600));
    setSlides(pickPreset(input).slides);
    setState("done");
  };

  const TOPICS = ["5 LinkedIn habits", "Morning routine", "AI productivity", "Content strategy"];

  return (
    <section className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(0,194,168,0.08)", border: "1px solid rgba(0,194,168,0.2)", color: "#00C2A8", fontFamily: DM }}>
              <Sparkles className="w-3 h-3" />No account required
            </div>
            <h2 className="font-black mb-3 leading-tight"
              style={{ fontFamily: BG, fontSize: "clamp(2rem,4.5vw,3.2rem)", letterSpacing: "-0.035em" }}>
              Try it right now
            </h2>
            <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>
              Type any topic. Watch Claude write every slide in under 2 seconds.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex gap-3 mb-4 max-w-2xl mx-auto">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              placeholder="Enter any topic (e.g. '5 productivity habits')…"
              className="flex-1 h-12 px-4 rounded-xl outline-none text-white text-[14px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: DM }}
            />
            <button
              onClick={generate}
              disabled={!input.trim() || state === "loading"}
              className="h-12 px-6 rounded-xl font-bold text-sm text-black flex items-center gap-2 flex-shrink-0 transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}
            >
              {state === "loading"
                ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <><Sparkles className="w-4 h-4" />Generate</>}
            </button>
          </div>

          {state === "idle" && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setInput(t)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all hover:bg-white/[0.07] hover:border-white/25"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </FadeUp>

        <AnimatePresence>
          {state === "done" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="overflow-x-auto pb-4 mt-8">
                <div className="flex gap-4 w-max mx-auto px-4">
                  {slides.map((slide, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.07, duration: 0.45, ease: easeExpo as [number,number,number,number] }}>
                      <MockCard {...slide} totalSlides={slides.length} />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="text-center mt-8 flex flex-col items-center gap-4">
                <button onClick={() => setShowPaywall(true)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 6px 28px rgba(0,194,168,0.3)", fontFamily: DM }}>
                  <Download className="w-4 h-4" />Export as PNGs
                </button>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>
                  Full export requires a free account. Download in seconds.
                </p>
                <button onClick={generate}
                  className="text-[12px] underline underline-offset-2 transition-colors hover:text-white/60"
                  style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>
                  ↺ Generate again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaywall && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPaywall(false)}
              style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm p-8 rounded-3xl text-center"
                style={{ background: "#111", border: "1px solid rgba(0,194,168,0.2)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,194,168,0.1)" }}>
                  <Download className="w-6 h-6" style={{ color: "#00C2A8" }} />
                </div>
                <h3 className="font-black text-xl mb-2" style={{ fontFamily: BG }}>Export your carousel</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.48)", fontFamily: DM }}>
                  Create a free account to download your PNG files. Takes 30 seconds.
                </p>
                <Link href="/signup"
                  className="block w-full py-3 rounded-xl font-bold text-sm text-black mb-3 transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
                  Create free account →
                </Link>
                <button onClick={() => setShowPaywall(false)}
                  className="text-xs w-full py-2"
                  style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>Maybe later</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── HowItWorks — editorial 3-column redesign ─────────────────────────────────

const HOW_STEPS = [
  {
    step: "01",
    title: "Give it your input",
    desc: "Type a topic, paste an article URL, or drop in a YouTube transcript. Scrollr handles the extraction automatically.",
    accent: "#00C2A8",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    step: "02",
    title: "Claude writes every slide",
    desc: "Generates a hook, 5–8 body slides from 8 viral formats, and a CTA — all optimized for your platform and copy science.",
    accent: "#7C3AED",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    step: "03",
    title: "Review, edit, export",
    desc: "Preview all slides, make quick inline edits, then download a ZIP of high-res PNGs ready to schedule.",
    accent: "#F59E0B",
    icon: <Download className="w-5 h-5" />,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="py-28 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.28em] font-black mb-4"
            style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>
            How it works
          </p>
          <h2 className="font-black mb-16"
            style={{ fontFamily: BG, fontSize: "clamp(2.2rem,5vw,3.8rem)", letterSpacing: "-0.04em" }}>
            Three steps to<br />export-ready slides
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {HOW_STEPS.map(({ step, title, desc, accent, icon }, i) => (
            <SlideIn key={step} from={i % 2 === 0 ? "left" : "right"} delay={i * 0.1}>
              <div
                className="relative p-7 rounded-3xl h-full flex flex-col overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.35s, box-shadow 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${accent}35`;
                  el.style.boxShadow  = `0 0 40px ${accent}0A, 0 24px 40px rgba(0,0,0,0.2)`;
                  el.style.transform  = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow  = "none";
                  el.style.transform  = "none";
                }}
              >
                {/* Large decorative step number */}
                <span
                  className="absolute -top-2 -right-1 font-black select-none pointer-events-none"
                  style={{ fontFamily: BG, fontSize: "7rem", color: accent, opacity: 0.07, lineHeight: 1, letterSpacing: "-0.05em" }}
                >
                  {step}
                </span>

                {/* Coloured top accent line */}
                <div className="absolute top-0 left-7 right-7 h-[2px] rounded-b-full"
                  style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                  style={{ background: `${accent}12`, color: accent }}>
                  {icon}
                </div>

                {/* Step label */}
                <p className="text-[10px] uppercase tracking-[0.25em] font-black mb-2"
                  style={{ color: accent, fontFamily: DM }}>{step}</p>

                <h3 className="font-black text-xl mb-3" style={{ fontFamily: BG }}>{title}</h3>
                <p className="text-[14px] leading-relaxed flex-1"
                  style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>{desc}</p>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AnimatedCounter ─────────────────────────────────────────────────────────
// GSAP-driven number increment that fires once on scroll-enter.
// The tick is attached to GSAP's internal ticker so it stays in sync with Lenis.

function AnimatedCounter({
  to,
  duration = 1.8,
  prefix = "",
  suffix = "",
}: { to: number; duration?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    el.textContent = prefix + "0" + suffix;

    const trigger = ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: to, duration, ease: "expo.out",
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      },
    });
    return () => trigger.kill();
  }, [to, duration, prefix, suffix]);

  return <span ref={ref} />;
}

// ─── StatsBand ────────────────────────────────────────────────────────────────

const STATS_DATA = [
  { value: 2,   suffix: "s",  label: "average generation time" },
  { value: 8,   suffix: "",   label: "viral slide formats built-in" },
  { value: 3,   suffix: "×",  label: "more saves vs. single images" },
  { value: 500, suffix: "+",  label: "carousels shipped this week" },
];

function StatsBand() {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS_DATA.map(({ value, suffix, label }, i) => (
            <FadeUp key={label} delay={i * 0.07}>
              <div className="text-center">
                <div
                  className="font-black leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(3.5rem,7vw,6rem)",
                    color: i % 2 === 0 ? "#00C2A8" : "#7C3AED",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <AnimatedCounter to={value} suffix={suffix} />
                </div>
                <p
                  className="text-[13px] leading-snug"
                  style={{ color: "rgba(255,255,255,0.32)", fontFamily: DM }}
                >
                  {label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HorizontalProcess — pinned GSAP horizontal scroll ───────────────────────
//
// This is the scene that separates "$50K sites" from "$8K sites":
// The entire section scrolls HORIZONTALLY while vertical scroll position stays
// pinned. Each panel = one step of the process.
//
// Technique: GSAP ScrollTrigger pin + scrub, animating track.x from 0 → -(totalWidth).
// Lenis stays in sync because we run: lenis.on("scroll", ScrollTrigger.update).
//
// Each step has:
//   - Giant Bebas Neue watermark number (opacity 0.035) — the soul of the section
//   - Two-column layout: editorial copy left, rotating MockCard right
//   - Step progress indicator at the bottom of the copy column

const PROCESS_STEPS: Array<{
  num: string; label: string; accent: string;
  title: string; body: string;
  card: { type: string; accent: string; headline: string; sub?: string; slideNum: number; totalSlides: number };
}> = [
  {
    num: "01", label: "Input", accent: "#00C2A8",
    title: "Drop your\nraw idea",
    body: "Type a topic, paste an article URL, or drop a YouTube transcript. Scrollr strips the noise and extracts every angle worth posting about.",
    card: { type: "HOOK", accent: "#00C2A8", headline: "5 habits that tripled my LinkedIn reach in 30 days", slideNum: 1, totalSlides: 6 },
  },
  {
    num: "02", label: "Generate", accent: "#7C3AED",
    title: "Claude writes\nevery slide",
    body: "Hook opens with a curiosity gap. Body slides run under 22 words. Each format — stat, tip, quote, checklist — is calibrated for saves, not impressions.",
    card: { type: "STAT", accent: "#7C3AED", headline: "87%", sub: "of top posts start with a curiosity-gap hook", slideNum: 3, totalSlides: 6 },
  },
  {
    num: "03", label: "Refine", accent: "#F59E0B",
    title: "Tune it\nto your voice",
    body: "Inline edits in one click. Rephrase a slide. Swap the accent colour. Style Library remembers every brand signal you've ever uploaded.",
    card: { type: "TIP", accent: "#F59E0B", headline: "Post at 7am on weekdays", sub: "Peak LinkedIn hours — 3× more reach than afternoons.", slideNum: 2, totalSlides: 6 },
  },
  {
    num: "04", label: "Export", accent: "#F43F5E",
    title: "Post it.\nWatch it spread.",
    body: "High-res PNGs. ZIP download. Drag straight into Buffer, Later, or LinkedIn's scheduler. Done before your coffee cools.",
    card: { type: "CTA", accent: "#F43F5E", headline: "Follow for weekly growth frameworks that actually work.", slideNum: 6, totalSlides: 6 },
  },
];

function HorizontalProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const totalWidth = track.scrollWidth - container.offsetWidth;
      if (totalWidth <= 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start:   "top top",
          end:     () => `+=${totalWidth + window.innerHeight * 0.5}`,
          pin:      true,
          scrub:    1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -totalWidth, ease: "none" });

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="how"
      ref={containerRef}
      className="relative overflow-x-hidden md:overflow-hidden"
      style={{ minHeight: "100svh", background: "#040404" }}
    >
      {/* Fixed section label — doesn't scroll */}
      <div className="absolute top-8 left-8 z-10 hidden md:block">
        <p
          className="text-[11px] uppercase tracking-[0.28em] font-black"
          style={{ color: "rgba(255,255,255,0.16)", fontFamily: DM }}
        >
          How it works
        </p>
      </div>

      {/* Horizontal track — GSAP animates x on desktop; flex-col on mobile */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row h-full"
        style={{ width: `${PROCESS_STEPS.length * 100}vw` }}
      >
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.num}
            className="relative flex items-center flex-shrink-0"
            style={{
              width:     "100vw",
              minHeight: "80svh",
              height:    "100svh",
              padding:   "0 clamp(2rem,8vw,8rem)",
            }}
          >
            {/* ── Giant Bebas Neue watermark ────────────────────────────── */}
            {/* The number is SO large it wraps the entire panel.
                This is the "one thing people remember." */}
            <div
              className="absolute select-none pointer-events-none"
              style={{
                top: "50%", left: "-4vw",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-bebas)",
                fontSize: "48vw",
                color: step.accent,
                opacity: 0.032,
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                userSelect: "none",
              }}
              aria-hidden
            >
              {step.num}
            </div>

            {/* ── Two-column layout ─────────────────────────────────────── */}
            <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              {/* Left — editorial copy */}
              <div>
                {/* Step meta row */}
                <div className="flex items-center gap-3 mb-8">
                  <span
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "1.05rem",
                      color: step.accent,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {step.num}
                  </span>
                  <div style={{ height: "1px", width: 36, background: `${step.accent}44` }} />
                  <span
                    className="uppercase tracking-[0.24em] text-[10px] font-black"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Heading — Bricolage Grotesque tight */}
                <h2
                  className="font-black leading-[0.95] mb-6"
                  style={{
                    fontFamily: BG,
                    fontSize: "clamp(2.8rem,5vw,4.5rem)",
                    letterSpacing: "-0.04em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {step.title}
                </h2>

                {/* Body */}
                <p
                  className="leading-relaxed mb-10"
                  style={{ fontFamily: DM, fontSize: "1.0625rem", color: "rgba(255,255,255,0.42)", maxWidth: 440 }}
                >
                  {step.body}
                </p>

                {/* Progress dots — width animates via CSS on the active dot */}
                <div className="flex items-center gap-2">
                  {PROCESS_STEPS.map((_, j) => (
                    <div
                      key={j}
                      style={{
                        width:        j === i ? 28 : 5,
                        height:       2.5,
                        borderRadius: 999,
                        background:   j === i ? step.accent : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right — rotating MockCard with drop-shadow glow */}
              <div className="hidden md:flex justify-center items-center">
                <div
                  style={{
                    transform: `rotate(${i % 2 === 0 ? 3 : -3}deg)`,
                    filter: `drop-shadow(0 32px 64px ${step.accent}28)`,
                  }}
                >
                  <MockCard
                    type={step.card.type}
                    accent={step.card.accent}
                    headline={step.card.headline}
                    sub={step.card.sub}
                    slideNum={step.card.slideNum}
                    totalSlides={step.card.totalSlides}
                  />
                </div>
              </div>
            </div>

            {/* Right-edge divider between panels */}
            {i < PROCESS_STEPS.length - 1 && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1 pr-5"
                style={{ height: 80 }}
              >
                <div style={{ width: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
                <span
                  className="text-[9px] tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.12)", fontFamily: DM }}
                >→</span>
                <div style={{ width: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
        <div style={{ width: 24, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        <span
          className="text-[10px] tracking-[0.22em] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}
        >
          Scroll to explore
        </span>
        <div style={{ width: 24, height: "1px", background: "rgba(255,255,255,0.1)" }} />
      </div>
    </section>
  );
}

// ─── FeaturesBento ────────────────────────────────────────────────────────────

const BENTO_FEATURES = [
  { icon: <Download className="w-5 h-5" />, accent: "#3B82F6", title: "Export-ready PNGs", desc: "High-res PNG ZIP download. Straight to your scheduler." },
  { icon: <Zap className="w-5 h-5" />,      accent: "#F59E0B", title: "Multi-platform",   desc: "Instagram 4:5, LinkedIn 1:1, X 16:9. One input, three formats." },
  { icon: <BarChart3 className="w-5 h-5" />,accent: "#F43F5E", title: "Viral copy science",desc: "Hooks under 12 words. Slides under 22. Written for saves." },
  { icon: <ListChecks className="w-5 h-5" />,accent: "#7C3AED",title: "8 slide formats",   desc: "Hook, body, quote, stat, checklist, before/after, tip, CTA." },
];

function FeaturesBento() {
  return (
    <section id="features" className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.28em] font-black mb-4"
            style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>Features</p>
          <h2 className="font-black mb-16"
            style={{ fontFamily: BG, fontSize: "clamp(2.2rem,5vw,3.8rem)", letterSpacing: "-0.04em" }}>
            Everything you need<br />to post consistently
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hero feature card — spans 2 cols */}
          <div className="bento-card md:col-span-2">
            <div
              className="bento-card-wrap h-full p-8 rounded-3xl flex flex-col"
              style={{
                background: "linear-gradient(135deg,rgba(0,194,168,0.07) 0%,rgba(0,0,0,0) 60%)",
                border: "1px solid rgba(0,194,168,0.15)",
                boxShadow: "0 0 0 0 rgba(0,194,168,0)",
                transition: "box-shadow 0.35s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(0,194,168,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <BookImage className="w-6 h-6 mb-6" style={{ color: "#00C2A8" }} />
              <h3 className="text-xl font-black mb-3" style={{ fontFamily: BG }}>Style Library</h3>
              <p className="text-[14px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.46)", fontFamily: DM }}>
                Upload carousels you love. Claude vision classifies every slide — layout, hierarchy, palette, style.
                Future generations search your library semantically and match those patterns to your new content.{" "}
                <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                  The more you upload, the sharper it gets.
                </span>
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-widest font-black"
                  style={{ color: "#00C2A8", fontFamily: DM }}>RAG-powered</span>
                <div className="h-[1px] flex-1" style={{ background: "rgba(0,194,168,0.18)" }} />
              </div>
            </div>
          </div>

          {/* Small feature cards */}
          {BENTO_FEATURES.map(({ icon, accent, title, desc }, i) => (
            <div key={title} className="bento-card">
              <div
                className="bento-card-wrap p-6 rounded-3xl h-full"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${accent}28`;
                  el.style.boxShadow  = `0 0 32px ${accent}08`;
                  el.style.transform  = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow  = "none";
                  el.style.transform  = "none";
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${accent}12`, color: accent }}>{icon}</div>
                <h3 className="font-black mb-2" style={{ fontFamily: BG }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontFamily: DM }}>{desc}</p>
              </div>
            </div>
          ))}

          {/* Wide bottom card */}
          <div className="bento-card md:col-span-3">
            <div
              className="bento-card-wrap p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg,rgba(124,58,237,0.07) 0%,rgba(0,0,0,0) 50%)",
                border: "1px solid rgba(124,58,237,0.14)",
              }}
            >
              <div>
                <Sparkles className="w-6 h-6 mb-4" style={{ color: "#7C3AED" }} />
                <h3 className="text-xl font-black mb-2" style={{ fontFamily: BG }}>Topic → Carousel in seconds</h3>
                <p className="text-[14px] leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>
                  Type a topic, paste an article URL, or drop in a YouTube transcript. Claude handles extraction, writing,
                  and formatting. Your only job is deciding what to post.
                </p>
              </div>
              <Link href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white flex-shrink-0 transition-all hover:brightness-110"
                style={{ background: "rgba(124,58,237,0.22)", border: "1px solid rgba(124,58,237,0.32)", fontFamily: DM }}>
                Try it free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
//
// Editorial quote grid: one hero card (spans 2 cols) + 4 flanking cards.
// Each has a subtle top-edge glow matching the author's platform colour.
// Hover: 3D lift + reveal a faint ambient gradient.
// No stock photos — just initials in a coloured circle. Honest. Credible.

const TESTIMONIALS = [
  {
    quote: "I was spending 4 hours a week writing carousels. Now it's 20 minutes. The hooks it generates are honestly better than what I came up with after staring at a blank doc for an hour.",
    name: "Jordan K.",
    role: "LinkedIn Creator · 44K followers",
    accent: "#0A66C2",
    initial: "JK",
    featured: true,
  },
  {
    quote: "Generated a carousel in 45 seconds and it became my highest-saving post ever.",
    name: "Priya M.",
    role: "Instagram — Marketing Consultant",
    accent: "#E1306C",
    initial: "PM",
    featured: false,
  },
  {
    quote: "The Style Library is the secret weapon. It remembers my tone so each carousel sounds like me, not like a robot.",
    name: "Alex R.",
    role: "X / Twitter — Growth Strategist",
    accent: "#d4d4d4",
    initial: "AR",
    featured: false,
  },
  {
    quote: "My agency uses this for 12 clients. The time savings are insane — we went from 2 days of content production to a single afternoon.",
    name: "Camila S.",
    role: "Social Media Agency — Director",
    accent: "#7C3AED",
    initial: "CS",
    featured: false,
  },
  {
    quote: "Posted the first carousel Scrollr generated for me. 3.8K saves in 48 hours. My previous best was 400.",
    name: "Dan T.",
    role: "LinkedIn — B2B SaaS Founder",
    accent: "#00C2A8",
    initial: "DT",
    featured: false,
  },
];

function TestimonialCard({
  quote, name, role, accent, initial, featured = false, delay = 0,
}: (typeof TESTIMONIALS)[0] & { delay?: number }) {
  return (
    <FadeUp delay={delay}>
      <div
        className="relative h-full p-7 rounded-3xl flex flex-col overflow-hidden group"
        style={{
          background:  featured
            ? `linear-gradient(150deg,${accent}0E 0%,rgba(0,0,0,0) 60%)`
            : "rgba(255,255,255,0.02)",
          border: `1px solid ${featured ? `${accent}28` : "rgba(255,255,255,0.06)"}`,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-5px) scale(1.006)";
          el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px ${accent}18`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "";
          el.style.boxShadow = "";
        }}
      >
        {/* Coloured top edge */}
        <div
          className="absolute top-0 left-8 right-8 h-[1.5px] rounded-b-full"
          style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }}
        />

        {/* Quote mark */}
        <span
          className="absolute top-5 right-6 select-none"
          style={{
            fontFamily: BG, fontSize: featured ? "5rem" : "3.5rem",
            color: accent, opacity: 0.06, lineHeight: 1, fontWeight: 900,
          }}
        >
          "
        </span>

        {/* Quote */}
        <p
          className="flex-1 leading-relaxed mb-6"
          style={{
            fontFamily: DM,
            fontSize: featured ? "1.1rem" : "0.9375rem",
            color: "rgba(255,255,255,0.62)",
            lineHeight: 1.75,
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-[11px]"
            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}28`, fontFamily: BG }}
          >
            {initial}
          </div>
          <div>
            <p className="font-black text-[13px]" style={{ color: "rgba(255,255,255,0.85)", fontFamily: BG }}>{name}</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>{role}</p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS;
  const [row1, row2] = [rest.slice(0, 2), rest.slice(2)];

  return (
    <section className="py-28 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.28em] font-black mb-4"
            style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>
            From creators
          </p>
          <h2 className="font-black mb-16"
            style={{ fontFamily: BG, fontSize: "clamp(2.2rem,5vw,3.8rem)", letterSpacing: "-0.04em" }}>
            The proof is in<br />the saves.
          </h2>
        </FadeUp>

        {/* Main grid: featured (2/3) + first row (1/3 each) */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <TestimonialCard {...featured} delay={0} />
          </div>
          <div className="flex flex-col gap-4">
            {row1.map((t, i) => (
              <TestimonialCard key={t.name} {...t} delay={0.08 + i * 0.07} />
            ))}
          </div>
        </div>

        {/* Second row — 3 equal columns */}
        <div className="grid md:grid-cols-3 gap-4">
          {row2.map((t, i) => (
            <TestimonialCard key={t.name} {...t} delay={0.18 + i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

function PricingSection() {
  const [billing, setBilling]     = useState<BillingPeriod>("monthly");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const startCheckout = async (plan: Plan) => {
    setCheckingOut(plan.name);
    const priceId = plan.stripeIds[billing];
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName: plan.name, billing }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch { window.location.href = "/signup"; }
    finally { setCheckingOut(null); }
  };

  const startCreditsCheckout = async (pack: (typeof CREDIT_PACKS)[0]) => {
    setCheckingOut(`credits-${pack.credits}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: pack.stripeId, planName: `${pack.credits} Credits`, billing: "once", type: "credits" }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch { window.location.href = "/signup"; }
    finally { setCheckingOut(null); }
  };

  const discountLabel: Record<BillingPeriod, string | null> = {
    monthly: null, quarterly: "Save 10%", annual: "Save 25%",
  };

  return (
    <section id="pricing" className="py-28 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.28em] font-black mb-4"
              style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>Pricing</p>
            <h2 className="font-black mb-3"
              style={{ fontFamily: BG, fontSize: "clamp(2.2rem,5vw,3.8rem)", letterSpacing: "-0.04em" }}>
              Pricing that makes sense
            </h2>
            <p className="mb-8 text-[15px]" style={{ color: "rgba(255,255,255,0.36)", fontFamily: DM }}>
              Start free. 3 carousels on us — no card, no catch.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["monthly", "quarterly", "annual"] as BillingPeriod[]).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className="relative px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                  style={{
                    background: billing === b ? "rgba(255,255,255,0.09)" : "transparent",
                    color: billing === b ? "#fff" : "rgba(255,255,255,0.38)",
                    fontFamily: DM,
                  }}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  {discountLabel[b] && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-black"
                      style={{ background: "rgba(0,194,168,0.18)", color: "#00C2A8" }}>
                      {discountLabel[b]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Free tier callout */}
        <FadeUp delay={0.05}>
          <div className="mb-6 p-5 rounded-2xl flex items-center gap-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,194,168,0.09)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#00C2A8" }} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm text-white" style={{ fontFamily: BG }}>Free — 3 carousels, no card</p>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>
                Try every slide format, export PNGs, test all platforms. Free forever.
              </p>
            </div>
            <Link href="/signup"
              className="px-4 py-2 rounded-xl text-sm font-black text-black flex-shrink-0 transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
              Start free →
            </Link>
          </div>
        </FadeUp>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan, i) => {
            const price = plan.prices[billing];
            const isChecking = checkingOut === plan.name;
            return (
              <SlideIn key={plan.name} from={i === 0 ? "left" : i === 2 ? "right" : "left"} delay={i * 0.08}>
                <div className="relative p-7 rounded-3xl h-full flex flex-col"
                  style={{
                    background: plan.highlight
                      ? `linear-gradient(150deg,${plan.accent}10 0%,transparent 55%)`
                      : "rgba(255,255,255,0.02)",
                    border: plan.highlight ? `1px solid ${plan.accent}32` : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: plan.highlight ? `0 0 60px ${plan.accent}0E` : "none",
                  }}>
                  {plan.tag && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black text-black tracking-wider"
                      style={{ background: `linear-gradient(135deg,${plan.accent},${plan.accent}CC)` }}>
                      {plan.tag.toUpperCase()}
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-2"
                      style={{ color: "rgba(255,255,255,0.32)", fontFamily: DM }}>{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black" style={{ fontFamily: BG, fontSize: "2.8rem", letterSpacing: "-0.04em" }}>
                        ${price.toFixed(price % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>/ mo</span>
                    </div>
                    {billing !== "monthly" && (
                      <p className="text-xs mt-0.5" style={{ color: plan.accent, fontFamily: DM }}>
                        Billed {billing === "quarterly" ? "every 3 months" : "annually"}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px]">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.accent }} />
                        <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: DM }}>{f}</span>
                      </li>
                    ))}
                    {plan.seats && (
                      <li className="flex items-start gap-2.5 text-[13px]">
                        <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.accent }} />
                        <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: DM }}>{plan.seats} team seats</span>
                      </li>
                    )}
                  </ul>
                  <button
                    onClick={() => startCheckout(plan)}
                    disabled={isChecking}
                    className="block w-full text-center py-3 rounded-xl font-black text-[13px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    style={plan.highlight
                      ? { background: `linear-gradient(135deg,${plan.accent},${plan.accent}CC)`, color: "#fff", fontFamily: DM }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.65)", fontFamily: DM }}>
                    {isChecking
                      ? <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : plan.cta}
                  </button>
                </div>
              </SlideIn>
            );
          })}
        </div>

        {/* Credit packs */}
        <FadeUp delay={0.2}>
          <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] uppercase tracking-[0.28em] font-black mb-2"
              style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>Pay-per-use</p>
            <h3 className="font-black mb-1" style={{ fontFamily: BG, fontSize: "1.25rem" }}>Just need a few? Buy credits.</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
              Credits never expire. Stack with any subscription.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {CREDIT_PACKS.map(pack => {
                const isChecking = checkingOut === `credits-${pack.credits}`;
                return (
                  <button key={pack.credits}
                    onClick={() => startCreditsCheckout(pack)}
                    disabled={isChecking}
                    className="p-5 rounded-2xl text-left group"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      transition: "border-color 0.3s, background 0.3s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.borderColor = "rgba(0,194,168,0.22)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.025)";
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                    }}>
                    <p className="font-black text-xl text-white mb-0.5" style={{ fontFamily: BG }}>{pack.credits} credits</p>
                    <p className="font-black text-2xl mb-1" style={{ color: "#00C2A8", fontFamily: BG }}>${pack.price}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.32)", fontFamily: DM }}>${pack.priceEach.toFixed(2)} each</p>
                    <ChevronRight className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#00C2A8" }} />
                  </button>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Greek art illustration (unchanged — it's already excellent) ──────────────

function GreekArt() {
  const A = "#C8962A", D = "#A07018", C = "#F0DFA0";
  return (
    <svg viewBox="0 0 480 270" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, display: "block" }}>
      <defs>
        <radialGradient id="ambg" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor={A} stopOpacity="0.09" />
          <stop offset="100%" stopColor={A} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="240" cy="200" rx="220" ry="110" fill="url(#ambg)" />
      {([[42,18],[78,8],[120,28],[168,6],[210,20],[270,14],[320,28],[372,8],[418,22],[450,38],[95,38],[345,36]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} fill={C} opacity={0.18 + (i % 4) * 0.1} />
      ))}
      <rect x="56" y="44" width="368" height="16" fill={A} opacity="0.1" />
      {[150, 194, 238, 282, 326].map(cx => (
        <g key={cx}>
          <rect x={cx - 8} y="44" width="16" height="16" fill={A} opacity="0.28" />
          <line x1={cx - 3} y1="44" x2={cx - 3} y2="60" stroke="#060400" strokeWidth="2.5" opacity="0.45" />
          <line x1={cx + 3} y1="44" x2={cx + 3} y2="60" stroke="#060400" strokeWidth="2.5" opacity="0.45" />
        </g>
      ))}
      <rect x="56" y="60" width="368" height="9" fill={A} opacity="0.52" />
      <rect x="56" y="51" width="38" height="9" rx="1" fill={A} opacity="0.78" />
      <path d="M60,60 L90,60 L87,71 L63,71 Z" fill={A} opacity="0.68" />
      <rect x="64" y="71" width="22" height="166" fill={A} opacity="0.42" />
      {[68, 73, 78, 83].map(x => <line key={x} x1={x} y1="71" x2={x} y2="237" stroke="#060400" strokeWidth="0.9" opacity="0.28" />)}
      <rect x="59" y="237" width="32" height="6" rx="1" fill={A} opacity="0.58" />
      <rect x="55" y="243" width="40" height="7" rx="1" fill={A} opacity="0.48" />
      <rect x="386" y="51" width="38" height="9" rx="1" fill={A} opacity="0.78" />
      <path d="M390,60 L420,60 L417,71 L393,71 Z" fill={A} opacity="0.68" />
      <rect x="394" y="71" width="22" height="166" fill={A} opacity="0.42" />
      {[398, 403, 408, 413].map(x => <line key={x} x1={x} y1="71" x2={x} y2="237" stroke="#060400" strokeWidth="0.9" opacity="0.28" />)}
      <rect x="389" y="237" width="32" height="6" rx="1" fill={A} opacity="0.58" />
      <rect x="385" y="243" width="40" height="7" rx="1" fill={A} opacity="0.48" />
      <rect x="55" y="250" width="370" height="5" rx="1" fill={A} opacity="0.16" />
      <circle cx="158" cy="143" r="12" fill={A} />
      <path d="M148,155 L136,250 L180,250 L168,155 Z" fill={A} opacity="0.72" />
      <path d="M168,165 L210,141 L215,150 L173,174 Z" fill={A} opacity="0.8" />
      <ellipse cx="213" cy="144" rx="6" ry="5" fill={A} opacity="0.68" />
      <rect x="224" y="220" width="32" height="30" rx="2" fill={A} opacity="0.12" />
      <circle cx="244" cy="162" r="11" fill={A} />
      <path d="M236,173 L228,220 L260,220 L252,173 Z" fill={A} opacity="0.68" />
      <path d="M228,220 L222,250 L240,250 L240,220 Z" fill={A} opacity="0.6" />
      <path d="M252,220 L252,250 L270,250 L260,220 Z" fill={A} opacity="0.6" />
      <path d="M236,192 L217,181 L219,189 L238,200 Z" fill={A} opacity="0.68" />
      <circle cx="215" cy="183" r="5" fill={A} opacity="0.62" />
      <circle cx="320" cy="147" r="11" fill={A} />
      <path d="M313,158 L305,250 L335,250 L327,158 Z" fill={A} opacity="0.7" />
      <path d="M313,170 L288,164 L287,174 L313,180 Z" fill={A} opacity="0.68" />
      <rect x="273" y="158" width="17" height="24" rx="4" fill={C} opacity="0.38" />
    </svg>
  );
}

// ─── AffiliateWaitlist ────────────────────────────────────────────────────────

function AffiliateWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      await fetch("/api/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* graceful */ }
    setStatus("done");
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 65% 50% at 50% 35%, rgba(55,32,0,0.28) 0%, transparent 65%)",
      }} />
      <div className="max-w-3xl mx-auto relative">
        <FadeUp>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6"
              style={{ background: "rgba(200,150,42,0.09)", border: "1px solid rgba(200,150,42,0.26)", color: "#C8962A", fontFamily: DM }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C8962A", opacity: 0.7 }} />
              Affiliate Program — Waitlist
            </div>
            <h2 className="font-black mb-3 leading-tight"
              style={{ fontFamily: BG, fontSize: "clamp(2.2rem,5.5vw,3.8rem)", letterSpacing: "-0.04em" }}>
              The Inner Circle
            </h2>
            <p className="mb-10 text-[15px]" style={{ color: "rgba(255,255,255,0.36)", fontFamily: DM }}>
              25% lifetime commission. No cap. Launching at $25K MRR.
            </p>
            <div className="flex justify-center mb-10"><GreekArt /></div>
            <div className="flex flex-wrap justify-center gap-10 mb-10">
              {([["25%","lifetime commission"],["$10","min payout"],["∞","no cap, ever"],["Monthly","auto payouts"]] as [string,string][]).map(([val,label]) => (
                <div key={label} className="text-center">
                  <div className="font-black text-xl mb-0.5" style={{ fontFamily: BG, color: "#C8962A" }}>{val}</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>{label}</div>
                </div>
              ))}
            </div>
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                  style={{ background: "rgba(200,150,42,0.12)", border: "1px solid rgba(200,150,42,0.3)" }}>
                  <Check className="w-5 h-5" style={{ color: "#C8962A" }} />
                </div>
                <p className="font-black" style={{ color: "#C8962A", fontFamily: BG }}>You're on the list.</p>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.32)", fontFamily: DM }}>We'll reach out when we launch.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="flex-1 h-11 px-4 rounded-xl outline-none text-white text-[14px]"
                  style={{ background: "rgba(200,150,42,0.06)", border: "1px solid rgba(200,150,42,0.2)", fontFamily: DM }} />
                <button type="submit" disabled={status === "loading"}
                  className="h-11 px-5 rounded-xl font-black text-[13px] flex items-center gap-2 flex-shrink-0 transition-all hover:brightness-110 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#C8962A,#E0B040)", color: "#0A0600", fontFamily: DM }}>
                  {status === "loading"
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : "Join waitlist"}
                </button>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FinalCTA — cinematic full-bleed section ──────────────────────────────────

function FinalCTA() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const primaryRef = useRef<HTMLAnchorElement>(null);

  return (
    <section className="relative py-32 px-4 overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(0,194,168,0.09) 0%, transparent 65%)" }} />

      {/* Background floating cards — purely decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[
          { top: "12%", left: "5%",  rotate: -18, scale: 0.45, opacity: 0.06, accent: "#00C2A8", type: "HOOK",   headline: "3 habits that doubled my reach" },
          { top: "60%", left: "2%",  rotate: 12,  scale: 0.38, opacity: 0.05, accent: "#7C3AED", type: "STAT",   headline: "87%" },
          { top: "20%", right: "3%", rotate: 14,  scale: 0.42, opacity: 0.06, accent: "#F59E0B", type: "TIP",    headline: "Post at 7am every weekday" },
          { top: "65%", right: "5%", rotate: -10, scale: 0.40, opacity: 0.05, accent: "#F43F5E", type: "CTA",    headline: "Follow for weekly tactics" },
        ].map((card, i) => (
          <div key={i} className="absolute" style={{
            top: card.top, left: (card as { left?: string }).left, right: (card as { right?: string }).right,
            transform: `rotate(${card.rotate}deg) scale(${card.scale})`,
            opacity: card.opacity, transformOrigin: "center",
          }}>
            <MockCard type={card.type} accent={card.accent} headline={card.headline} slideNum={1} totalSlides={6} />
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.3em] font-black mb-8"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: DM }}>
            Start creating
          </p>
          <h2 className="font-black mb-6 leading-[1.02]"
            style={{ fontFamily: BG, fontSize: "clamp(2.8rem,7vw,5.5rem)", letterSpacing: "-0.04em" }}>
            Stop staring at<br />a blank slide.
            <br /><span style={{ color: "#00C2A8" }}>Start posting.</span>
          </h2>

          {/* Divider */}
          <div className="w-16 h-[2px] mx-auto mb-8 rounded-full"
            style={{ background: "linear-gradient(90deg,transparent,#00C2A8,transparent)" }} />

          <p className="mb-12 text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.36)", fontFamily: DM }}>
            3 carousels free. No credit card. No catch.
          </p>

          {/* Two-layer magnetic CTA */}
          <TwoLayerMagnetic shellStrength={0.28} innerStrength={0.52}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-[15px] text-black transition-brightness hover:brightness-110 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg,#00C2A8,#00DFC8)",
                boxShadow: "0 20px 60px rgba(0,194,168,0.35), 0 0 0 1px rgba(0,194,168,0.18)",
                fontFamily: DM,
              }}
            >
              <Sparkles className="w-5 h-5" />
              Generate for free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </TwoLayerMagnetic>

          <p className="mt-5 text-[12px]" style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}>
            No credit card required · Instant access
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Landing page (root) ──────────────────────────────────────────────────────

export default function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Mouse position for hero parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, springGentle);
  const springY = useSpring(mouseY, springGentle);

  // Three distinct parallax layers — opposite phase creates depth
  const bgX    = useTransform(springX, [0, 1], [ 12, -12]);
  const bgY    = useTransform(springY, [0, 1], [  8,  -8]);
  const copyX  = useTransform(springX, [0, 1], [  4,  -4]);
  const copyY  = useTransform(springY, [0, 1], [  3,  -3]);
  const cardsX = useTransform(springX, [0, 1], [-20,  20]);
  const cardsY = useTransform(springY, [0, 1], [-14,  14]);

  // Magnetic primary hero CTA
  const heroCTARef = useRef<HTMLAnchorElement>(null);
  useMagnetic(heroCTARef, 0.3);

  // Page-level GSAP scroll effects
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero multi-depth parallax ──────────────────────────────────────────
      const heroTrigger = { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1.4 };
      gsap.to(".hero-copy",  { y: "-10%", ease: "none", scrollTrigger: heroTrigger });
      gsap.to(".hero-cards", { y: "-20%", ease: "none", scrollTrigger: { ...heroTrigger, scrub: 0.9 } });

      // ── Variable font-weight animation — the hero heading tightens as you
      //    scroll away, like the subject receding into the background.
      //    Bricolage Grotesque: weight 200 (ultra-thin) → 900 (ultra-black).
      //    On load = 900 (impactful). On scroll-out = 200 (ghosting away).
      gsap.fromTo(
        ".hero-copy",
        { fontVariationSettings: "'wght' 900" },
        {
          fontVariationSettings: "'wght' 200",
          ease: "none",
          scrollTrigger: { trigger: ".hero-section", start: "20% top", end: "90% top", scrub: 2 },
        }
      );

      // ── Clip-path section reveals ──────────────────────────────────────────
      // Each .clip-reveal section slides out from behind a clipping mask.
      // The effect: sections feel like they're being unveiled by the camera,
      // not just appearing on scroll — a key signal of award-site quality.
      gsap.utils.toArray<Element>(".clip-reveal").forEach((section) => {
        gsap.fromTo(
          section,
          { clipPath: "inset(6% 2% 6% 2% round 20px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "expo.out",
            duration: 1.2,
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          }
        );
      });

      // ── Bento cards — 3D lift from below ──────────────────────────────────
      gsap.utils.toArray<Element>(".bento-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 60, scale: 0.88, rotateX: 10,
          transformPerspective: 900, duration: 0.9,
          ease: "expo.out", delay: (i % 3) * 0.08,
          clearProps: "all",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      // ── Showcase strip — rows drift opposite on scroll (depth illusion) ───
      gsap.to(".showcase-row-1", {
        y: -32, ease: "none",
        scrollTrigger: { trigger: ".showcase-section", start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(".showcase-row-2", {
        y:  32, ease: "none",
        scrollTrigger: { trigger: ".showcase-section", start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const SLIDE_TYPES = ["Hook", "Checklist", "Quote", "Stat", "Before / After", "Tip", "CTA", "Body"];

  return (
    <div
      ref={pageRef}
      className="landing-page min-h-screen text-white overflow-x-hidden"
      style={{ background: "#050505" }}
    >
      {/* Grain texture — film-like depth */}
      <GrainOverlay />

      {/* Custom cursor */}
      <Cursor />

      {/* Fixed ambient mesh — always visible beneath all sections */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: [
            "radial-gradient(ellipse 90% 50% at 50% -5%,  rgba(0,194,168,0.10) 0%, transparent 55%)",
            "radial-gradient(ellipse 55% 40% at 88% 88%,  rgba(124,58,237,0.06) 0%, transparent 55%)",
            "radial-gradient(ellipse 40% 30% at 5%  80%,  rgba(0,100,80,0.05)   0%, transparent 55%)",
          ].join(","),
        }} />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-3 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-12 px-5 rounded-2xl"
            style={{
              background: "rgba(5,5,5,0.82)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 28px rgba(0,0,0,0.5)",
            }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-black text-xs"
                style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 0 16px rgba(0,194,168,0.4)" }}>
                S
              </div>
              <span className="font-black text-[15px] tracking-tight" style={{ fontFamily: BG }}>Scrollr</span>
            </div>
            <div className="hidden md:flex items-center gap-7 text-[13px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: DM }}>
              {[["#features","Features"],["#how","How it works"],["#pricing","Pricing"]].map(([href,label]) => (
                <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="/login" className="px-4 py-1.5 text-[13px] transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>Log in</Link>
              <Link href="/signup"
                className="px-4 py-1.5 text-[13px] font-black rounded-xl text-black hover:brightness-110 transition-all"
                style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
                Start free →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero — editorial full-bleed, non-template composition ──────────── */}
      {/*
        Design intent: kill the left-text/right-image SaaS template entirely.
        Typography fills the width. Card deck erupts from the right, overlapping
        and intersecting the text. Elements exist in the same plane.
        Three layers of parallax on mouse: bg grid ← | copy → | cards →→
      */}
      <section
        className="hero-section relative overflow-hidden"
        style={{ minHeight: "100svh" }}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set((e.clientX - r.left) / r.width);
          mouseY.set((e.clientY - r.top)  / r.height);
        }}
      >
        {/* ── Layer 0: WebGL particle field (slowest — opposite to mouse) ─── */}
        <HeroParticles className="z-0" />

        {/* ── Layer 0.5: GLSL simplex-noise aurora — the section that makes ──
              people screenshot and say "how did they do that?"
              3-octave fBm noise, teal→violet colour map, radial vignette.
              Composited additive over particles — transparent canvas.        ─── */}
        <HeroNoiseShader className="z-0" />

        {/* ── Layer 1: Background grid + glow (slow parallax) ────────────── */}
        <motion.div
          className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none"
          style={{ x: bgX, y: bgY, zIndex: 1 }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "-15%", left: "20%", width: "900px", height: "700px",
            background: "radial-gradient(ellipse at 40% 40%, rgba(0,194,168,0.11) 0%, rgba(124,58,237,0.04) 45%, transparent 70%)",
            x: bgX, y: bgY, zIndex: 1,
          }}
        />

        {/* ── Layer 2: Main content ───────────────────────────────────────── */}
        <div
          className="relative w-full"
          style={{ zIndex: 2, paddingTop: "clamp(5rem,11vh,8rem)", paddingBottom: "clamp(3rem,6vh,5rem)" }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* ── Eyebrow row ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-10 lg:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
                style={{ background: "rgba(0,194,168,0.07)", border: "1px solid rgba(0,194,168,0.18)", color: "#00C2A8", fontFamily: DM }}
              >
                <Sparkles className="w-3 h-3" />
                Claude AI · 8 viral slide formats
              </motion.div>

              {/* Year marker — editorial detail */}
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="hidden md:block text-[11px] font-medium tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.16)", fontFamily: DM }}
              >
                SCROLLR — 2026
              </motion.span>
            </div>

            {/* ── Main headline block + floating cards ───────────────────── */}
            <div className="relative">

              {/* The H1 — broken into 3 separate lines so each can be stagger-animated */}
              <motion.h1
                className="hero-copy font-black leading-[0.96] relative"
                style={{
                  fontFamily: BG,
                  fontSize: "clamp(4rem,9.5vw,8.5rem)",
                  letterSpacing: "-0.045em",
                  x: copyX, y: copyY,
                }}
              >
                {/* Line 1 */}
                <span style={{ display: "block", overflow: "hidden" }}>
                  <motion.span
                    style={{ display: "block" }}
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.82, delay: 0.12, ease: easeExpo as [number,number,number,number] }}
                  >
                    Make carousels
                  </motion.span>
                </span>

                {/* Line 2 */}
                <span style={{ display: "block", overflow: "hidden" }}>
                  <motion.span
                    style={{ display: "block" }}
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.82, delay: 0.22, ease: easeExpo as [number,number,number,number] }}
                  >
                    that actually
                  </motion.span>
                </span>

                {/* Line 3 — teal accent, slightly larger on desktop */}
                <span style={{ display: "block", overflow: "hidden" }}>
                  <motion.span
                    style={{ display: "block", color: "#00C2A8" }}
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.82, delay: 0.32, ease: easeExpo as [number,number,number,number] }}
                  >
                    get saved.
                  </motion.span>
                </span>
              </motion.h1>

              {/* ── Card deck — layer 3, INTERSECTS the type ─────────────── */}
              {/*
                Not beside the text. Not below it. Overlapping the right side
                of the composition — cards appear to emerge from the typography.
                On desktop only; mobile gets a separate card row below.
              */}
              <motion.div
                className="hero-cards absolute hidden lg:block pointer-events-none"
                style={{
                  top: "50%",
                  right: "-2%",
                  transform: "translateY(-50%)",
                  x: cardsX,
                  y: cardsY,
                  zIndex: 10,
                }}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, delay: 0.45, ease: easeExpo as [number,number,number,number] }}
              >
                <DeepCardDeck />
              </motion.div>
            </div>

            {/* ── Bottom row: subtitle + CTAs ────────────────────────────── */}
            <div className="mt-10 lg:mt-12 max-w-2xl">

              {/* Thin rule — editorial rhythm marker */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: easeExpo as [number,number,number,number] }}
                style={{
                  height: "1px", background: "rgba(255,255,255,0.1)",
                  transformOrigin: "left center", marginBottom: "1.5rem",
                  width: "clamp(160px,30vw,320px)",
                }}
              />

              {/* Subtitle — line-by-line reveal */}
              <motion.p
                className="text-[17px] leading-relaxed mb-9"
                style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM, maxWidth: "520px" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.52 }}
              >
                Type a topic. Paste a URL. Drop a transcript.
                Claude writes every slide — hook, body, CTA — then exports
                print-ready PNGs in seconds.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.64 }}
                className="flex flex-wrap items-center gap-3 mb-9"
              >
                {/* Two-layer magnetic CTA: shell moves + inner text moves more */}
                <TwoLayerMagnetic>
                  <Link ref={heroCTARef} href="/signup"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-[15px] text-black"
                    style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 8px 40px rgba(0,194,168,0.32)", fontFamily: DM }}>
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>Generate free</span>
                  </Link>
                </TwoLayerMagnetic>

                <a href="#demo"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-medium text-[15px] transition-all hover:bg-white/[0.05]"
                  style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)", fontFamily: DM }}>
                  See live demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Platform + social proof row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.78 }}
                className="flex flex-wrap items-center gap-3"
              >
                {[{label:"Instagram",color:"#E1306C"},{label:"LinkedIn",color:"#0A66C2"},{label:"X / Twitter",color:"#d4d4d4"}].map(({label,color}) => (
                  <span key={label} className="text-[11px] font-medium px-3 py-1 rounded-full"
                    style={{ border: `1px solid ${color}24`, background: `${color}0B`, color, fontFamily: DM }}>
                    {label}
                  </span>
                ))}
                <span className="text-[11px] ml-2" style={{ color: "rgba(255,255,255,0.16)", fontFamily: DM }}>
                  · No credit card required
                </span>
              </motion.div>
            </div>

            {/* ── Mobile card row — replaces the desktop floating deck ─── */}
            <motion.div
              className="lg:hidden mt-12 flex justify-center"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              <DeepCardDeck />
            </motion.div>

          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ zIndex: 2 }}
        >
          <span className="text-[10px] tracking-[0.25em] font-medium"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}>SCROLL</span>
          <motion.div
            className="w-[1px] bg-white/20 rounded-full"
            style={{ height: 32 }}
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── Slide type marquee strip ─────────────────────────────────────── */}
      <div className="overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="py-7 flex whitespace-nowrap w-max" style={{ animation: "marquee 22s linear infinite" }}>
          {[...SLIDE_TYPES, ...SLIDE_TYPES].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-[13px] font-medium"
              style={{ color: "rgba(255,255,255,0.26)", fontFamily: DM }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00C2A8" }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Platform export strip — "works with your stack" ──────────────── */}
      {/* Reverse marquee, slightly dimmer, platform names with platform-   */}
      {/* coloured dots. A single sentence of trust in a horizontal line.   */}
      <div className="overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="py-4 flex whitespace-nowrap w-max" style={{ animation: "marquee 36s linear infinite reverse" }}>
          {[
            { name: "LinkedIn",  color: "#0A66C2" },
            { name: "Instagram", color: "#E1306C" },
            { name: "X / Twitter", color: "#d4d4d4" },
            { name: "Buffer",    color: "#168EEA" },
            { name: "Later",     color: "#FFC300" },
            { name: "Hootsuite", color: "#10B981" },
            { name: "Canva",     color: "#8B5CF6" },
            { name: "Figma",     color: "#F24E1E" },
            { name: "Notion",    color: "#ffffff" },
            { name: "LinkedIn",  color: "#0A66C2" },
            { name: "Instagram", color: "#E1306C" },
            { name: "X / Twitter", color: "#d4d4d4" },
            { name: "Buffer",    color: "#168EEA" },
            { name: "Later",     color: "#FFC300" },
            { name: "Hootsuite", color: "#10B981" },
            { name: "Canva",     color: "#8B5CF6" },
            { name: "Figma",     color: "#F24E1E" },
            { name: "Notion",    color: "#ffffff" },
          ].map(({ name, color }, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-7 text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.2)", fontFamily: DM }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, opacity: 0.6 }} />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats band — by the numbers ──────────────────────────────────── */}
      <StatsBand />

      {/* ── Pinned scene ─────────────────────────────────────────────────── */}
      <div className="clip-reveal">
        <PinnedScene />
      </div>

      {/* ── Showcase strip ───────────────────────────────────────────────── */}
      <section className="showcase-section py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-2">
          <FadeUp>
            <p className="text-[12px] tracking-widest font-medium" style={{ color: "rgba(255,255,255,0.24)", fontFamily: DM }}>
              Real examples — slide types Scrollr generates automatically
            </p>
          </FadeUp>
        </div>
        <ShowcaseStrip />
      </section>

      {/* ── Interactive demo ─────────────────────────────────────────────── */}
      <div id="demo" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <DemoSection />
      </div>

      {/* ── Horizontal process — GSAP pin + xPercent scroll ──────────────── */}
      {/* This replaces HowItWorks with a full-bleed cinematic horizontal     */}
      {/* scroll scene. Giant Bebas numbers. Cards floating in perspective.   */}
      <HorizontalProcess />

      {/* ── Features bento ───────────────────────────────────────────────── */}
      <FeaturesBento />

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── Affiliate waitlist ───────────────────────────────────────────── */}
      <AffiliateWaitlist />

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <FinalCTA />

      {/* ── Footer — editorial typographic closer ────────────────────────── */}
      {/*
        Award sites end with something memorable — not just "© 2026".
        A giant Bebas wordmark that owns the bottom of the page.
        The legal row sits beneath it, minimal and factual.
      */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "#030303" }}>

        {/* Oversized wordmark */}
        <div className="overflow-hidden px-4 pt-16 pb-4">
          <FadeUp>
            <div
              className="font-black leading-none select-none"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(5rem,18vw,18rem)",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                letterSpacing: "-0.02em",
              }}
            >
              SCROLLR
            </div>
          </FadeUp>
        </div>

        {/* Tagline + nav row */}
        <div className="px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            {/* Thin rule */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1.5rem" }} />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              {/* Brand + tagline */}
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-black text-xs flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 0 12px rgba(0,194,168,0.3)" }}
                >
                  S
                </div>
                <div>
                  <p className="font-black text-[13px]" style={{ fontFamily: BG, color: "rgba(255,255,255,0.5)" }}>Scrollr</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}>AI Carousel Generator</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-6 text-[12px]" style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>
                {["Privacy", "Terms", "Affiliates", "Contact"].map(link => (
                  <a key={link} href="#" className="transition-colors hover:text-white/45">{link}</a>
                ))}
              </div>

              {/* Copyright */}
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.14)", fontFamily: DM }}>
                © 2026 Scrollr
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
