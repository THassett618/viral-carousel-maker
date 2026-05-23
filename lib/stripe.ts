import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

export const PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    quarterly: process.env.STRIPE_PRICE_STARTER_QUARTERLY ?? "",
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL ?? "",
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    quarterly: process.env.STRIPE_PRICE_PRO_QUARTERLY ?? "",
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
  },
  agency: {
    monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "",
    quarterly: process.env.STRIPE_PRICE_AGENCY_QUARTERLY ?? "",
    annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL ?? "",
  },
  credits: {
    pack5: process.env.STRIPE_PRICE_CREDITS_5 ?? "",
    pack20: process.env.STRIPE_PRICE_CREDITS_20 ?? "",
    pack60: process.env.STRIPE_PRICE_CREDITS_60 ?? "",
  },
} as const;

export const CREDIT_AMOUNTS: Record<string, number> = {
  pack5: 5,
  pack20: 20,
  pack60: 60,
};

export const PLAN_CAROUSEL_LIMITS: Record<string, number> = {
  starter: 30,
  pro: 75,
  agency: 250,
};
