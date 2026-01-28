import { NextResponse } from "next/server";

// TODO: 제품 API 로직 구현 필요 (Server Actions 사용 권장)
export async function GET() {
  // TODO: Supabase에서 제품 목록 조회
  return NextResponse.json({ products: [] });
}
