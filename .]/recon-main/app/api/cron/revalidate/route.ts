import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Vercel Cron Job エンドポイント。
// CRON_SECRET 環境変数で保護。Vercel が自動的に Authorization ヘッダーを付与する。
// スケジュール: vercel.json の crons 設定を参照(8時間ごと)。

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/cve");
    revalidatePath("/news");
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      revalidated: ["/cve", "/news", "/"],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
