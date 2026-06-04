import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TOOLS, TOOL_CATS } from "@/lib/tools-data";
import DashboardView from "@/components/sections/DashboardView";

export const metadata: Metadata = { title: "ダッシュボード" };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favRows } = await supabase.from("favorites").select("tool_id");
  const favIds = new Set((favRows ?? []).map((r) => r.tool_id as string));
  const favTools = TOOLS.filter((t) => favIds.has(t.id)).map((t) => ({
    id: t.id, name: t.name, cat: t.cat, catName: TOOL_CATS[t.cat].name, c: TOOL_CATS[t.cat].c,
  }));

  return (
    <DashboardView
      email={user.email ?? ""}
      createdAt={user.created_at ?? ""}
      favTools={favTools}
    />
  );
}
