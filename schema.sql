-- Ribera Visual Engine V3 · Supabase schema
-- Ejecutar completo en Supabase SQL Editor.
-- Importante: usar ANON PUBLIC KEY en config.js. Nunca usar SERVICE_ROLE_KEY en front-end.

create extension if not exists "pgcrypto";

create table if not exists public.rve_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rve_presets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'Ribera',
  usage text not null default 'Foto',
  description text,
  settings jsonb not null default '{}'::jsonb,
  flags jsonb not null default '{}'::jsonb,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rve_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  source_filename text,
  source_path text,
  active_preset_id uuid references public.rve_presets(id) on delete set null,
  recipe jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rve_exports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.rve_projects(id) on delete set null,
  preset_name text,
  ratio text not null default 'original',
  width integer,
  height integer,
  output_path text,
  recipe jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rve_presets_owner_idx on public.rve_presets(owner_id, created_at desc);
create index if not exists rve_projects_owner_idx on public.rve_projects(owner_id, updated_at desc);
create index if not exists rve_exports_owner_idx on public.rve_exports(owner_id, created_at desc);

create or replace function public.rve_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_rve_presets_updated_at on public.rve_presets;
create trigger trg_rve_presets_updated_at
before update on public.rve_presets
for each row execute function public.rve_set_updated_at();

drop trigger if exists trg_rve_projects_updated_at on public.rve_projects;
create trigger trg_rve_projects_updated_at
before update on public.rve_projects
for each row execute function public.rve_set_updated_at();

create or replace function public.rve_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.rve_profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_rve_new_user on auth.users;
create trigger trg_rve_new_user
after insert on auth.users
for each row execute function public.rve_handle_new_user();

alter table public.rve_profiles enable row level security;
alter table public.rve_presets enable row level security;
alter table public.rve_projects enable row level security;
alter table public.rve_exports enable row level security;

drop policy if exists "profiles_select_own" on public.rve_profiles;
create policy "profiles_select_own"
  on public.rve_profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.rve_profiles;
create policy "profiles_update_own"
  on public.rve_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "presets_select_own_or_shared" on public.rve_presets;
create policy "presets_select_own_or_shared"
  on public.rve_presets for select
  using (auth.uid() = owner_id or is_shared = true);

drop policy if exists "presets_insert_own" on public.rve_presets;
create policy "presets_insert_own"
  on public.rve_presets for insert
  with check (auth.uid() = owner_id);

drop policy if exists "presets_update_own" on public.rve_presets;
create policy "presets_update_own"
  on public.rve_presets for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "presets_delete_own" on public.rve_presets;
create policy "presets_delete_own"
  on public.rve_presets for delete
  using (auth.uid() = owner_id);

drop policy if exists "projects_select_own" on public.rve_projects;
create policy "projects_select_own"
  on public.rve_projects for select
  using (auth.uid() = owner_id);

drop policy if exists "projects_insert_own" on public.rve_projects;
create policy "projects_insert_own"
  on public.rve_projects for insert
  with check (auth.uid() = owner_id);

drop policy if exists "projects_update_own" on public.rve_projects;
create policy "projects_update_own"
  on public.rve_projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "projects_delete_own" on public.rve_projects;
create policy "projects_delete_own"
  on public.rve_projects for delete
  using (auth.uid() = owner_id);

drop policy if exists "exports_select_own" on public.rve_exports;
create policy "exports_select_own"
  on public.rve_exports for select
  using (auth.uid() = owner_id);

drop policy if exists "exports_insert_own" on public.rve_exports;
create policy "exports_insert_own"
  on public.rve_exports for insert
  with check (auth.uid() = owner_id);

drop policy if exists "exports_delete_own" on public.rve_exports;
create policy "exports_delete_own"
  on public.rve_exports for delete
  using (auth.uid() = owner_id);

-- Storage privado para fuentes y exportaciones.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ribera-visual-engine',
  'ribera-visual-engine',
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cada usuario sólo puede operar dentro de su carpeta: {auth.uid()}/...
drop policy if exists "rve_storage_select_own" on storage.objects;
create policy "rve_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'ribera-visual-engine'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "rve_storage_insert_own" on storage.objects;
create policy "rve_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'ribera-visual-engine'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "rve_storage_update_own" on storage.objects;
create policy "rve_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'ribera-visual-engine'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'ribera-visual-engine'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "rve_storage_delete_own" on storage.objects;
create policy "rve_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'ribera-visual-engine'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
