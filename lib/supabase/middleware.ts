// 미들웨어용 Supabase

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/constants/config";
import type { Database } from "@/types/database";

export function createSupabaseMiddlewareClient(request: NextRequest) {
  // NextResponse를 통해 쿠키 set을 반영해야 세션 갱신이 유지됨
  const response = NextResponse.next({ request });

  const supabase: SupabaseClient<Database> = createServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
    }
  );

  return { supabase, response };
}
