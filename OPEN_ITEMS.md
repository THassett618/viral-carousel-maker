# Scrollr — Open Items

Things that need to be done before the app is fully live. Grouped by category.

---

## 1. Infrastructure (required before launch)

### Supabase
- [ ] Run `supabase/migrations/001_subscriptions.sql` against your project
  - Creates: `subscriptions`, `user_credits`, `credit_transactions`, `referrals`, `referral_commissions`
  - Adds columns to `profiles`: `stripe_customer_id`, `referral_code`, `referred_by`
- [ ] Run `supabase/migrations/002_waitlist.sql`
- [ ] Run `supabase/migrations/003_storage.sql` (creates `reference-images` storage bucket)
- [ ] Confirm `spend_credit()`, `add_credits()`, `match_reference_images()` RPCs exist

### Stripe
- [ ] Create 9 subscription products in Stripe Dashboard:
  - Starter Monthly / Quarterly / Annual → `$12 / $10.80 / $9` per month
  - Pro Monthly / Quarterly / Annual → `$29 / $26.10 / $22` per month
  - Agency Monthly / Quarterly / Annual → `$79 / $71.10 / $63` per month
- [ ] Create 3 credit pack products (one-time):
  - 5 credits → `$3.99`
  - 20 credits → `$11.99`
  - 60 credits → `$29.99`
- [ ] Copy all 12 price IDs into `.env.local` (see `.env.example` for key names)
- [ ] Register Stripe webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
  - Events to enable: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Environment variables (`.env.local`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] All 12 `STRIPE_PRICE_*` IDs
- [ ] `NEXT_PUBLIC_APP_URL` (your production domain)

---

## 2. Deploy

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] `vercel env pull` to sync env vars from Vercel dashboard
- [ ] `npm run build` — confirm zero TypeScript/build errors locally first
- [ ] Push to `main` → Vercel auto-deploys
- [ ] Test Stripe checkout end-to-end in test mode before going live

---

## 3. Code gaps (small, can build anytime)

- [ ] **PNG export** — `CarouselPreview` has an export button but the actual `html-to-canvas` + ZIP download may be a stub. Verify it works; if not, implement with `html2canvas` + `jszip`.
- [ ] **Referral attribution on signup** — the signup page needs to read `?ref=CODE` from the URL, look up the referrer's user ID, and write `profiles.referred_by` + insert a row into `referrals`. Currently the code column is auto-generated but attribution isn't wired to signup.
- [ ] **Referral commission trigger** — webhook `handleCheckoutCompleted` adds credits but doesn't yet calculate and insert into `referral_commissions` for the referrer. Needs: look up `profiles.referred_by` → find referral row → insert commission at 10%.
- [ ] **Affiliate waitlist** — landing page has an `AffiliateWaitlist` section that collects emails. The `/api/waitlist` route saves to Supabase but there's no admin view or email notification.
- [ ] **Carousel re-open from My Carousels** — the gallery links to `/generate?carousel=ID` but `GeneratePage` doesn't read that param and rehydrate the carousel. Either implement it or remove the `ExternalLink` button.
- [ ] **`formatDate` on `carousel.createdAt`** — `CarouselSpec` uses `created_at` (snake_case from Supabase) but the carousels page calls `carousel.createdAt` (camelCase). Likely throws at runtime. Fix: use `carousel.created_at`.

---

## 4. Copy / content

- [ ] Replace placeholder Stripe price IDs in `app/page.tsx` `PLANS` array (`"price_STARTER_MONTHLY"` etc.) with real IDs once Stripe products are created — OR switch the pricing section CTAs to call `/api/checkout` dynamically using plan name + billing period.
- [ ] Confirm referral payout terms copy matches whatever you actually implement (currently says "monthly payouts via Stripe once they exceed $10").
- [ ] Update `NEXT_PUBLIC_APP_URL` in welcome banner / referral link generation (currently falls back to `https://scrollr.ai`).

---

## 5. Nice-to-haves (post-launch)

- [ ] Email confirmation flow after signup (Supabase Auth can send this, just needs SMTP configured)
- [ ] Carousel editor — allow users to tweak slide text before exporting
- [ ] Scheduled posting integration (Buffer / Hypefury API)
- [ ] Analytics dashboard — show which topics + hook angles perform best across users
- [ ] Team/agency seat management UI
