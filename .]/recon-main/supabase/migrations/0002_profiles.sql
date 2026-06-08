-- ============================================================
-- recon: profiles
-- ユーザーの表示名・自己紹介を保存する。1ユーザー1行。
-- RLSで「自分の行のみ」読み書き可能に制限する。
-- ============================================================

create table if not exists public.profiles (
  id           uuid        primary key default auth.uid() references auth.users(id) on delete cascade,
  display_name text,
  bio          text,
  updated_at   timestamptz not null default now()
);

-- API ロールへ権限付与
grant select, insert, update on public.profiles to authenticated;

-- 行レベルセキュリティ
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
