import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

// アカウント削除エンドポイント。
// service_role で auth.users を削除 → CASCADE で全データも削除。
// 必要な環境変数: SUPABASE_SERVICE_ROLE_KEY (Vercel に追加してください)

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    if (body.confirm !== "DELETE") {
      return NextResponse.json({ error: "確認コードが正しくありません" }, { status: 400 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ error: "サーバー設定が不完全です。SUPABASE_SERVICE_ROLE_KEY を Vercel に追加してください。" }, { status: 500 });
    }

    const admin = createAdmin(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[account/delete]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "削除に失敗しました" }, { status: 500 });
  }
}
