import { NextResponse } from "next/server";

// TODO: OAuth 콜백 처리 로직 구현 필요
export async function GET(request: Request) {
  // TODO: Supabase Auth 콜백 처리
  return NextResponse.redirect(new URL("/", request.url));
}
