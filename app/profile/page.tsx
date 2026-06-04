import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/sections/ProfileForm";

export const metadata: Metadata = { title: "プロフィール" };

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("display_name, bio").eq("id", user.id).maybeSingle();

  return (
    <ProfileForm
      userId={user.id}
      email={user.email ?? ""}
      initialName={profile?.display_name ?? ""}
      initialBio={profile?.bio ?? ""}
    />
  );
}
