"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Copy, Check, Users, DollarSign, TrendingUp, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface CommissionRow {
  id: string;
  commission_amount: number;
  status: string;
  created_at: string;
}

interface Stats {
  referralCode: string;
  referralCount: number;
  totalEarned: number;
  pendingPayout: number;
  commissions: CommissionRow[];
}

export default function ReferralsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, referralsRes] = await Promise.all([
        supabase.from("profiles").select("referral_code").eq("id", user.id).single(),
        supabase.from("referrals").select("id, total_earned, total_paid_out, status").eq("referrer_id", user.id),
      ]);

      const referralIds = (referralsRes.data ?? []).map((r) => r.id);
      let commissions: CommissionRow[] = [];
      if (referralIds.length > 0) {
        const { data } = await supabase
          .from("referral_commissions")
          .select("id, commission_amount, status, created_at")
          .eq("referrer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        commissions = data ?? [];
      }

      const allReferrals = referralsRes.data ?? [];
      const totalEarned = allReferrals.reduce((s, r) => s + Number(r.total_earned), 0);
      const totalPaid = allReferrals.reduce((s, r) => s + Number(r.total_paid_out), 0);

      setStats({
        referralCode: profileRes.data?.referral_code ?? "",
        referralCount: allReferrals.length,
        totalEarned,
        pendingPayout: totalEarned - totalPaid,
        commissions,
      });
      setLoading(false);
    };
    load();
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://scrollr.ai";
  const referralLink = stats ? `${appUrl}/signup?ref=${stats.referralCode}` : "";

  const copy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">Referrals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Earn 10% of every payment your referrals make — forever.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Referred users", value: stats.referralCount },
                { icon: DollarSign, label: "Total earned", value: `$${stats.totalEarned.toFixed(2)}` },
                { icon: TrendingUp, label: "Pending payout", value: `$${stats.pendingPayout.toFixed(2)}` },
              ].map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Icon className="w-4 h-4 mb-3" style={{ color: "#00C2A8" }} />
                  <p className="text-xl font-black text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}>
                    {value}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Referral link card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg,rgba(0,194,168,0.07) 0%,rgba(0,194,168,0.02) 100%)",
                border: "1px solid rgba(0,194,168,0.18)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,194,168,0.12)", border: "1px solid rgba(0,194,168,0.22)" }}>
                  <Gift className="w-4 h-4" style={{ color: "#00C2A8" }} />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">Your referral link</h2>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Share this link — earn 10% of every payment, forever
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3 py-2.5 rounded-xl text-[12px] font-mono truncate"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {referralLink}
                </div>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:brightness-110 flex-shrink-0"
                  style={{
                    background: copied ? "rgba(0,194,168,0.2)" : "rgba(0,194,168,0.12)",
                    border: "1px solid rgba(0,194,168,0.3)",
                    color: "#00C2A8",
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px]"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                <span>Your code:</span>
                <code className="px-1.5 py-0.5 rounded font-mono font-bold"
                  style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>
                  {stats.referralCode}
                </code>
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="font-bold text-white text-sm mb-4">How it works</h3>
              <div className="space-y-3">
                {[
                  ["Share your link", "Anyone who signs up through your link is tagged as your referral."],
                  ["They pay, you earn", "You get 10% of every subscription or credit pack they purchase — for life."],
                  ["Monthly payouts", "Earnings are paid out monthly via Stripe once they exceed $10."],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5"
                      style={{ background: "rgba(0,194,168,0.12)", color: "#00C2A8", border: "1px solid rgba(0,194,168,0.2)" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-white">{title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Commission history */}
            {stats.commissions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="px-5 py-4"
                  style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white text-sm">Commission history</h3>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {stats.commissions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-[12px] text-white font-medium">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {c.status === "paid_out" ? "Paid out" : "Pending payout"}
                        </p>
                      </div>
                      <span className="text-[13px] font-black"
                        style={{ color: c.status === "paid_out" ? "rgba(255,255,255,0.5)" : "#00C2A8" }}>
                        +${Number(c.commission_amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {stats.commissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-12 rounded-2xl"
                style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
              >
                <p className="text-sm font-semibold text-white/60">No commissions yet</p>
                <p className="text-xs text-white/30 mt-1">Share your link to start earning</p>
              </motion.div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
