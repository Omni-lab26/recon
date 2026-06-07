-- ============================================================
-- recon: progress
-- 学習の完了マーク。ロードマップのステップと記事の読了を記録する。
-- kind は将来の拡張(lab, ctf, etc.)も見越して text。
-- ============================================================

create table if not exists public.progress (
  user_id      uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  kind         text        not null,
  item_id      text        not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);

-- 集計用インデックス
create index if not exists progress_user_completed_at_idx on public.progress (user_id, completed_at desc);

grant select, insert, delete on public.progress to authenticated;

alter table public.progress enable row level security;

create policy "progress_select_own"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "progress_insert_own"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "progress_delete_own"
  on public.progress for delete
  using (auth.uid() = user_id);
