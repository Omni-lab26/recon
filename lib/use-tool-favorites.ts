"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * ツールの★お気に入りを管理するフック。
 * - 未ログイン: その場のメモリのみ（ページ更新で消える）
 * - ログイン中: Supabase の favorites テーブルに永続化
 *   読み取り・書き込み・削除は楽観的UI（即時反映 + バックグラウンド同期）。
 * 認証状態の変化（ログイン・ログアウト）も監視し、自動で再取得・クリアする。
 */
export function useToolFavorites() {
  const [fav, setFav] = useState<Set<string>>(new Set());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let alive = true;

    const loadForUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!alive) return;
      setSignedIn(!!user);
      if (user) {
        setLoading(true);
        const { data, error } = await supabase.from("favorites").select("tool_id");
        if (!alive) return;
        if (!error && data) {
          setFav(new Set(data.map((r) => r.tool_id as string)));
        } else if (error) {
          console.error("[favorites] fetch failed:", error.message);
        }
        setLoading(false);
      } else {
        setFav(new Set());
        setLoading(false);
      }
    };

    loadForUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { loadForUser(); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const toggleFav = (id: string) => {
    const wasOn = fav.has(id);
    setFav((prev) => {
      const next = new Set(prev);
      if (wasOn) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!signedIn) return; // 未ログインはメモリのみ

    const supabase = createClient();
    if (wasOn) {
      supabase.from("favorites").delete().eq("tool_id", id).then(({ error }) => {
        if (error) console.error("[favorites] delete failed:", error.message);
      });
    } else {
      supabase.from("favorites").insert({ tool_id: id }).then(({ error }) => {
        if (error) console.error("[favorites] insert failed:", error.message);
      });
    }
  };

  return { fav, toggleFav, signedIn, loading };
}
