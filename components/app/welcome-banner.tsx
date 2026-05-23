"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";

const KEY = "scrollr_welcomed_v1";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mb-6 p-5 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(0,194,168,0.08) 0%,rgba(124,58,237,0.04) 100%)",
            border: "1px solid rgba(0,194,168,0.18)",
          }}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,194,168,0.12) 0%, transparent 70%)" }} />

          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,194,168,0.12)", border: "1px solid rgba(0,194,168,0.22)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#00C2A8" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white text-[15px] mb-1"
                style={{ fontFamily: "var(--font-bricolage)" }}>
                Welcome to Scrollr — 3 free carousels ready for you
              </h3>
              <p className="text-[13px] leading-relaxed mb-3"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans)" }}>
                Type a topic below → pick your opening hook → get export-ready slides in seconds.
                No credit card needed.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {[
                  "Pick from 4 hook angles",
                  "8 viral slide formats",
                  "PNG export as ZIP",
                ].map((step) => (
                  <div key={step} className="flex items-center gap-1.5 text-[12px]"
                    style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans)" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#00C2A8" }} />
                    {step}
                  </div>
                ))}
                <button
                  onClick={dismiss}
                  className="flex items-center gap-1 text-[12px] font-bold ml-auto transition-colors hover:opacity-80"
                  style={{ color: "#00C2A8", fontFamily: "var(--font-dm-sans)" }}
                >
                  Got it <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
