-- Public bucket for carousel assets (library uploads, generated exports)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'carousel-assets',
  'carousel-assets',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Users can upload to their own folder
create policy "Users can upload own assets"
  on storage.objects for insert
  with check (
    bucket_id = 'carousel-assets'
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- Users can update/delete their own assets
create policy "Users can manage own assets"
  on storage.objects for delete
  using (
    bucket_id = 'carousel-assets'
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- Public read (bucket is public so URLs work without auth)
create policy "Public read on carousel-assets"
  on storage.objects for select
  using (bucket_id = 'carousel-assets');
