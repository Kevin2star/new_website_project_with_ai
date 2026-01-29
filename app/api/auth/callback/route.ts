import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env, getServerEnv } from "@/lib/constants/config";
import { routes } from "@/lib/constants/routes";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? routes.products;

  // 콜백 진입용 Response(쿠키 set에 필요)
  const response = NextResponse.redirect(new URL(next, url.origin));

  const supabase = createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
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
  });

  if (!code) {
    // code 없으면 로그인 화면으로 복귀
    return NextResponse.redirect(new URL(routes.login, url.origin));
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error(exchangeError);
    return NextResponse.redirect(new URL(routes.login, url.origin));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(userError);
    return NextResponse.redirect(new URL(routes.login, url.origin));
  }

  // users upsert는 서비스 롤로 수행(RLS bypass)
  const { supabaseServiceRoleKey } = getServerEnv();
  if (supabaseServiceRoleKey) {
    // Admin client는 Service Role 키를 사용하므로 서버에서만 생성/사용한다.
    // (DB 타입 제네릭은 환경에 따라 추론이 깨질 수 있어 생략)
    const admin = createClient(env.supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const googleId = (user.user_metadata?.sub as string | undefined) ?? user.id;
    const name = (user.user_metadata?.name as string | undefined) ?? null;

    const payload: Database["public"]["Tables"]["users"]["Insert"] = {
      id: user.id,
      google_id: googleId,
      email: user.email ?? null,
      name,
    };

    const { error: upsertError } = await admin.from("users").upsert(payload, { onConflict: "id" });

    if (upsertError) {
      // 로그인 자체는 성공했으므로, upsert 실패는 로깅 후 계속 진행
      console.error(upsertError);
    }
  }

  return response;
}
