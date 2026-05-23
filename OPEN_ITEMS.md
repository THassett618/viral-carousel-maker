# Open Items — Scrollr

Design requests, feature backlog, and polish notes. Keep this updated.

---

## 🎨 Landing Page — Design

### Carousel Style Showcase
**Priority: High**
The landing page should display our most popular carousel styles and template variations
throughout — not just in the showcase strip. Show the full range of what Scrollr can
generate so visitors understand the product's breadth at a glance.

Ideas for placement:
- **Hero / DeepCardDeck**: cycle through different slide types (HOOK, STAT, QUOTE, CHECKLIST)
- **PinnedScene fan**: each of the 5 cards shows a different style variant
- **Bento features**: use real carousel slide previews as illustrations instead of icons
- **Dedicated "styles" section**: visual grid of all 8 slide types with real copy examples
- **ShowcaseStrip**: already varied — add more rare types (BEFORE/AFTER, TIP, BODY)

**Slide types to showcase across the page:**
| Type | Description |
|------|-------------|
| HOOK | Curiosity-gap opening slide |
| STAT | Big number + supporting context |
| QUOTE | Attributed pull quote |
| CHECKLIST | ✓ list format |
| TIP | Single actionable insight |
| BEFORE/AFTER | Transformation contrast |
| CTA | Call-to-action closer |
| BODY | Multi-paragraph educational slide |

---

## 🐛 Bugs

### Signup: "Database error saving new user"
**Status: Needs schema applied in Supabase**
Supabase returns this error when `supabase.auth.signUp()` is called but the
`handle_new_user()` trigger can't write to `profiles` (table doesn't exist yet).

**Fix — run these in order in Supabase Dashboard → SQL Editor:**
```
1. supabase/schema.sql
2. supabase/migrations/001_subscriptions.sql
3. supabase/migrations/002_waitlist.sql
4. supabase/migrations/003_storage.sql
```

All triggers (`handle_new_user`, `handle_new_user_credits`, `handle_new_user_referral_code`)
and all tables are defined in those files. One-time operation. Signup works immediately after.

### Affiliate Dedicated Page — Missing
**Status: Page does not exist**
There is no public-facing `/affiliate` route. The in-app `/referrals` page (requires login)
exists but there's no marketing page explaining the program pre-signup.

Needs: `app/(marketing)/affiliate/page.tsx` with:
- Program overview (25% lifetime commission, no cap)
- How it works (3 steps)
- Signup / waitlist CTA
- Social proof / earnings calculator

---

## 🎯 Features Backlog

- [ ] White/clean LP variant (Podium + Entrepedia aesthetic — warm earth, Inter, eggshell)
- [ ] Two-LP system: dark premium (current) ↔ clean white — toggle or A/B
- [ ] Affiliate dedicated public page (`/affiliate`)
- [ ] Connect actual Claude API to the generate flow end-to-end

---

## 💅 Polish

- [ ] Check remaining low-contrast text in app pages (not just landing)
- [ ] PinnedScene — verify mobile fallback renders cleanly
- [ ] Remove any remaining generic "AI slop" design elements
- [ ] Footer links — wire to real /privacy, /terms pages
