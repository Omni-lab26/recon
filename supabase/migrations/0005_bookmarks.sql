-- ============================================================
-- recon: bookmarks
-- ツール以外(記事・CVE)のブックマーク。kind + item_id でなんでも保存できる。
-- ツールお気に入りは既存の favorites テーブルを引き続き使用。
-- ============================================================
create table if not exists public.bookmarks (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  kind       text        not null,  -- 'article' | 'cve'
  item_id    text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);

grant select, insert, delete on public.bookmarks to authenticated;

alter table public.bookmarks enable row level security;

create policy "bookmarks_select_own" on public.bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on public.bookmarks for delete using (auth.uid() = user_id);

