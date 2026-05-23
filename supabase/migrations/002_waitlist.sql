create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text not null default 'affiliate',
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Only service role can read/write waitlist entries (no public access)
create policy "service role only" on public.waitlist
  using (false);
