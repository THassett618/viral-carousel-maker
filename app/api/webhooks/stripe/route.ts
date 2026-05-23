import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, CREDIT_AMOUNTS, PLAN_CAROUSEL_LIMITS } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Use the service role client — webhooks run outside user auth context
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role credentials missing");
  return createClient(url, key);
}

function planNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe
) {
  const supabase = getServiceClient();
  const userId = session.metadata?.supabase_user_id;
  if (!userId) return;

  const type = session.metadata?.type ?? "subscription";

  if (type === "credits") {
    // One-time credit pack purchase
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id ?? "";

    // Map price ID back to credit amount
    const packKey = Object.entries({
      pack5: process.env.STRIPE_PRICE_CREDITS_5,
      pack20: process.env.STRIPE_PRICE_CREDITS_20,
      pack60: process.env.STRIPE_PRICE_CREDITS_60,
    }).find(([, v]) => v === priceId)?.[0];

    const amount = packKey ? (CREDIT_AMOUNTS[packKey] ?? 0) : 0;
    if (amount > 0) {
      await supabase.rpc("add_credits", { p_user_id: userId, p_amount: amount });
    }

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount,
      type: "purchase",
      stripe_session_id: session.id,
    });
    return;
  }

  // Subscription — upsert the subscription record
  const subscriptionId = session.subscription as string | null;
  if (!subscriptionId) return;

  const planName = session.metadata?.plan_name ?? "starter";
  const billingPeriod = session.metadata?.billing_period ?? "monthly";
  const slug = planNameToSlug(planName);
  const monthlyLimit = PLAN_CAROUSEL_LIMITS[slug] ?? 30;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: sub.customer as string,
      plan: slug,
      billing_period: billingPeriod,
      status: sub.status,
      current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
      carousel_limit: monthlyLimit,
      carousels_used: 0,
    },
    { onConflict: "user_id" }
  );

  // Update the profile plan field
  await supabase.from("profiles").update({ plan: slug }).eq("id", userId);
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const supabase = getServiceClient();
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  const planName = sub.metadata?.plan_name ?? "starter";
  const billingPeriod = sub.metadata?.billing_period ?? "monthly";
  const slug = planNameToSlug(planName);
  const monthlyLimit = PLAN_CAROUSEL_LIMITS[slug] ?? 30;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer as string,
      plan: slug,
      billing_period: billingPeriod,
      status: sub.status,
      current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
      carousel_limit: monthlyLimit,
      carousels_used: 0,
    },
    { onConflict: "user_id" }
  );

  await supabase.from("profiles").update({ plan: slug }).eq("id", userId);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const supabase = getServiceClient();
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", sub.id);

  await supabase.from("profiles").update({ plan: "free" }).eq("id", userId);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
          stripe
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        // Unhandled event types are fine — just acknowledge
        break;
    }
  } catch (err) {
    console.error(`[webhook] error handling ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry — log the error for investigation
  }

  return NextResponse.json({ received: true });
}
