"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 記事・CVE のブックマーク管理フック。楽観的更新。
// 未ログイン: メモリのみ。ログイン中: Supabase bookmarks テーブルと同期。
export function useBookmarks() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let alive = true;
    const load = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!alive) return;
      setSignedIn(!!u.user);
      if (u.user) {
        const { data } = await supabase.from("bookmarks").select("kind, item_id");
        if (!alive) return;
        if (data) setSaved(new Set(data.map((r) => `${r.kind}:${r.item_id}`)));
      } else { setSaved(new Set()); }
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const isBookmarked = (kind: string, id: string) => saved.has(`${kind}:${id}`);

  const toggle = (kind: string, id: string) => {
    const key = `${kind}:${id}`;
    const was = saved.has(key);
    setSaved(prev => { const n = new Set(prev); was ? n.delete(key) : n.add(key); return n; });
    if (!signedIn) return;
    const supabase = createClient();
    if (was) supabase.from("bookmarks").delete().match({ kind, item_id: id }).then(({ error }) => { if (error) console.error("[bookmarks] delete:", error.message); });
    else supabase.from("bookmarks").insert({ kind, item_id: id }).then(({ error }) => { if (error) console.error("[bookmarks] insert:", error.message); });
  };

  return { isBookmarked, toggle, signedIn };
}
