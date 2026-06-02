import { supabase } from "@/integrations/supabase/client";

export type PostLoginPath = "/admin" | "/";

export async function isAdminUser(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Unable to check admin role", error);
    return false;
  }

  return data?.role === "admin";
}

export async function getPostLoginPath(userId: string): Promise<PostLoginPath> {
  return (await isAdminUser(userId)) ? "/admin" : "/";
}