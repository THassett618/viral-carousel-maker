-- ─── Extend profiles with Stripe customer ID ─────────────────────────────────
alter table profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'starter', 'pro', 'agency'));

-- ─── Subscriptions ────────────────────────────────────────────────────────────
create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users(id) on delete cascade not null unique,
  stripe_subscription_id  text unique not null,
  stripe_customer_id      text not null,
  plan                    text not null check (plan in ('starter', 'pro', 'agency')),
  billing_period          text not null check (billing_period in ('monthly', 'quarterly', 'annual')),
  status                  text not null,
  carousel_limit          int not null default 30,
  carousels_used          int not null default 0,
  current_period_start    timestamptz not null,
  current_period_end      timestamptz not null,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_stripe_sub_id_idx on subscriptions(stripe_subscription_id);

-- Reset carousels_used at start of each billing period (called by webhook)
create or replace function reset_monthly_usage(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update subscriptions set carousels_used = 0 where user_id = p_user_id;
end;
$$;

-- ─── Credits ──────────────────────────────────────────────────────────────────
create table if not exists user_credits (
  user_id   uuid references auth.users(id) on delete cascade primary key,
  balance   int not null default 0 check (balance >= 0),
  updated_at timestamptz default now()
);

alter table user_credits enable row level security;
create policy "Users can view own credits"
  on user_credits for select using (auth.uid() = user_id);

-- Initialize credits row on new user signup
create or replace function handle_new_user_credits()
returns trigger language plpgsql security definer as $$
begin
  insert into user_credits (user_id, balance) values (new.id, 3)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute procedure handle_new_user_credits();

-- Atomic credit add (used by webhook for pack purchases)
create or replace function add_credits(p_user_id uuid, p_amount int)
returns void language plpgsql security definer as $$
begin
  insert into user_credits (user_id, balance)
  values (p_user_id, p_amount)
  on conflict (user_id) do update
    set balance = user_credits.balance + excluded.balance,
        updated_at = now();
end;
$$;

-- Atomic credit spend (returns false if insufficient balance)
create or replace function spend_credit(p_user_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_balance int;
begin
  select balance into v_balance from user_credits where user_id = p_user_id for update;
  if v_balance is null or v_balance < 1 then
    return false;
  end if;
  update user_credits
    set balance = balance - 1, updated_at = now()
  where user_id = p_user_id;
  return true;
end;
$$;

-- ─── Credit transactions log ──────────────────────────────────────────────────
create table if not exists credit_transactions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete cascade not null,
  amount            int not null,
  type              text not null check (type in ('purchase', 'spend', 'refund', 'referral_bonus', 'signup_bonus')),
  stripe_session_id text,
  description       text,
  created_at        timestamptz default now()
);

alter table credit_transactions enable row level security;
create policy "Users can view own credit transactions"
  on credit_transactions for select using (auth.uid() = user_id);

create index if not exists credit_transactions_user_id_idx on credit_transactions(user_id);

-- ─── Referrals ────────────────────────────────────────────────────────────────
create table if not exists referrals (
  id              uuid primary key default gen_random_uuid(),
  referrer_id     uuid references auth.users(id) on delete cascade not null,
  referred_id     uuid references auth.users(id) on delete cascade not null unique,
  referral_code   text not null,
  status          text not null default 'pending' check (status in ('pending', 'active', 'paid_out')),
  total_earned    numeric(10,2) not null default 0,
  total_paid_out  numeric(10,2) not null default 0,
  created_at      timestamptz default now(),
  constraint no_self_referral check (referrer_id <> referred_id)
);

alter table referrals enable row level security;
create policy "Referrers can view own referrals"
  on referrals for select using (auth.uid() = referrer_id);

create index if not exists referrals_referrer_id_idx on referrals(referrer_id);
create index if not exists referrals_referral_code_idx on referrals(referral_code);

-- ─── Referral code on profiles ────────────────────────────────────────────────
alter table profiles
  add column if not exists referral_code   text unique,
  add column if not exists referred_by     uuid references auth.users(id);

-- Auto-generate referral code for new users
create or replace function handle_new_user_referral_code()
returns trigger language plpgsql security definer as $$
begin
  update profiles
    set referral_code = upper(substr(md5(new.id::text), 1, 8))
  where id = new.id;
  return new;
end;
$$;

create or replace trigger on_auth_user_created_referral
  after insert on auth.users
  for each row execute procedure handle_new_user_referral_code();

-- ─── Referral commissions log ─────────────────────────────────────────────────
create table if not exists referral_commissions (
  id                uuid primary key default gen_random_uuid(),
  referral_id       uuid references referrals(id) on delete cascade not null,
  referrer_id       uuid references auth.users(id) on delete cascade not null,
  referred_id       uuid references auth.users(id) on delete cascade not null,
  stripe_session_id text,
  gross_amount      numeric(10,2) not null,
  commission_rate   numeric(5,4) not null default 0.10,
  commission_amount numeric(10,2) not null,
  status            text not null default 'pending' check (status in ('pending', 'paid_out')),
  created_at        timestamptz default now()
);

alter table referral_commissions enable row level security;
create policy "Referrers can view own commissions"
  on referral_commissions for select using (auth.uid() = referrer_id);

create index if not exists referral_commissions_referrer_id_idx on referral_commissions(referrer_id);
