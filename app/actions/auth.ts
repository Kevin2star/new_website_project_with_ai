// 인증 관련 Server Actions

"use server";

import { redirect } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect(routes.login);
  }
  return user;
}
