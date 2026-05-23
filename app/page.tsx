"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BookImage,
  Download,
  Zap,
  BarChart3,
  ListChecks,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockCardProps {
  type: string;
  accent: string;
  headline: string;
  sub?: string;
  slideNum?: number;
  totalSlides?: number;
  className?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDE_TYPES = [
  "Hook", "Checklist", "Quote", "Stat", "Before / After",
  "Tip", "CTA", "Body",
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 carousels / month", "All slide templates", "PNG export", "3 platforms"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    features: [
      "Unlimited carousels",
      "Style Library (RAG)",
      "URL + transcript input",
      "All platforms",
      "Priority generation",
    ],
    cta: "Get Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    features: [
      "Everything in Pro",
      "5 seats",
      "Shared style library",
      "Custom brand presets",
      "API access (soon)",
    ],
    cta: "Get Team",
    highlight: false,
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98], delay }}
    >
      {children}
    </motion.div>
  );
}

function MockCard({
  type,
  accent,
  headline,
  sub,
  slideNum = 1,
  totalSlides = 7,
}: MockCardProps) {
  return (
    <div
      className="w-52 rounded-2xl overflow-hidden flex flex-col select-none"
      style={{
        aspectRatio: "4/5",
        background: "linear-gradient(150deg, #161616 0%, #0D0D0D 100%)",
        border: `1px solid ${accent}22`,
        boxShadow: `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px ${accent}12, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)` }}
      />

      <div className="flex-1 p-5 flex flex-col">
        {/* Type label */}
        <span
          className="text-[8px] uppercase tracking-[0.25em] font-bold mb-4"
          style={{ color: accent }}
        >
          {type}
        </span>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[12px] font-black text-white leading-snug">{headline}</p>
          {sub && (
            <p className="text-[9px] text-white/40 mt-2 leading-snug">{sub}</p>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1 mt-4">
          {Array.from({ length: Math.min(totalSlides, 6) }).map((_, i) => (
            <div
              key={i}
              className="rounded-full flex-shrink-0"
              style={{
                width: i === slideNum - 1 ? 14 : 4,
                height: 3,
                background:
                  i === slideNum - 1 ? accent : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
          <span
            className="ml-auto text-[8px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {slideNum}/{totalSlides}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#070707" }}
    >
      {/* ── Ambient background ───────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(0,194,168,0.11) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 35% at 85% 85%, rgba(124,58,237,0.07) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-3 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="flex items-center justify-between h-12 px-5 rounded-2xl"
            style={{
              background: "rgba(7,7,7,0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-black text-xs flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                  boxShadow: "0 0 14px rgba(0,194,168,0.45)",
                }}
              >
                S
              </div>
              <span
                className="font-black text-[15px] tracking-tight"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Scrollr
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-7 text-[13px] text-white/45">
              {[
                ["#features", "Features"],
                ["#how", "How it works"],
                ["#pricing", "Pricing"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>

            {/* CTA group */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-4 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors rounded-lg"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-[13px] font-bold rounded-xl text-black transition-all hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                }}
              >
                Start free →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_460px] gap-14 items-center min-h-[calc(100vh-8rem)]">
            {/* Left: Text */}
            <div className="lg:py-16">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                style={{
                  background: "rgba(0,194,168,0.08)",
                  border: "1px solid rgba(0,194,168,0.22)",
                  color: "#00C2A8",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Claude AI · 8 viral slide formats
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="font-display font-black leading-[1.0] mb-6"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontSize: "clamp(3rem, 6.5vw, 5.25rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                Make carousels<br />
                that actually<br />
                <span style={{ color: "#00C2A8" }}>get saved.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="text-[17px] leading-relaxed mb-10 max-w-[480px]"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                Type a topic. Paste a URL. Drop a transcript.
                Claude writes every slide — hook, body, CTA —
                then exports print-ready PNGs in seconds.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] text-black transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                    boxShadow: "0 8px 32px rgba(0,194,168,0.28)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate free
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-[15px] transition-all hover:bg-white/[0.05]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  See how it works
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Platform pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.58 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-[11px] mr-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                  For
                </span>
                {[
                  { label: "Instagram", color: "#E1306C" },
                  { label: "LinkedIn", color: "#0A66C2" },
                  { label: "X / Twitter", color: "#e5e5e5" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="text-[11px] font-medium px-3 py-1 rounded-full"
                    style={{
                      border: `1px solid ${color}28`,
                      background: `${color}0D`,
                      color,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[11px] mt-4"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                No credit card required · 5 carousels free every month
              </motion.p>
            </div>

            {/* Right: Animated card deck */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-72 h-[400px]">
                {/* Glow orb */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,194,168,0.18) 0%, transparent 70%)",
                    animation: "glow-pulse 4s ease-in-out infinite",
                  }}
                />

                {/* Back card – CTA */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-10deg) translate(-32px, 28px)",
                    zIndex: 1,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  >
                    <MockCard
                      type="CTA"
                      accent="#7C3AED"
                      headline="Follow for weekly growth frameworks that actually work"
                      slideNum={7}
                      totalSlides={7}
                    />
                  </motion.div>
                </div>

                {/* Middle card – Stat */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-3deg) translate(-12px, 10px)",
                    zIndex: 2,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  >
                    <MockCard
                      type="STAT"
                      accent="#F59E0B"
                      headline="87%"
                      sub="of top-performing posts use a strong hook in the first slide"
                      slideNum={3}
                      totalSlides={7}
                    />
                  </motion.div>
                </div>

                {/* Front card – Hook */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(4deg) translate(8px, -8px)",
                    zIndex: 3,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MockCard
                      type="HOOK"
                      accent="#00C2A8"
                      headline="3 habits that doubled my LinkedIn reach in 30 days"
                      slideNum={1}
                      totalSlides={7}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────── */}
      <div
        className="py-8 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex whitespace-nowrap w-max"
          style={{ animation: "marquee 22s linear infinite" }}
        >
          {[...SLIDE_TYPES, ...SLIDE_TYPES].map((type, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#00C2A8" }}
              />
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────── */}
      <section id="how" className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              How it works
            </p>
            <h2
              className="font-black mb-16"
              style={{
                fontFamily: "var(--font-bricolage)",
                fontSize: "clamp(2rem,4.5vw,3.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Three steps to export-ready slides
            </h2>
          </FadeUp>

          <div>
            {[
              {
                step: "01",
                title: "Give it your input",
                desc: "Type a topic, paste an article URL, or drop in a YouTube transcript. Scrollr handles the extraction automatically.",
                accent: "#00C2A8",
              },
              {
                step: "02",
                title: "Claude writes every slide",
                desc: "Generates a hook, 5–8 body slides chosen from 8 viral formats, and a CTA — all optimized for your platform and copy science.",
                accent: "#7C3AED",
              },
              {
                step: "03",
                title: "Review, edit, export",
                desc: "Preview all slides, make quick inline edits, then download a ZIP of high-res PNGs ready to schedule immediately.",
                accent: "#F59E0B",
              },
            ].map(({ step, title, desc, accent }, i) => (
              <FadeUp key={step} delay={i * 0.1}>
                <div
                  className="flex gap-8 py-10 group cursor-default"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="font-black text-[3.5rem] w-16 leading-none shrink-0 select-none"
                    style={{ color: accent, opacity: 0.25, fontFamily: "var(--font-bricolage)" }}
                  >
                    {step}
                  </div>
                  <div className="pt-1 flex-1">
                    <h3
                      className="text-xl font-black mb-2 group-hover:text-white/90 transition-colors"
                      style={{ fontFamily: "var(--font-bricolage)" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed max-w-lg"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {desc}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 mt-2 shrink-0 hidden md:block transition-all group-hover:translate-x-1"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento ───────────────────────────── */}
      <section id="features" className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Features
            </p>
            <h2
              className="font-black mb-16"
              style={{
                fontFamily: "var(--font-bricolage)",
                fontSize: "clamp(2rem,4.5vw,3.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Everything you need<br />to post consistently
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large: Style Library */}
            <FadeUp delay={0.05} className="md:col-span-2">
              <div
                className="h-full p-8 rounded-3xl flex flex-col transition-all duration-300 hover:brightness-110"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,194,168,0.09) 0%, rgba(0,0,0,0) 65%)",
                  border: "1px solid rgba(0,194,168,0.18)",
                }}
              >
                <BookImage className="w-6 h-6 mb-6" style={{ color: "#00C2A8" }} />
                <h3
                  className="text-xl font-black mb-3"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Style Library
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.48)" }}
                >
                  Upload carousels you love. Claude vision classifies every slide automatically —
                  layout, hierarchy, palette, style. Future generations search your library
                  semantically and match those visual patterns to your new content.{" "}
                  <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                    The more you upload, the sharper it gets.
                  </span>
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span
                    className="text-[11px] uppercase tracking-widest font-bold"
                    style={{ color: "#00C2A8" }}
                  >
                    RAG-powered
                  </span>
                  <div
                    className="h-[1px] flex-1"
                    style={{ background: "rgba(0,194,168,0.2)" }}
                  />
                </div>
              </div>
            </FadeUp>

            {/* Small: Export */}
            <FadeUp delay={0.1}>
              <div
                className="p-6 rounded-3xl h-full transition-all duration-300 hover:bg-white/[0.03]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Download className="w-5 h-5 mb-5" style={{ color: "#3B82F6" }} />
                <h3
                  className="font-black mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Export-ready PNGs
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Every slide exports as a high-res PNG. ZIP download, straight to your
                  scheduler. No Canva needed.
                </p>
              </div>
            </FadeUp>

            {/* Small: Platforms */}
            <FadeUp delay={0.15}>
              <div
                className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Zap className="w-5 h-5 mb-5" style={{ color: "#F59E0B" }} />
                <h3
                  className="font-black mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Multi-platform
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Instagram 4:5, LinkedIn 1:1, X 16:9. One input, three formats.
                </p>
              </div>
            </FadeUp>

            {/* Small: Viral copy */}
            <FadeUp delay={0.2}>
              <div
                className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <BarChart3 className="w-5 h-5 mb-5" style={{ color: "#F43F5E" }} />
                <h3
                  className="font-black mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Viral copy science
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Hooks under 12 words. Slides under 22. Written for saves and shares.
                </p>
              </div>
            </FadeUp>

            {/* Small: 8 formats */}
            <FadeUp delay={0.25}>
              <div
                className="p-6 rounded-3xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <ListChecks className="w-5 h-5 mb-5" style={{ color: "#7C3AED" }} />
                <h3
                  className="font-black mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  8 slide formats
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Hook, body, quote, stat, checklist, before/after, tip, CTA. Every
                  format that converts.
                </p>
              </div>
            </FadeUp>

            {/* Full-width: Speed */}
            <FadeUp delay={0.3} className="md:col-span-3">
              <div
                className="p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 hover:brightness-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.09) 0%, rgba(0,0,0,0) 55%)",
                  border: "1px solid rgba(124,58,237,0.16)",
                }}
              >
                <div>
                  <Sparkles className="w-6 h-6 mb-4" style={{ color: "#7C3AED" }} />
                  <h3
                    className="text-xl font-black mb-2"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    Topic → Carousel in seconds
                  </h3>
                  <p
                    className="text-[14px] leading-relaxed max-w-xl"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Type a topic, paste an article URL, or drop in a YouTube transcript.
                    Claude handles extraction, writing, and formatting. Your only job is
                    deciding what to post.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shrink-0 transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "rgba(124,58,237,0.25)",
                    border: "1px solid rgba(124,58,237,0.35)",
                  }}
                >
                  Try it free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────── */}
      <section
        id="pricing"
        className="py-28 px-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <p
                className="text-[11px] uppercase tracking-[0.22em] font-bold mb-4"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Pricing
              </p>
              <h2
                className="font-black mb-3"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontSize: "clamp(2rem,4.5vw,3.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Simple, honest pricing
              </h2>
              <p style={{ color: "rgba(255,255,255,0.38)" }}>
                Start free. Scale when it makes sense.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map(({ name, price, period, features, cta, highlight }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div
                  className="relative p-7 rounded-3xl h-full flex flex-col transition-all duration-300"
                  style={{
                    background: highlight
                      ? "linear-gradient(150deg, rgba(0,194,168,0.1) 0%, rgba(0,0,0,0) 60%)"
                      : "rgba(255,255,255,0.02)",
                    border: highlight
                      ? "1px solid rgba(0,194,168,0.3)"
                      : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: highlight
                      ? "0 0 48px rgba(0,194,168,0.1)"
                      : "none",
                  }}
                >
                  {highlight && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black text-black tracking-wide"
                      style={{
                        background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-8">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-black"
                        style={{
                          fontFamily: "var(--font-bricolage)",
                          fontSize: "3rem",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {price}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[13px]">
                        <Check
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: "#00C2A8" }}
                        />
                        <span style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className="block text-center py-2.5 rounded-xl font-bold text-[13px] transition-all hover:brightness-110 active:scale-95"
                    style={
                      highlight
                        ? {
                            background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                            color: "#000",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.7)",
                          }
                    }
                  >
                    {cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2
              className="font-black mb-5 leading-[1.05]"
              style={{
                fontFamily: "var(--font-bricolage)",
                fontSize: "clamp(2.5rem,6vw,4.5rem)",
                letterSpacing: "-0.035em",
              }}
            >
              Stop staring at<br />a blank slide.
              <span style={{ color: "#00C2A8" }}><br />Start posting.</span>
            </h2>
            <p
              className="mb-10 text-lg"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Your first 5 carousels are free. No card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-[15px] text-black transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
                boxShadow: "0 16px 48px rgba(0,194,168,0.38)",
              }}
            >
              <Sparkles className="w-5 h-5" />
              Generate for free
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer
        className="py-10 px-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-sm"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-black font-black text-[10px]"
              style={{
                background: "linear-gradient(135deg, #00C2A8 0%, #00DFC8 100%)",
              }}
            >
              S
            </div>
            <span
              className="font-bold"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-bricolage)" }}
            >
              Scrollr
            </span>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-white/60"
              >
                {link}
              </a>
            ))}
          </div>
          <p>© 2026 Scrollr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
