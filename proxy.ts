// Next.js proxy (구 middleware) - 인증 체크
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { routes } from "@/lib/constants/routes";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

function isProtectedPath(pathname: string) {
  return pathname.startsWith(routes.myPage);
}

function isExcludedPath(pathname: string) {
  if (pathname.startsWith(routes.login)) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // 세션 갱신 + 유저 확인 (쿠키 refresh 포함)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isExcludedPath(pathname)) {
    return response;
  }

  if (isProtectedPath(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

