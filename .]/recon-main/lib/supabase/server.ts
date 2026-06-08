import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Component / Route Handler 用。Next.js の cookies() を介してセッションを読み書きする。
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set(name, value, options) {
          try { cookieStore.set({ name, value, ...options }); } catch { /* Server Component からは設定不可 */ }
        },
        remove(name, options) {
          try { cookieStore.set({ name, value: "", ...options }); } catch { /* same */ }
        },
      },
    }
  );
}
