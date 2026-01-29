// 클라이언트 Supabase 인스턴스

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/constants/config";
import type { Database } from "@/types/database";

/** Browser(Client Components)에서 사용하는 Supabase 클라이언트 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
