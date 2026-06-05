import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsView from "@/components/sections/SettingsView";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <SettingsView email={user.email ?? ""} />;
}
