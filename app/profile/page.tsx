import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TOOLS, TOOL_CATS } from "@/lib/tools-data";
import ProfileHub from "@/components/sections/ProfileHub";

export const metadata: Metadata = { title: "プロフィール" };

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("display_name, bio, avatar_url").eq("id", user.id).maybeSingle();
  const { data: favRows } = await supabase.from("favorites").select("tool_id");
  const favIds = new Set((favRows ?? []).map((r) => r.tool_id as string));
  const favTools = TOOLS.filter((t) => favIds.has(t.id)).map((t) => ({
    id: t.id, name: t.name, cat: t.cat, catName: TOOL_CATS[t.cat].name, c: TOOL_CATS[t.cat].c,
  }));

  return (
    <ProfileHub
      userId={user.id}
      email={user.email ?? ""}
      createdAt={user.created_at ?? ""}
      initialName={profile?.display_name ?? ""}
      initialBio={profile?.bio ?? ""}
      initialAvatar={profile?.avatar_url ?? null}
      favTools={favTools}
    />
  );
}
