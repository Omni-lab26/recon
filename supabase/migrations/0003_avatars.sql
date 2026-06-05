-- ============================================================
-- recon: avatars
-- profiles.avatar_url を追加し、Supabase Storage の avatars バケットを準備。
-- - avatar_url の値: null / "preset:{key}" / 公開URL の3パターン
-- - Storage パス: {user_id}/avatar (上書き運用、1ユーザー1ファイル)
-- - 認証ユーザーは自分のフォルダにのみ書き込み・更新・削除可能
-- - 読み取りは全員に公開(アバターはサイト全体で見えてOK)
-- ============================================================

-- 1. profiles テーブルに avatar_url を追加
alter table public.profiles add column if not exists avatar_url text;

-- 2. Storage バケットを作成(公開バケット)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;

-- 3. Storage のポリシー(自分のフォルダのみ書き換え可、読み取りは公開)
drop policy if exists "avatar_upload_own" on storage.objects;
drop policy if exists "avatar_update_own" on storage.objects;
drop policy if exists "avatar_delete_own" on storage.objects;
drop policy if exists "avatar_public_read" on storage.objects;

create policy "avatar_upload_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_public_read" on storage.objects for select to public
  using (bucket_id = 'avatars');
