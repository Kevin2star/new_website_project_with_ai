import { NextResponse } from "next/server";

// TODO: 문의 CRUD 로직 구현 필요
export async function GET() {
  // TODO: Supabase에서 문의 목록 조회
  return NextResponse.json({ inquiries: [] });
}

export async function POST(request: Request) {
  try {
    await request.json();
    // TODO: Supabase에 문의 생성
    return NextResponse.json({ message: "Inquiry created - to be implemented" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
