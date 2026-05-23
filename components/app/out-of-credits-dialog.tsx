"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, X, CreditCard, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  plan: string;
  onClose: () => void;
}

const CREDIT_PACKS = [
  { credits: 5  as const, price: "$3.99",  each: "$0.80", highlight: false },
  { credits: 20 as const, price: "$11.99", each: "$0.60", highlight: true  },
  { credits: 60 as const, price: "$29.99", each: "$0.50", highlight: false },
];

export function OutOfCreditsDialog({ open, plan, onClose }: Props) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleBuyCredits = async (credits: 5 | 20 | 60) => {
    setLoading(credits);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credits", credits }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl overflow-hidden"
            style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="relative p-7 pb-5"
              style={{ background: "linear-gradient(150deg,rgba(0,194,168,0.07) 0%,transparent 60%)" }}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.2)" }}>
                <Zap className="w-6 h-6" style={{ color: "#00C2A8" }} />
              </div>
              <h2 className="font-black text-xl text-white mb-1.5"
                style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
                Out of credits
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans)" }}>
                {plan === "free"
                  ? "You've used your 3 free carousels. Upgrade for a monthly quota or grab a credit pack."
                  : "You've hit your plan's monthly limit. Buy extra credits to keep going."}
              </p>
            </div>

            {/* Credit packs */}
            <div className="px-7 pb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3"
                style={{ color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-dm-sans)" }}>
                Credit packs — never expire
              </p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {CREDIT_PACKS.map((pack) => (
                  <button
                    key={pack.credits}
                    onClick={() => handleBuyCredits(pack.credits)}
                    disabled={loading !== null}
                    className="relative p-3.5 rounded-2xl text-center transition-all hover:brightness-110 disabled:opacity-60"
                    style={pack.highlight ? {
                      background: "rgba(0,194,168,0.1)",
                      border: "1px solid rgba(0,194,168,0.25)",
                      boxShadow: "0 0 20px rgba(0,194,168,0.08)",
                    } : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {pack.highlight && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black"
                        style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)" }}>
                        Best
                      </div>
                    )}
                    <p className="font-black text-lg text-white mb-0.5"
                      style={{ fontFamily: "var(--font-bricolage)" }}>
                      {loading === pack.credits ? "…" : pack.credits}
                    </p>
                    <p className="font-bold text-sm mb-0.5"
                      style={{ color: pack.highlight ? "#00C2A8" : "rgba(255,255,255,0.6)" }}>
                      {pack.price}
                    </p>
                    <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {pack.each} each
                    </p>
                  </button>
                ))}
              </div>

              {plan === "free" && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <span className="text-[10px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-dm-sans)" }}>
                      or
                    </span>
                    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                  </div>
                  <Link
                    href="/#pricing"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm text-black transition-all hover:brightness-110 mb-4"
                    style={{ background: "linear-gradient(135deg,#00C2A8,#00DFC8)", fontFamily: "var(--font-dm-sans)" }}>
                    <Sparkles className="w-4 h-4" />
                    See subscription plans →
                  </Link>
                </>
              )}

              <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-dm-sans)" }}>
                Credits stack with subscriptions · Secure checkout with Stripe
              </p>
            </div>

            {/* Refer to earn more */}
            <div className="mx-7 mb-7 p-3.5 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
              <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-dm-sans)" }}>
                Refer a friend and earn 10% of every payment they make — forever.
                <Link href="/referrals" onClick={onClose} className="ml-1 underline underline-offset-2" style={{ color: "#00C2A8" }}>
                  Get your link →
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
