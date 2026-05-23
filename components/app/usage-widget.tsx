"use client";

import Link from "next/link";
import { Zap, CreditCard, TrendingUp } from "lucide-react";
import { useUsage } from "@/hooks/use-usage";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:    { label: "Free",    color: "rgba(255,255,255,0.3)" },
  starter: { label: "Starter", color: "#00C2A8" },
  pro:     { label: "Pro",     color: "#7C3AED" },
  agency:  { label: "Agency",  color: "#3B82F6" },
};

export function UsageWidget() {
  const { plan, credits, carouselsUsed, carouselLimit, loading } = useUsage();

  if (loading) {
    return (
      <div className="mx-2.5 mb-2 p-3 rounded-xl animate-pulse"
        style={{ background: "rgba(255,255,255,0.03)", height: 80 }} />
    );
  }

  const planInfo = PLAN_LABELS[plan] ?? PLAN_LABELS.free;
  const isFree = plan === "free";
  const usagePercent = carouselLimit
    ? Math.min((carouselsUsed / carouselLimit) * 100, 100)
    : 0;
  const nearLimit = carouselLimit && carouselsUsed >= carouselLimit * 0.85;

  return (
    <div className="mx-2.5 mb-2 rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-3 pt-3 pb-2">
        {/* Plan badge + credits row */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: isFree ? "rgba(255,255,255,0.07)" : `${planInfo.color}18`,
              color: isFree ? "rgba(255,255,255,0.4)" : planInfo.color,
              border: isFree ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${planInfo.color}30`,
            }}
          >
            {planInfo.label}
          </span>
          <div className="flex items-center gap-1"
            style={{ color: credits === 0 ? "rgba(255,255,255,0.3)" : "#00C2A8" }}>
            <Zap className="w-3 h-3" />
            <span className="text-[11px] font-bold">{credits} credit{credits !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Subscription usage bar */}
        {carouselLimit !== null ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Carousels this period
              </span>
              <span className="text-[10px] font-semibold"
                style={{ color: nearLimit ? "#F59E0B" : "rgba(255,255,255,0.45)" }}>
                {carouselsUsed} / {carouselLimit}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: nearLimit
                    ? "linear-gradient(90deg,#F59E0B,#F97316)"
                    : `linear-gradient(90deg,${planInfo.color},${planInfo.color}CC)`,
                  boxShadow: nearLimit ? "0 0 8px rgba(245,158,11,0.5)" : undefined,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px]"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            <TrendingUp className="w-3 h-3" />
            3 free carousels included
          </div>
        )}
      </div>

      {/* CTA */}
      {isFree ? (
        <Link href="/#pricing"
          className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold transition-all hover:brightness-110"
          style={{
            background: "linear-gradient(135deg,rgba(0,194,168,0.15),rgba(0,194,168,0.08))",
            borderTop: "1px solid rgba(0,194,168,0.12)",
            color: "#00C2A8",
          }}>
          <CreditCard className="w-3 h-3" />
          Upgrade plan →
        </Link>
      ) : nearLimit ? (
        <Link href="/#pricing"
          className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold transition-all hover:brightness-110"
          style={{
            background: "rgba(245,158,11,0.08)",
            borderTop: "1px solid rgba(245,158,11,0.12)",
            color: "#F59E0B",
          }}>
          <Zap className="w-3 h-3" />
          Buy more credits →
        </Link>
      ) : null}
    </div>
  );
}
