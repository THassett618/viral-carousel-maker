import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Zap,
  BookImage,
  Download,
  ArrowRight,
  Check,
  BarChart3,
  Quote,
  ListChecks,
  Repeat2,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Topic → Carousel in seconds",
    desc: "Type a topic, paste a URL, or drop in a transcript. Claude writes every slide — hook, body, stat, CTA — optimized for your platform.",
  },
  {
    icon: <BookImage className="w-5 h-5" />,
    title: "Style Library (RAG)",
    desc: "Upload carousels you love. Claude vision auto-classifies every slide. Future generations learn from your taste — permanently.",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "Export-ready PNGs",
    desc: "Every slide exports as a high-res PNG in a ZIP. Drop them directly into your scheduler, no design app needed.",
  },
  {
    icon: <Repeat2 className="w-5 h-5" />,
    title: "8 viral slide templates",
    desc: "Hook, body, quote, stat, checklist, before/after, tip, CTA. Every format that drives saves and shares.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Multi-platform formats",
    desc: "Instagram 4:5, LinkedIn 1:1, X 16:9. One input generates the right dimensions for every platform.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Viral copy science",
    desc: "Copy is written for curiosity, specificity, and scannability. Hooks under 12 words. Slides under 22 words.",
  },
];

const SLIDE_TYPES = [
  { icon: <Zap className="w-4 h-4" />, label: "Hook", color: "#F43F5E" },
  { icon: <ListChecks className="w-4 h-4" />, label: "Checklist", color: "#10B981" },
  { icon: <Quote className="w-4 h-4" />, label: "Quote", color: "#7C3AED" },
  { icon: <BarChart3 className="w-4 h-4" />, label: "Stat", color: "#F59E0B" },
  { icon: <Repeat2 className="w-4 h-4" />, label: "Before / After", color: "#3B82F6" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Tip", color: "#00C2A8" },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00C2A8] flex items-center justify-center text-black font-black text-sm">
              S
            </div>
            <span className="font-black text-lg tracking-tight">Scrollr</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 text-sm font-bold rounded-lg bg-[#00C2A8] text-black hover:bg-[#00D4BA] transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,194,168,0.15) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <Badge className="mb-6 bg-[#00C2A8]/10 text-[#00C2A8] border-[#00C2A8]/30 text-xs px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1.5 inline-block" />
            Powered by Claude AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.0] tracking-tight mb-6">
            Turn any topic into a{" "}
            <span className="text-[#00C2A8]">scroll-stopping</span>{" "}
            carousel
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Type a topic. Paste a URL. Drop in a transcript. Scrollr writes every slide,
            optimized for virality — then exports print-ready PNGs in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base bg-[#00C2A8] text-black hover:bg-[#00D4BA] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate your first carousel free
            </Link>
            <a
              href="#how"
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-base border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="text-xs text-white/30 mt-4">
            No credit card required · 5 carousels free every month
          </p>
        </div>

        <div className="max-w-xl mx-auto mt-16 flex items-center justify-center gap-4 flex-wrap">
          {[
            { label: "Instagram", color: "#E1306C" },
            { label: "LinkedIn", color: "#0A66C2" },
            { label: "X / Twitter", color: "#FFFFFF" },
          ].map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
              style={{ background: `${color}10`, borderColor: `${color}30`, color }}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Slide type strip */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-8">
            8 viral slide formats, all generated automatically
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
            {SLIDE_TYPES.map(({ icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium flex-shrink-0"
                style={{
                  borderColor: `${color}30`,
                  background: `${color}10`,
                  color,
                }}
              >
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Three steps to export-ready slides
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Give it your input",
                desc: "Type a topic, paste an article URL, or drop in a YouTube transcript. Scrollr handles the extraction.",
                accent: "#00C2A8",
              },
              {
                step: "02",
                title: "Claude writes every slide",
                desc: "The AI generates a hook, 5–8 body slides (chosen from 8 formats), and a CTA — all optimized for your platform.",
                accent: "#7C3AED",
              },
              {
                step: "03",
                title: "Review, edit, export",
                desc: "Preview all slides, make quick edits, then download a ZIP of high-res PNGs ready to schedule.",
                accent: "#F59E0B",
              },
            ].map(({ step, title, desc, accent }) => (
              <div key={step} className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div
                  className="text-4xl font-black leading-none mb-4"
                  style={{ color: accent, opacity: 0.4 }}
                >
                  {step}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Everything you need to post consistently
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Built for creators, marketers, and founders who need high-quality carousels
              without spending hours in Canva.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#00C2A8]/10 text-[#00C2A8] flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-bold mb-1.5">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Library callout */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-[#00C2A8]/20 bg-[#00C2A8]/5 p-10 md:p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00C2A8]/20 text-[#00C2A8] flex items-center justify-center mx-auto mb-6">
              <BookImage className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              The AI that learns your aesthetic
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
              Upload carousels you love. Claude vision classifies every slide automatically —
              layout, hierarchy, style. When you generate, the AI searches your library
              semantically and adapts those patterns to your new content.
              <br /><br />
              <strong className="text-white">The more you upload, the better it gets.</strong>
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#00C2A8] text-black hover:bg-[#00D4BA] transition-colors"
            >
              Build your style library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Simple, honest pricing
            </h2>
            <p className="text-white/50">Start free. Scale when it makes sense.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(({ name, price, period, features, cta, highlight }) => (
              <div
                key={name}
                className={`relative p-6 rounded-2xl border transition-all ${
                  highlight
                    ? "border-[#00C2A8]/50 bg-[#00C2A8]/5 shadow-[0_0_40px_rgba(0,194,168,0.1)]"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                {highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C2A8] text-black text-xs font-bold px-3">
                    Most popular
                  </Badge>
                )}
                <div className="mb-6">
                  <p className="text-sm font-bold text-white/50 mb-1">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{price}</span>
                    <span className="text-white/40 text-sm">{period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#00C2A8] flex-shrink-0" />
                      <span className="text-white/70">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={cn(
                    "w-full block text-center py-2.5 px-4 rounded-xl font-bold text-sm transition-colors",
                    highlight
                      ? "bg-[#00C2A8] text-black hover:bg-[#00D4BA]"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  )}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Stop staring at a blank slide.
            <br />
            <span className="text-[#00C2A8]">Start posting.</span>
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            Your first 5 carousels are free. No card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-3.5 rounded-xl font-bold text-base bg-[#00C2A8] text-black hover:bg-[#00D4BA] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#00C2A8] flex items-center justify-center text-black font-black text-xs">
              S
            </div>
            <span className="font-bold text-white/50">Scrollr</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
          <p>© 2025 Scrollr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
