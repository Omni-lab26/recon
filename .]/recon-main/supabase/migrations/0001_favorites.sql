-- ============================================================
-- recon: favorites
-- 認証済みユーザーがツールを★お気に入り登録するためのテーブル。
-- RLSで「自分の行のみ」操作可能に制限する。
-- ============================================================

create table if not exists public.favorites (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  tool_id    text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, tool_id)
);

-- API ロールへ権限付与（プロジェクト作成時に「Automatically expose new tables」を OFF にしたため明示）
grant select, insert, delete on public.favorites to authenticated;

-- 行レベルセキュリティを有効化し、自分の行のみアクセス可とする
alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);
