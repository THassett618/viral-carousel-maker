"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UsageData {
  plan: "free" | "starter" | "pro" | "agency";
  credits: number;
  carouselsUsed: number;
  carouselLimit: number | null;
  subscriptionStatus: string | null;
  loading: boolean;
}

export function useUsage(): UsageData {
  const [data, setData] = useState<UsageData>({
    plan: "free",
    credits: 0,
    carouselsUsed: 0,
    carouselLimit: null,
    subscriptionStatus: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const [creditsRes, subRes, profileRes] = await Promise.all([
        supabase
          .from("user_credits")
          .select("balance")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("subscriptions")
          .select("plan, carousels_used, carousel_limit, status")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single(),
      ]);

      if (cancelled) return;

      const plan = (profileRes.data?.plan ?? "free") as UsageData["plan"];
      const sub = subRes.data;

      setData({
        plan,
        credits: creditsRes.data?.balance ?? 0,
        carouselsUsed: sub?.carousels_used ?? 0,
        carouselLimit: sub?.carousel_limit ?? null,
        subscriptionStatus: sub?.status ?? null,
        loading: false,
      });
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}
