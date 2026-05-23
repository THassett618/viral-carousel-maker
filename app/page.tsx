"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles, ArrowRight, BookImage, Download, Zap,
  BarChart3, ListChecks, Check, Users, ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DM = "var(--font-dm-sans)";
const BG = "var(--font-bricolage)";

// ─── Demo data ────────────────────────────────────────────────────────────────

type DemoSlide = {
  type: string;
  accent: string;
  headline: string;
  sub?: string;
  slideNum: number;
};

const DEMO_PRESETS: Record<string, { topic: string; slides: DemoSlide[] }> = {
  linkedin: {
    topic: "5 habits that grew my LinkedIn to 50K followers",
    slides: [
      { type: "HOOK", accent: "#00C2A8", headline: "5 habits that grew my LinkedIn to 50K followers in 90 days", slideNum: 1 },
      { type: "TIP", accent: "#3B82F6", headline: "Post at 7am weekdays", sub: "Peak LinkedIn hours = 3× more reach than afternoon posts.", slideNum: 2 },
      { type: "STAT", accent: "#F59E0B", headline: "87%", sub: "of top-performing posts start with a curiosity-gap headline", slideNum: 3 },
      { type: "CHECKLIST", accent: "#10B981", headline: "Perfect post structure:\n✓ Hook (curiosity or value)\n✓ 3–5 bite-size insights\n✓ One clear CTA\n✓ Original image", slideNum: 4 },
      { type: "BEFORE/AFTER", accent: "#7C3AED", headline: "Before: Salesy 'thought leadership'", sub: "After: Specific story-driven carousels people save", slideNum: 5 },
      { type: "CTA", accent: "#F43F5E", headline: "Follow for weekly LinkedIn tactics that actually move the needle.", slideNum: 6 },
    ],
  },
  productivity: {
    topic: "The morning routine that added $100K to my year",
    slides: [
      { type: "HOOK", accent: "#F59E0B", headline: "The 90-minute morning routine that added $100K to my year", slideNum: 1 },
      { type: "STAT", accent: "#00C2A8", headline: "84%", sub: "of Fortune 500 CEOs wake before 6am. Here's why it works.", slideNum: 2 },
      { type: "TIP", accent: "#3B82F6", headline: "First 90 minutes = zero notifications", sub: "Your best thinking happens before the world gets to you.", slideNum: 3 },
      { type: "TIP", accent: "#7C3AED", headline: "Hydrate before coffee", sub: "16oz of water upon waking raises alertness by 20% within 20 min.", slideNum: 4 },
      { type: "CHECKLIST", accent: "#10B981", headline: "The formula:\n✓ Hydrate (5 min)\n✓ Move your body (20 min)\n✓ Plan your top 3 (10 min)\n✓ Deep work (60 min)", slideNum: 5 },
      { type: "CTA", accent: "#F43F5E", headline: "Save this and build your version. Drop your routine below.", slideNum: 6 },
    ],
  },
  ai: {
    topic: "10 AI prompts saving me 3 hours every day",
    slides: [
      { type: "HOOK", accent: "#7C3AED", headline: "10 AI prompts that save me 3 hours every single day", slideNum: 1 },
      { type: "STAT", accent: "#00C2A8", headline: "40%", sub: "productivity boost for workers who use AI tools daily (Stanford, 2024)", slideNum: 2 },
      { type: "TIP", accent: "#F59E0B", headline: "Use AI for first drafts, not final work", sub: "Your job: set direction + inject voice. AI's job: handle structure.", slideNum: 3 },
      { type: "TIP", accent: "#3B82F6", headline: "Build a prompt library", sub: "Save your best prompts as templates. Reuse them every week.", slideNum: 4 },
      { type: "CHECKLIST", accent: "#10B981", headline: "Daily AI stack:\n✓ Claude (writing + thinking)\n✓ ChatGPT (brainstorming)\n✓ Midjourney (visuals)\n✓ Notion AI (notes)", slideNum: 5 },
      { type: "CTA", accent: "#F43F5E", headline: "Save this. Your competitors are already using these.", slideNum: 6 },
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

// ─── Showcase slide pool ──────────────────────────────────────────────────────

const SHOWCASE_ROW_1: DemoSlide[] = [
  { type: "HOOK", accent: "#00C2A8", headline: "7 content frameworks that built 100K+ audiences", slideNum: 1 },
  { type: "STAT", accent: "#F59E0B", headline: "3×", sub: "more saves for carousel posts vs single images", slideNum: 2 },
  { type: "TIP", accent: "#3B82F6", headline: "End every slide with one actionable insight", sub: "Actionability = saves. Saves = reach.", slideNum: 3 },
  { type: "QUOTE", accent: "#7C3AED", headline: "\"Consistency beats perfection. Ship before you're ready.\"", slideNum: 4 },
  { type: "CHECKLIST", accent: "#10B981", headline: "Viral formula:\n✓ Curiosity hook\n✓ Proof\n✓ Value\n✓ CTA", slideNum: 5 },
  { type: "STAT", accent: "#F43F5E", headline: "65%", sub: "of LinkedIn engagement comes from carousels", slideNum: 6 },
  { type: "TIP", accent: "#F59E0B", headline: "Repurpose your best carousel every quarter", sub: "New followers haven't seen it. Old ones have forgotten it.", slideNum: 7 },
  { type: "HOOK", accent: "#00C2A8", headline: "Stop posting opinions. Post frameworks your audience can steal.", slideNum: 8 },
];

const SHOWCASE_ROW_2: DemoSlide[] = [
  { type: "CTA", accent: "#F43F5E", headline: "Follow for tactical growth content every week.", slideNum: 1 },
  { type: "TIP", accent: "#7C3AED", headline: "Your hook is 80% of your results", sub: "Spend 80% of your writing time on the first slide.", slideNum: 2 },
  { type: "STAT", accent: "#3B82F6", headline: "20K", sub: "followers gained from a single viral carousel this year", slideNum: 3 },
  { type: "CHECKLIST", accent: "#10B981", headline: "Daily post checklist:\n✓ Written before 9am\n✓ Hook tested\n✓ CTA clear\n✓ Image attached", slideNum: 4 },
  { type: "QUOTE", accent: "#F59E0B", headline: "\"The riches are in the niches. Go deep, not wide.\"", slideNum: 5 },
  { type: "BEFORE/AFTER", accent: "#00C2A8", headline: "Before: generic tips everyone knows", sub: "After: specific numbers and stories nobody else shares", slideNum: 6 },
  { type: "TIP", accent: "#F43F5E", headline: "Use contrast to drive saves", sub: "Before/After slides convert 2× better than pure value posts.", slideNum: 7 },
  { type: "HOOK", accent: "#7C3AED", headline: "I analyzed 500 viral posts. Here's the only pattern that matters.", slideNum: 8 },
];

// ─── Pricing data ─────────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "quarterly" | "annual";

interface Plan {
  name: string;
  tag?: string;
  accent: string;
  prices: { monthly: number; quarterly: number; annual: number };
  carousels: number | "unlimited";
  extraPer?: number;
  seats?: number;
  features: string[];
  cta: string;
  highlight: boolean;
  stripeIds: { monthly: string; quarterly: string; annual: string };
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    accent: "#00C2A8",
    prices: { monthly: 12, quarterly: 10.8, annual: 9 },
    carousels: 30,
    extraPer: 0.45,
    features: [
      "30 carousels / month",
      "All 8 slide templates",
      "PNG export (ZIP)",
      "Instagram, LinkedIn, X",
      "$0.45 per extra carousel",
    ],
    cta: "Start Starter",
    highlight: false,
    stripeIds: {
      monthly: "price_STARTER_MONTHLY",
      quarterly: "price_STARTER_QUARTERLY",
      annual: "price_STARTER_ANNUAL",
    },
  },
  {
    name: "Pro",
    tag: "Most popular",
    accent: "#7C3AED",
    prices: { monthly: 29, quarterly: 26.1, annual: 21.75 },
    carousels: 75,
    extraPer: 0.40,
    features: [
      "75 carousels / month",
      "Style Library (RAG)",
      "URL + transcript input",
      "Priority generation",
      "$0.40 per extra carousel",
    ],
    cta: "Get Pro",
    highlight: true,
    stripeIds: {
      monthly: "price_PRO_MONTHLY",
      quarterly: "price_PRO_QUARTERLY",
      annual: "price_PRO_ANNUAL",
    },
  },
  {
    name: "Agency",
    accent: "#3B82F6",
    prices: { monthly: 79, quarterly: 71.1, annual: 59.25 },
    carousels: 250,
    extraPer: 0.35,
    seats: 5,
    features: [
      "250 carousels / month",
      "5 team seats",
      "Shared style library",
      "Custom brand presets",
      "$0.35 per extra carousel",
    ],
    cta: "Get Agency",
    highlight: false,
    stripeIds: {
      monthly: "price_AGENCY_MONTHLY",
      quarterly: "price_AGENCY_QUARTERLY",
      annual: "price_AGENCY_ANNUAL",
    },
  },
];

const CREDIT_PACKS = [
  { credits: 5, price: 3.99, priceEach: 0.80, stripeId: "price_CREDITS_5" },
  { credits: 20, price: 11.99, priceEach: 0.60, stripeId: "price_CREDITS_20" },
  { credits: 60, price: 29.99, priceEach: 0.50, stripeId: "price_CREDITS_60" },
];

// ─── FadeUp — GSAP ScrollTrigger version ─────────────────────────────────────

function FadeUp({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 36 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.72, delay,
          ease: "power3.out", clearProps: "y",
        }),
    });
    return () => trigger.kill();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

// ─── SlideIn — GSAP 3D rotateY version ───────────────────────────────────────

function SlideIn({
  children, from = "left", delay = 0, className,
}: { children: React.ReactNode; from?: "left" | "right"; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xOff = from === "left" ? -64 : 64;
    const rY = from === "left" ? -14 : 14;
    gsap.set(el, { opacity: 0, x: xOff, rotateY: rY, transformPerspective: 900 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 87%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1, x: 0, rotateY: 0, duration: 0.82, delay,
          ease: "power3.out", clearProps: "x,rotateY,transformPerspective",
        }),
    });
    return () => trigger.kill();
  }, [from, delay]);
  return <div ref={ref} className={className}>{children}</div>;
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
      className={`${w} rounded-2xl overflow-hidden flex flex-col select-none flex-shrink-0`}
      style={{
        aspectRatio: "4/5",
        background: "linear-gradient(150deg,#161616 0%,#0D0D0D 100%)",
        border: `1px solid ${accent}22`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.6),0 0 0 1px ${accent}12`,
      }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />
      <div className="flex-1 p-4 flex flex-col">
        <span className="text-[7px] uppercase tracking-[0.25em] font-bold mb-3"
          style={{ color: accent, fontFamily: BG }}>
          {type}
        </span>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[10px] font-black text-white leading-snug whitespace-pre-line"
            style={{ fontFamily: BG }}>
            {headline}
          </p>
          {sub && <p className="text-[8px] text-white/40 mt-1.5 leading-snug" style={{ fontFamily: DM }}>{sub}</p>}
        </div>
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: Math.min(totalSlides, 5) }).map((_, i) => (
            <div key={i} className="rounded-full flex-shrink-0"
              style={{
                width: i === slideNum - 1 ? 12 : 3,
                height: 2.5,
                background: i === slideNum - 1 ? accent : "rgba(255,255,255,0.1)",
              }} />
          ))}
          <span className="ml-auto text-[7px]" style={{ color: "rgba(255,255,255,0.18)", fontFamily: DM }}>
            {slideNum}/{totalSlides}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DeepCardDeck — GSAP quickTo mouse parallax + floating timelines ──────────

function DeepCardDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const backFloatRef = useRef<HTMLDivElement>(null);
  const midFloatRef = useRef<HTMLDivElement>(null);
  const frontFloatRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    // Per-card floating timelines with different phase/amplitude
    const tlBack = gsap.to(backFloatRef.current, {
      y: -14, duration: 5.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.9,
    });
    const tlMid = gsap.to(midFloatRef.current, {
      y: -18, duration: 4.7, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.4,
    });
    const tlFront = gsap.to(frontFloatRef.current, {
      y: -11, duration: 4.2, yoyo: true, repeat: -1, ease: "sine.inOut",
    });

    // GSAP quickTo for butter-smooth perspective tilt on mouse move
    const qRotX = gsap.quickTo(deck, "rotateX", { duration: 0.55, ease: "power2.out" });
    const qRotY = gsap.quickTo(deck, "rotateY", { duration: 0.55, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const r = deck.getBoundingClientRect();
      const nx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const ny = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      qRotY(nx * 13);
      qRotX(-ny * 10);
    };
    const onLeave = () => { qRotX(0); qRotY(0); };

    deck.addEventListener("mousemove", onMove);
    deck.addEventListener("mouseleave", onLeave);

    return () => {
      tlBack.kill(); tlMid.kill(); tlFront.kill();
      deck.removeEventListener("mousemove", onMove);
      deck.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={deckRef} className="relative w-80 h-[440px]"
      style={{ perspective: "1100px", transformStyle: "preserve-3d", willChange: "transform" }}>
      {/* Glow behind cards */}
      <div className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 52%, rgba(0,194,168,0.22) 0%, transparent 70%)",
          animation: "glow-pulse 4s ease-in-out infinite",
        }} />
      {/* Back card — deepest z-plane */}
      <div className="absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-10deg) translate(-38px,34px) translateZ(-80px)", zIndex: 1 }}>
        <div ref={backFloatRef}>
          <MockCard type="CTA" accent="#7C3AED" headline="Follow for weekly growth frameworks that actually work" slideNum={6} totalSlides={6} />
        </div>
      </div>
      {/* Mid card */}
      <div className="absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-3deg) translate(-14px,13px) translateZ(-30px)", zIndex: 2 }}>
        <div ref={midFloatRef}>
          <MockCard type="STAT" accent="#F59E0B" headline="87%" sub="of top posts use a strong hook slide" slideNum={3} totalSlides={6} />
        </div>
      </div>
      {/* Front card — closest to viewer */}
      <div className="absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(4deg) translate(10px,-10px)", zIndex: 3 }}>
        <div ref={frontFloatRef}>
          <MockCard type="HOOK" accent="#00C2A8" headline="3 habits that doubled my LinkedIn reach in 30 days" slideNum={1} totalSlides={6} />
        </div>
      </div>
    </div>
  );
}

// ─── PinnedZoom — scroll-pinned depth scene ───────────────────────────────────

function PinnedZoom() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // Set text invisible initially (GSAP will reveal on scroll)
      gsap.set(".pz-tagline, .pz-sub", { opacity: 0, y: 36 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      tl
        .from(".pz-center-card", { scale: 0.3, opacity: 0, duration: 1 })
        .to(".pz-side-left",  { x: -180, opacity: 0, scale: 0.75, filter: "blur(6px)",  duration: 0.7 }, 0)
        .to(".pz-side-right", { x:  180, opacity: 0, scale: 0.75, filter: "blur(6px)",  duration: 0.7 }, 0)
        .to(".pz-far-left",   { x: -310, opacity: 0, filter: "blur(12px)", duration: 0.8 }, 0)
        .to(".pz-far-right",  { x:  310, opacity: 0, filter: "blur(12px)", duration: 0.8 }, 0)
        .to(".pz-tagline", { opacity: 1, y: 0, duration: 0.5 }, 0.65)
        .to(".pz-sub",     { opacity: 1, y: 0, duration: 0.4 }, 0.82);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#070707" }}>
      {/* Soft glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 50% at 50% 55%, rgba(0,194,168,0.07) 0%, transparent 65%)",
      }} />

      {/* Far-left card (deepest depth) */}
      <div className="pz-far-left absolute hidden md:block pointer-events-none"
        style={{ left: "2%", top: "50%", transform: "translateY(-54%) scale(0.56)", opacity: 0.2, filter: "blur(2px)", zIndex: 1 }}>
        <MockCard type="QUOTE" accent="#3B82F6" headline={`"Consistency\nbeats perfection."`} compact slideNum={4} totalSlides={6} />
      </div>

      {/* Left card */}
      <div className="pz-side-left absolute hidden md:block pointer-events-none"
        style={{ left: "11%", top: "50%", transform: "translateY(-50%) scale(0.76)", opacity: 0.5, zIndex: 2 }}>
        <MockCard type="STAT" accent="#F59E0B" headline="87%" sub="of viral posts lead with a curiosity-gap hook" compact slideNum={2} totalSlides={6} />
      </div>

      {/* CENTER CARD — hero of the scene */}
      <div className="pz-center-card relative z-10">
        <MockCard type="HOOK" accent="#00C2A8" headline="3 habits that doubled my LinkedIn reach in 30 days" slideNum={1} totalSlides={6} />
      </div>

      {/* Right card */}
      <div className="pz-side-right absolute hidden md:block pointer-events-none"
        style={{ right: "11%", top: "50%", transform: "translateY(-50%) scale(0.76)", opacity: 0.5, zIndex: 2 }}>
        <MockCard type="CHECKLIST" accent="#10B981" headline={"Daily formula:\n✓ Hook\n✓ Proof\n✓ Value\n✓ CTA"} compact slideNum={4} totalSlides={6} />
      </div>

      {/* Far-right card */}
      <div className="pz-far-right absolute hidden md:block pointer-events-none"
        style={{ right: "2%", top: "50%", transform: "translateY(-54%) scale(0.56)", opacity: 0.2, filter: "blur(2px)", zIndex: 1 }}>
        <MockCard type="CTA" accent="#F43F5E" headline="Save this. Post it Monday." compact slideNum={6} totalSlides={6} />
      </div>

      {/* Text reveals on scroll */}
      <div className="pz-tagline absolute bottom-28 left-0 right-0 text-center pointer-events-none">
        <h2 className="font-black text-white"
          style={{ fontFamily: BG, fontSize: "clamp(1.6rem,4vw,2.8rem)", letterSpacing: "-0.03em" }}>
          Every format. Pixel-perfect.
        </h2>
      </div>
      <div className="pz-sub absolute bottom-20 left-0 right-0 text-center pointer-events-none">
        <p className="text-sm tracking-wide" style={{ color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
          Hook · Stat · Checklist · Quote · Before/After · CTA · Tip · Body
        </p>
      </div>
    </section>
  );
}

// ─── ShowcaseStrip ────────────────────────────────────────────────────────────

function ShowcaseStrip() {
  return (
    <div className="py-12 overflow-hidden space-y-3">
      {/* Outer divs get GSAP y-parallax; inner divs get CSS x-marquee */}
      <div className="showcase-row-1">
        <div className="flex gap-4 w-max"
          style={{ animation: "marquee 40s linear infinite" }}>
          {[...SHOWCASE_ROW_1, ...SHOWCASE_ROW_1].map((s, i) => (
            <MockCard key={i} compact {...s} totalSlides={6} />
          ))}
        </div>
      </div>
      <div className="showcase-row-2" style={{ opacity: 0.85 }}>
        <div className="flex gap-4 w-max"
          style={{ animation: "marquee 36s linear infinite reverse" }}>
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
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.2)", color: "#00C2A8", fontFamily: DM }}>
              <Sparkles className="w-3 h-3" />
              No account required
            </div>
            <h2 className="font-black mb-3 leading-tight"
              style={{ fontFamily: BG, fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.03em" }}>
              Try it right now
            </h2>
            <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>
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
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: DM,
              }}
            />
            <button
              onClick={generate}
              disabled={!input.trim() || state === "loading"}
              className="h-12 px-6 rounded-xl font-bold text-sm text-black flex items-center gap-2 flex-shrink-0 transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}
            >
              {state === "loading" ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Sparkles className="w-4 h-4" />Generate</>
              )}
            </button>
          </div>

          {state === "idle" && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setInput(t)}
                  className="px-3 py-1.5 rounded-full text-xs transition-colors hover:bg-white/[0.06]"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: DM }}>
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
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}>
                      <MockCard {...slide} totalSlides={slides.length} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8 flex flex-col items-center gap-4">
                <button
                  onClick={() => setShowPaywall(true)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 6px 24px rgba(0,194,168,0.3)", fontFamily: DM }}>
                  <Download className="w-4 h-4" />
                  Export as PNGs
                </button>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>
                  Full export requires a free account. Download in seconds.
                </p>
                <button onClick={generate}
                  className="text-[12px] underline underline-offset-2 transition-colors hover:text-white/60"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>
                  ↺ Generate again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaywall && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPaywall(false)}
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm p-8 rounded-3xl text-center"
                style={{ background: "#111", border: "1px solid rgba(0,194,168,0.25)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,194,168,0.12)" }}>
                  <Download className="w-6 h-6" style={{ color: "#00C2A8" }} />
                </div>
                <h3 className="font-black text-xl mb-2" style={{ fontFamily: BG }}>Export your carousel</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)", fontFamily: DM }}>
                  Create a free account to download your PNG files. Takes 30 seconds.
                </p>
                <Link href="/signup"
                  className="block w-full py-3 rounded-xl font-bold text-sm text-black mb-3 transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
                  Create free account →
                </Link>
                <button onClick={() => setShowPaywall(false)}
                  className="text-xs w-full py-2 transition-colors hover:text-white/60"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>
                  Maybe later
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const startCheckout = async (plan: Plan) => {
    setCheckingOut(plan.name);
    const priceId = plan.stripeIds[billing];
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName: plan.name, billing }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      window.location.href = "/signup";
    } finally {
      setCheckingOut(null);
    }
  };

  const startCreditsCheckout = async (pack: typeof CREDIT_PACKS[0]) => {
    setCheckingOut(`credits-${pack.credits}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: pack.stripeId, planName: `${pack.credits} Credits`, billing: "once", type: "credits" }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      window.location.href = "/signup";
    } finally {
      setCheckingOut(null);
    }
  };

  const discountLabel: Record<BillingPeriod, string | null> = {
    monthly: null,
    quarterly: "Save 10%",
    annual: "Save 25%",
  };

  return (
    <section id="pricing" className="py-28 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>Pricing</p>
            <h2 className="font-black mb-3"
              style={{ fontFamily: BG, fontSize: "clamp(2rem,4.5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Pricing that makes sense
            </h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
              Start free. 3 carousels on us — no card, no catch.
            </p>
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(["monthly", "quarterly", "annual"] as BillingPeriod[]).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className="relative px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                  style={{
                    background: billing === b ? "rgba(255,255,255,0.1)" : "transparent",
                    color: billing === b ? "#fff" : "rgba(255,255,255,0.4)",
                    fontFamily: DM,
                  }}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  {discountLabel[b] && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: "rgba(0,194,168,0.2)", color: "#00C2A8" }}>
                      {discountLabel[b]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="mb-6 p-5 rounded-2xl flex items-center gap-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,194,168,0.1)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#00C2A8" }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white" style={{ fontFamily: BG }}>Free — 3 carousels, no card</p>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>
                Try every slide format, export PNGs, test all platforms. Free forever.
              </p>
            </div>
            <Link href="/signup"
              className="px-4 py-2 rounded-xl text-sm font-bold text-black flex-shrink-0 transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
              Start free →
            </Link>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan, i) => {
            const price = plan.prices[billing];
            const isChecking = checkingOut === plan.name;
            return (
              <SlideIn key={plan.name} from={i === 0 ? "left" : i === 2 ? "right" : "left"} delay={i * 0.08}>
                <div className="relative p-7 rounded-3xl h-full flex flex-col transition-all duration-300"
                  style={{
                    background: plan.highlight
                      ? `linear-gradient(150deg,${plan.accent}12 0%,transparent 60%)`
                      : "rgba(255,255,255,0.02)",
                    border: plan.highlight
                      ? `1px solid ${plan.accent}35`
                      : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: plan.highlight ? `0 0 48px ${plan.accent}12` : "none",
                  }}>
                  {plan.tag && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black text-black tracking-wide"
                      style={{ background: `linear-gradient(135deg,${plan.accent},${plan.accent}CC)` }}>
                      {plan.tag.toUpperCase()}
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                      style={{ color: "rgba(255,255,255,0.35)", fontFamily: DM }}>{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black" style={{ fontFamily: BG, fontSize: "2.8rem", letterSpacing: "-0.04em" }}>
                        ${price.toFixed(price % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>/ mo</span>
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
                        <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: DM }}>{f}</span>
                      </li>
                    ))}
                    {plan.seats && (
                      <li className="flex items-start gap-2.5 text-[13px]">
                        <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.accent }} />
                        <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: DM }}>{plan.seats} team seats</span>
                      </li>
                    )}
                  </ul>
                  <button
                    onClick={() => startCheckout(plan)}
                    disabled={isChecking}
                    className="block w-full text-center py-3 rounded-xl font-bold text-[13px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    style={plan.highlight
                      ? { background: `linear-gradient(135deg,${plan.accent},${plan.accent}CC)`, color: "#fff", fontFamily: DM }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontFamily: DM }}>
                    {isChecking
                      ? <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : plan.cta}
                  </button>
                </div>
              </SlideIn>
            );
          })}
        </div>

        <FadeUp delay={0.2}>
          <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-2"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>Pay-per-use</p>
            <h3 className="font-black mb-1" style={{ fontFamily: BG, fontSize: "1.25rem" }}>Just need a few? Buy credits.</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)", fontFamily: DM }}>
              Credits never expire. Stack with any subscription.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {CREDIT_PACKS.map((pack) => {
                const isChecking = checkingOut === `credits-${pack.credits}`;
                return (
                  <button key={pack.credits}
                    onClick={() => startCreditsCheckout(pack)}
                    disabled={isChecking}
                    className="p-5 rounded-2xl text-left transition-all hover:bg-white/[0.04] group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="font-black text-xl text-white mb-0.5" style={{ fontFamily: BG }}>
                      {pack.credits} credits
                    </p>
                    <p className="font-bold text-2xl mb-1" style={{ color: "#00C2A8", fontFamily: BG }}>
                      ${pack.price}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: DM }}>
                      ${pack.priceEach.toFixed(2)} each
                    </p>
                    <ChevronRight className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#00C2A8" }} />
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

// ─── Greek art illustration ───────────────────────────────────────────────────

function GreekArt() {
  const A = "#C8962A";   // amber
  const D = "#A07018";   // dim amber
  const C = "#F0DFA0";   // cream

  return (
    <svg viewBox="0 0 480 270" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, display: "block" }}>
      <defs>
        <radialGradient id="ambg" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor={A} stopOpacity="0.09" />
          <stop offset="100%" stopColor={A} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmospheric warm glow */}
      <ellipse cx="240" cy="200" rx="220" ry="110" fill="url(#ambg)" />

      {/* Stars */}
      {([[42,18],[78,8],[120,28],[168,6],[210,20],[270,14],[320,28],[372,8],[418,22],[450,38],[95,38],[345,36]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} fill={C} opacity={0.18 + (i % 4) * 0.1} />
      ))}

      {/* ── Frieze band ── */}
      <rect x="56" y="44" width="368" height="16" fill={A} opacity="0.1" />
      {[150, 194, 238, 282, 326].map(cx => (
        <g key={cx}>
          <rect x={cx - 8} y="44" width="16" height="16" fill={A} opacity="0.28" />
          <line x1={cx - 3} y1="44" x2={cx - 3} y2="60" stroke="#060400" strokeWidth="2.5" opacity="0.45" />
          <line x1={cx + 3} y1="44" x2={cx + 3} y2="60" stroke="#060400" strokeWidth="2.5" opacity="0.45" />
        </g>
      ))}

      {/* ── Architrave beam ── */}
      <rect x="56" y="60" width="368" height="9" fill={A} opacity="0.52" />

      {/* ── LEFT COLUMN ── */}
      <rect x="56" y="51" width="38" height="9" rx="1" fill={A} opacity="0.78" />
      <path d="M60,60 L90,60 L87,71 L63,71 Z" fill={A} opacity="0.68" />
      <rect x="64" y="71" width="22" height="166" fill={A} opacity="0.42" />
      {[68, 73, 78, 83].map(x => (
        <line key={x} x1={x} y1="71" x2={x} y2="237" stroke="#060400" strokeWidth="0.9" opacity="0.28" />
      ))}
      <rect x="59" y="237" width="32" height="6" rx="1" fill={A} opacity="0.58" />
      <rect x="55" y="243" width="40" height="7" rx="1" fill={A} opacity="0.48" />

      {/* ── RIGHT COLUMN ── */}
      <rect x="386" y="51" width="38" height="9" rx="1" fill={A} opacity="0.78" />
      <path d="M390,60 L420,60 L417,71 L393,71 Z" fill={A} opacity="0.68" />
      <rect x="394" y="71" width="22" height="166" fill={A} opacity="0.42" />
      {[398, 403, 408, 413].map(x => (
        <line key={x} x1={x} y1="71" x2={x} y2="237" stroke="#060400" strokeWidth="0.9" opacity="0.28" />
      ))}
      <rect x="389" y="237" width="32" height="6" rx="1" fill={A} opacity="0.58" />
      <rect x="385" y="243" width="40" height="7" rx="1" fill={A} opacity="0.48" />

      {/* ── Stage floor ── */}
      <rect x="55" y="250" width="370" height="5" rx="1" fill={A} opacity="0.16" />
      <line x1="86" y1="250" x2="394" y2="250" stroke={A} strokeWidth="1" opacity="0.22" />
      {/* Amphitheater hint curves */}
      <path d="M84,256 Q240,249 396,256" stroke={A} strokeWidth="1" fill="none" opacity="0.1" />
      <path d="M76,262 Q240,254 404,262" stroke={A} strokeWidth="1" fill="none" opacity="0.07" />

      {/* ── Laurel wreath (upper center) ── */}
      {([
        ["M196,38 Q190,29 198,25 Q204,33 196,38 Z", 0.36],
        ["M204,42 Q196,34 204,29 Q210,37 204,42 Z", 0.32],
        ["M213,45 Q205,38 212,33 Q219,40 213,45 Z", 0.28],
        ["M222,47 Q215,41 221,36 Q228,43 222,47 Z", 0.24],
      ] as [string, number][]).map(([d, op], i) => <path key={i} d={d} fill={A} opacity={op} />)}
      {([
        ["M284,38 Q290,29 282,25 Q276,33 284,38 Z", 0.36],
        ["M276,42 Q284,34 276,29 Q270,37 276,42 Z", 0.32],
        ["M267,45 Q275,38 268,33 Q261,40 267,45 Z", 0.28],
        ["M258,47 Q265,41 259,36 Q252,43 258,47 Z", 0.24],
      ] as [string, number][]).map(([d, op], i) => <path key={i} d={d} fill={A} opacity={op} />)}
      <path d="M232,50 Q240,56 248,50 L248,54 Q240,60 232,54 Z" fill={A} opacity="0.26" />

      {/* ──────────────────────────────────────── */}
      {/* FIGURE 1 — ORATOR, arm outstretched     */}
      {/* ──────────────────────────────────────── */}
      <circle cx="158" cy="143" r="12" fill={A} />
      {/* hair/wreath hint */}
      <path d="M147,138 Q153,130 169,136 L167,141 Q155,133 147,138 Z" fill={D} opacity="0.5" />
      {/* beard */}
      <path d="M148,150 L150,161 L166,161 L168,150" fill={D} opacity="0.62" />
      {/* robe — wider at hem */}
      <path d="M148,155 L136,250 L180,250 L168,155 Z" fill={A} opacity="0.72" />
      <line x1="153" y1="158" x2="142" y2="250" stroke={D} strokeWidth="1" opacity="0.28" />
      <line x1="163" y1="157" x2="171" y2="250" stroke={D} strokeWidth="1" opacity="0.28" />
      {/* raised arm */}
      <path d="M168,165 L210,141 L215,150 L173,174 Z" fill={A} opacity="0.8" />
      <ellipse cx="213" cy="144" rx="6" ry="5" fill={A} opacity="0.68" />

      {/* ──────────────────────────────────────── */}
      {/* FIGURE 2 — THINKER, seated, hand to chin */}
      {/* ──────────────────────────────────────── */}
      {/* seat block */}
      <rect x="224" y="220" width="32" height="30" rx="2" fill={A} opacity="0.12" />
      <circle cx="244" cy="162" r="11" fill={A} />
      <path d="M235,168 L237,179 L251,179 L253,168" fill={D} opacity="0.58" />
      {/* upper body */}
      <path d="M236,173 L228,220 L260,220 L252,173 Z" fill={A} opacity="0.68" />
      {/* legs */}
      <path d="M228,220 L222,250 L240,250 L240,220 Z" fill={A} opacity="0.6" />
      <path d="M252,220 L252,250 L270,250 L260,220 Z" fill={A} opacity="0.6" />
      {/* arm — elbow on knee, hand to chin */}
      <path d="M236,192 L217,181 L219,189 L238,200 Z" fill={A} opacity="0.68" />
      <circle cx="215" cy="183" r="5" fill={A} opacity="0.62" />

      {/* ──────────────────────────────────────── */}
      {/* FIGURE 3 — SCHOLAR, holds scroll        */}
      {/* ──────────────────────────────────────── */}
      <circle cx="320" cy="147" r="11" fill={A} />
      <path d="M312,153 L314,163 L327,163 L329,153" fill={D} opacity="0.58" />
      {/* robe */}
      <path d="M313,158 L305,250 L335,250 L327,158 Z" fill={A} opacity="0.7" />
      <line x1="317" y1="161" x2="311" y2="250" stroke={D} strokeWidth="1" opacity="0.26" />
      {/* arm holding scroll */}
      <path d="M313,170 L288,164 L287,174 L313,180 Z" fill={A} opacity="0.68" />
      {/* scroll */}
      <rect x="273" y="158" width="17" height="24" rx="4" fill={C} opacity="0.38" />
      <ellipse cx="273" cy="170" rx="3" ry="5" fill={C} opacity="0.28" />
      <ellipse cx="290" cy="170" rx="3" ry="5" fill={C} opacity="0.28" />
      {[163, 168, 172, 177].map(y => (
        <line key={y} x1="276" y1={y} x2="288" y2={y} stroke={A} strokeWidth="0.7" opacity="0.32" />
      ))}
    </svg>
  );
}

// ─── Affiliate waitlist section ───────────────────────────────────────────────

function AffiliateWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* graceful — UX always succeeds */ }
    setStatus("done");
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

      {/* Warm amber glow — distinct from the teal glow elsewhere */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(60,35,0,0.32) 0%, transparent 68%)",
      }} />

      <div className="max-w-3xl mx-auto relative">
        <FadeUp>
          <div className="text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
              style={{ background: "rgba(200,150,42,0.1)", border: "1px solid rgba(200,150,42,0.28)", color: "#C8962A", fontFamily: DM }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#C8962A", opacity: 0.7 }} />
              Affiliate Program — Waitlist
            </div>

            {/* Title */}
            <h2 className="font-black mb-3 leading-tight"
              style={{ fontFamily: BG, fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              The Inner Circle
            </h2>
            <p className="mb-10 text-[15px]" style={{ color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
              25% lifetime commission. No cap. Launching at $25K MRR.
            </p>

            {/* Greek illustration */}
            <div className="flex justify-center mb-10">
              <GreekArt />
            </div>

            {/* Commission stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {([
                ["25%", "lifetime commission"],
                ["$10", "min payout"],
                ["∞", "no cap, ever"],
                ["Monthly", "automatic payouts"],
              ] as [string, string][]).map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="font-black text-xl mb-0.5" style={{ fontFamily: BG, color: "#C8962A" }}>{val}</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Waitlist form */}
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                  style={{ background: "rgba(200,150,42,0.14)", border: "1px solid rgba(200,150,42,0.32)" }}>
                  <Check className="w-5 h-5" style={{ color: "#C8962A" }} />
                </div>
                <p className="font-bold" style={{ color: "#C8962A", fontFamily: BG }}>You're on the list.</p>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: DM }}>
                  We'll reach out when we launch.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-11 px-4 rounded-xl outline-none text-white text-[14px]"
                  style={{
                    background: "rgba(200,150,42,0.06)",
                    border: "1px solid rgba(200,150,42,0.22)",
                    fontFamily: DM,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 px-5 rounded-xl font-bold text-[13px] flex items-center gap-2 flex-shrink-0 transition-all hover:brightness-110 disabled:opacity-60"
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

// ─── Main landing page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const SLIDE_TYPES = ["Hook", "Checklist", "Quote", "Stat", "Before / After", "Tip", "CTA", "Body"];

  // ── Page-level GSAP: hero parallax + bento 3D + how-step + showcase ──────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Hero multi-depth parallax — copy and cards move at different rates
      const heroTrigger = { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1.4 };
      gsap.to(".hero-copy",  { y: "-14%", ease: "none", scrollTrigger: heroTrigger });
      gsap.to(".hero-cards", { y: "-24%", ease: "none", scrollTrigger: { ...heroTrigger, scrub: 1 } });

      // Bento feature cards — 3D lift from below (rotateX, not rotateY, for a floor-rise feel)
      gsap.utils.toArray<Element>(".bento-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 56,
          scale: 0.88,
          rotateX: 10,
          transformPerspective: 900,
          duration: 0.85,
          ease: "power3.out",
          delay: (i % 3) * 0.09,
          clearProps: "all",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      // How-it-works steps — alternating 3D side entries
      gsap.utils.toArray<Element>(".how-step").forEach((step, i) => {
        gsap.from(step, {
          opacity: 0,
          x: i % 2 === 0 ? -58 : 58,
          rotateY: i % 2 === 0 ? -11 : 11,
          transformPerspective: 900,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: step, start: "top 86%", once: true },
        });
      });

      // Showcase strip — rows drift in opposite y directions on scroll (depth illusion)
      gsap.to(".showcase-row-1", {
        y: -28, ease: "none",
        scrollTrigger: { trigger: ".showcase-section", start: "top bottom", end: "bottom top", scrub: 1.1 },
      });
      gsap.to(".showcase-row-2", {
        y: 28, ease: "none",
        scrollTrigger: { trigger: ".showcase-section", start: "top bottom", end: "bottom top", scrub: 1.1 },
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen text-white overflow-x-hidden" style={{ background: "#070707" }}>
      {/* Ambient mesh — fixed, always visible */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: [
          "radial-gradient(ellipse 90% 55% at 50% -5%,rgba(0,194,168,0.11) 0%,transparent 60%)",
          "radial-gradient(ellipse 50% 35% at 85% 85%,rgba(124,58,237,0.07) 0%,transparent 55%)",
        ].join(","),
      }} />

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-3 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-12 px-5 rounded-2xl"
            style={{ background: "rgba(7,7,7,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-black text-xs"
                style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 0 14px rgba(0,194,168,0.45)" }}>
                S
              </div>
              <span className="font-black text-[15px] tracking-tight" style={{ fontFamily: BG }}>Scrollr</span>
            </div>
            <div className="hidden md:flex items-center gap-7 text-[13px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>
              {[["#features", "Features"], ["#how", "How it works"], ["#pricing", "Pricing"]].map(([href, label]) => (
                <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="/login" className="px-4 py-1.5 text-[13px] transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: DM }}>Log in</Link>
              <Link href="/signup"
                className="px-4 py-1.5 text-[13px] font-bold rounded-xl text-black hover:brightness-110 transition-all"
                style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: DM }}>
                Start free →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero-section relative pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_460px] gap-14 items-center min-h-[calc(100vh-10rem)]">

            {/* Left copy — moves up slower on scroll (hero parallax layer 1) */}
            <div className="hero-copy lg:py-16">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                style={{ background: "rgba(0,194,168,0.08)", border: "1px solid rgba(0,194,168,0.22)", color: "#00C2A8", fontFamily: DM }}>
                <Sparkles className="w-3 h-3" />
                Claude AI · 8 viral slide formats
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="font-black leading-[1.0] mb-6"
                style={{ fontFamily: BG, fontSize: "clamp(3rem,6.5vw,5.25rem)", letterSpacing: "-0.035em" }}>
                Make carousels<br />that actually<br />
                <span style={{ color: "#00C2A8" }}>get saved.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
                className="text-[17px] leading-relaxed mb-10 max-w-[480px]"
                style={{ color: "rgba(255,255,255,0.48)", fontFamily: DM }}>
                Type a topic. Paste a URL. Drop a transcript.
                Claude writes every slide — hook, body, CTA — then exports
                print-ready PNGs in seconds.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.44 }}
                className="flex flex-wrap gap-3 mb-10">
                <Link href="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] text-black hover:brightness-110 active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 8px 32px rgba(0,194,168,0.28)", fontFamily: DM }}>
                  <Sparkles className="w-4 h-4" />Generate free
                </Link>
                <a href="#demo"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-[15px] transition-all hover:bg-white/[0.05]"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: DM }}>
                  See live demo <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}
                className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] mr-1" style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>For</span>
                {[{ label: "Instagram", color: "#E1306C" }, { label: "LinkedIn", color: "#0A66C2" }, { label: "X / Twitter", color: "#e5e5e5" }].map(({ label, color }) => (
                  <span key={label} className="text-[11px] font-medium px-3 py-1 rounded-full"
                    style={{ border: `1px solid ${color}28`, background: `${color}0D`, color, fontFamily: DM }}>
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.22)", fontFamily: DM }}>
                No credit card required · 3 carousels free
              </motion.p>
            </div>

            {/* Right — 3D card deck, moves up faster on scroll (hero parallax layer 2) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="hero-cards hidden lg:flex items-center justify-center">
              <DeepCardDeck />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Slide type marquee ─────────────────────────── */}
      <div className="overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="py-7 flex whitespace-nowrap w-max" style={{ animation: "marquee 22s linear infinite" }}>
          {[...SLIDE_TYPES, ...SLIDE_TYPES].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00C2A8" }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── PinnedZoom — cinematic scroll scene ──────── */}
      <PinnedZoom />

      {/* ── Carousel showcase strip ───────────────────── */}
      <section className="showcase-section py-12 px-4">
        <div className="max-w-5xl mx-auto text-center mb-4">
          <FadeUp>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)", fontFamily: DM }}>
              Real examples — slide types Scrollr generates automatically
            </p>
          </FadeUp>
        </div>
        <ShowcaseStrip />
      </section>

      {/* ── Interactive demo ─────────────────────────── */}
      <div id="demo" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <DemoSection />
      </div>

      {/* ── How it works ─────────────────────────────── */}
      <section id="how" className="py-28 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>How it works</p>
            <h2 className="font-black mb-16"
              style={{ fontFamily: BG, fontSize: "clamp(2rem,4.5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Three steps to export-ready slides
            </h2>
          </FadeUp>
          <div>
            {[
              { step: "01", title: "Give it your input", desc: "Type a topic, paste an article URL, or drop in a YouTube transcript. Scrollr handles the extraction automatically.", accent: "#00C2A8" },
              { step: "02", title: "Claude writes every slide", desc: "Generates a hook, 5–8 body slides from 8 viral formats, and a CTA — all optimized for your platform and copy science.", accent: "#7C3AED" },
              { step: "03", title: "Review, edit, export", desc: "Preview all slides, make quick inline edits, then download a ZIP of high-res PNGs ready to schedule.", accent: "#F59E0B" },
            ].map(({ step, title, desc, accent }) => (
              <div key={step} className="how-step flex gap-8 py-10 group cursor-default"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="font-black text-[3.5rem] w-16 leading-none shrink-0 select-none"
                  style={{ color: accent, opacity: 0.25, fontFamily: BG }}>{step}</div>
                <div className="pt-1 flex-1">
                  <h3 className="text-xl font-black mb-2 group-hover:text-white/90 transition-colors" style={{ fontFamily: BG }}>{title}</h3>
                  <p className="text-[15px] leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 mt-2 shrink-0 hidden md:block transition-all group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.15)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento ───────────────────────────── */}
      <section id="features" className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: DM }}>Features</p>
            <h2 className="font-black mb-16" style={{ fontFamily: BG, fontSize: "clamp(2rem,4.5vw,3.5rem)", letterSpacing: "-0.03em" }}>
              Everything you need<br />to post consistently
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Large card — md:col-span-2 */}
            <div className="bento-card md:col-span-2">
              <div className="h-full p-8 rounded-3xl flex flex-col transition-all duration-300 hover:brightness-110"
                style={{ background: "linear-gradient(135deg,rgba(0,194,168,0.09) 0%,rgba(0,0,0,0) 65%)", border: "1px solid rgba(0,194,168,0.18)" }}>
                <BookImage className="w-6 h-6 mb-6" style={{ color: "#00C2A8" }} />
                <h3 className="text-xl font-black mb-3" style={{ fontFamily: BG }}>Style Library</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.48)", fontFamily: DM }}>
                  Upload carousels you love. Claude vision classifies every slide — layout, hierarchy, palette, style.
                  Future generations search your library semantically and match those patterns to your new content.{" "}
                  <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>The more you upload, the sharper it gets.</span>
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-bold" style={{ color: "#00C2A8", fontFamily: DM }}>RAG-powered</span>
                  <div className="h-[1px] flex-1" style={{ background: "rgba(0,194,168,0.2)" }} />
                </div>
              </div>
            </div>

            <div className="bento-card">
              <div className="p-6 rounded-3xl h-full transition-all duration-300 hover:bg-white/[0.03]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Download className="w-5 h-5 mb-5" style={{ color: "#3B82F6" }} />
                <h3 className="font-black mb-2" style={{ fontFamily: BG }}>Export-ready PNGs</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>High-res PNG ZIP download. Straight to your scheduler.</p>
              </div>
            </div>

            <div className="bento-card">
              <div className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Zap className="w-5 h-5 mb-5" style={{ color: "#F59E0B" }} />
                <h3 className="font-black mb-2" style={{ fontFamily: BG }}>Multi-platform</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>Instagram 4:5, LinkedIn 1:1, X 16:9. One input, three formats.</p>
              </div>
            </div>

            <div className="bento-card">
              <div className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <BarChart3 className="w-5 h-5 mb-5" style={{ color: "#F43F5E" }} />
                <h3 className="font-black mb-2" style={{ fontFamily: BG }}>Viral copy science</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>Hooks under 12 words. Slides under 22. Written for saves.</p>
              </div>
            </div>

            <div className="bento-card">
              <div className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <ListChecks className="w-5 h-5 mb-5" style={{ color: "#7C3AED" }} />
                <h3 className="font-black mb-2" style={{ fontFamily: BG }}>8 slide formats</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", fontFamily: DM }}>Hook, body, quote, stat, checklist, before/after, tip, CTA.</p>
              </div>
            </div>

            {/* Wide bottom card */}
            <div className="bento-card md:col-span-3">
              <div className="p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 hover:brightness-105"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.09) 0%,rgba(0,0,0,0) 55%)", border: "1px solid rgba(124,58,237,0.16)" }}>
                <div>
                  <Sparkles className="w-6 h-6 mb-4" style={{ color: "#7C3AED" }} />
                  <h3 className="text-xl font-black mb-2" style={{ fontFamily: BG }}>Topic → Carousel in seconds</h3>
                  <p className="text-[14px] leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: DM }}>
                    Type a topic, paste an article URL, or drop in a YouTube transcript. Claude handles extraction, writing, and formatting. Your only job is deciding what to post.
                  </p>
                </div>
                <Link href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shrink-0 transition-all hover:brightness-110"
                  style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.35)", fontFamily: DM }}>
                  Try it free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────── */}
      <PricingSection />

      {/* ── Affiliate waitlist ───────────────────────── */}
      <AffiliateWaitlist />

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-black mb-5 leading-[1.05]"
              style={{ fontFamily: BG, fontSize: "clamp(2.5rem,6vw,4.5rem)", letterSpacing: "-0.035em" }}>
              Stop staring at<br />a blank slide.
              <span style={{ color: "#00C2A8" }}><br />Start posting.</span>
            </h2>
            <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.38)", fontFamily: DM }}>
              3 carousels free. No credit card. No catch.
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-[15px] text-black transition-all hover:brightness-110 active:scale-95"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", boxShadow: "0 16px 48px rgba(0,194,168,0.38)", fontFamily: DM }}>
              <Sparkles className="w-5 h-5" />Generate for free
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="py-10 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-sm" style={{ color: "rgba(255,255,255,0.28)" }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-black font-black text-[10px]"
              style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)" }}>S</div>
            <span className="font-bold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: BG }}>Scrollr</span>
          </div>
          <div className="flex gap-8" style={{ fontFamily: DM }}>
            {["Privacy", "Terms", "Affiliates", "Contact"].map(link => (
              <a key={link} href="#" className="transition-colors hover:text-white/60">{link}</a>
            ))}
          </div>
          <p style={{ fontFamily: DM }}>© 2026 Scrollr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
