import { NextResponse } from "next/server";

// TODO: AI 응답 생성 로직 구현 필요
export async function POST(request: Request) {
  try {
    await request.json();
    // TODO: AI Provider 호출 로직 구현
    return NextResponse.json({ message: "AI response endpoint - to be implemented" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
