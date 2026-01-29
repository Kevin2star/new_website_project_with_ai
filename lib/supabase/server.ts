// 서버 Supabase 인스턴스

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { env } from "@/lib/constants/config";
import type { Database } from "@/types/database";

/** Server Components / Server Actions에서 사용하는 Supabase 클라이언트 */
export async function createSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components에서는 set이 불가능할 수 있음.
          // (Server Actions / Route Handlers에서는 정상 동작)
        }
      },
    },
  });
}
