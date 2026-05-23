-- Enable pgvector for embeddings
create extension if not exists vector;

-- Users table (handled by Supabase Auth)
-- profiles extends auth.users
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'agency')),
  carousels_this_month int default 0,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Carousels
create table if not exists carousels (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  platform text not null,
  ratio text not null,
  brand jsonb not null default '{}',
  slides jsonb not null default '[]',
  topic text,
  thumbnail_url text,
  slide_count int generated always as (jsonb_array_length(slides)) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table carousels enable row level security;
create policy "Users can CRUD own carousels" on carousels for all using (auth.uid() = user_id);

create index if not exists carousels_user_id_idx on carousels(user_id);
create index if not exists carousels_created_at_idx on carousels(created_at desc);

-- Reference images (Carousel Inspo library)
create table if not exists reference_images (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  thumbnail_url text,
  title text not null,
  category text not null,
  tags text[] default '{}',
  set_id text,
  slide_index int,
  embedding vector(1536),
  source text default 'upload' check (source in ('upload', 'generated')),
  created_at timestamptz default now()
);

alter table reference_images enable row level security;
create policy "Users can CRUD own references" on reference_images for all using (auth.uid() = user_id);

create index if not exists reference_images_user_id_idx on reference_images(user_id);
create index if not exists reference_images_category_idx on reference_images(category);
create index if not exists reference_images_set_id_idx on reference_images(set_id);

-- Embedding similarity search function
create or replace function match_reference_images(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id text,
  url text,
  title text,
  category text,
  tags text[],
  similarity float
)
language sql stable
as $$
  select
    ri.id,
    ri.url,
    ri.title,
    ri.category,
    ri.tags,
    1 - (ri.embedding <=> query_embedding) as similarity
  from reference_images ri
  where ri.user_id = p_user_id
    and ri.embedding is not null
    and 1 - (ri.embedding <=> query_embedding) > match_threshold
  order by ri.embedding <=> query_embedding
  limit match_count;
$$;
