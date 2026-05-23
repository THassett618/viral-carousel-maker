import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as {
      priceId?: string;
      planName?: string;
      billing?: string;
      type?: "subscription" | "credits";
      credits?: 5 | 20 | 60;
    };

    let { priceId, planName, billing } = body;
    const { type, credits } = body;

    // Resolve credit pack price IDs server-side so they're never exposed to the client
    if (type === "credits" && credits) {
      const CREDIT_PRICE_IDS: Record<number, string | undefined> = {
        5:  process.env.STRIPE_PRICE_CREDITS_5,
        20: process.env.STRIPE_PRICE_CREDITS_20,
        60: process.env.STRIPE_PRICE_CREDITS_60,
      };
      priceId = CREDIT_PRICE_IDS[credits];
      planName = planName ?? `${credits} Credits`;
      if (!priceId) {
        return NextResponse.json({ error: `STRIPE_PRICE_CREDITS_${credits} is not configured` }, { status: 500 });
      }
    }

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Look up or create Stripe customer for this user
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const isOneTime = type === "credits";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isOneTime ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/generate?checkout=success&plan=${encodeURIComponent(planName ?? "")}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan_name: planName ?? null,
        billing_period: billing ?? "monthly",
        type: type ?? "subscription",
      },
      ...(isOneTime
        ? {}
        : {
            subscription_data: {
              metadata: {
                supabase_user_id: user.id,
                plan_name: planName ?? null,
                billing_period: billing ?? "monthly",
              },
            },
          }),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
