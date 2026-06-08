"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 学習進捗(roadmap/article 完了マーク)の楽観的更新フック。
// 未ログイン時はメモリのみ(永続化されない)。ログインで DB に同期。
export function useProgress() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let alive = true;

    const load = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!alive) return;
      setSignedIn(!!u.user);
      if (u.user) {
        setLoading(true);
        const { data, error } = await supabase.from("progress").select("kind, item_id");
        if (!alive) return;
        if (!error && data) {
          setDone(new Set(data.map((r) => `${r.kind}:${r.item_id}`)));
        } else if (error) console.error("[progress] load failed:", error.message);
        setLoading(false);
      } else {
        setDone(new Set()); setLoading(false);
      }
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const isDone = (kind: string, itemId: string) => done.has(`${kind}:${itemId}`);

  const toggle = (kind: string, itemId: string) => {
    const key = `${kind}:${itemId}`;
    const wasOn = done.has(key);
    setDone((prev) => {
      const next = new Set(prev);
      if (wasOn) next.delete(key); else next.add(key);
      return next;
    });
    if (!signedIn) return;
    const supabase = createClient();
    if (wasOn) {
      supabase.from("progress").delete().match({ kind, item_id: itemId }).then(({ error }) => {
        if (error) console.error("[progress] delete failed:", error.message);
      });
    } else {
      supabase.from("progress").insert({ kind, item_id: itemId }).then(({ error }) => {
        if (error) console.error("[progress] insert failed:", error.message);
      });
    }
  };

  return { isDone, toggle, signedIn, loading };
}
